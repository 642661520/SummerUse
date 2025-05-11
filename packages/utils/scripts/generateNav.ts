import type { DefaultTheme } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { cwd } from 'node:process'
import { globbySync } from 'globby'
import { getGitignoreDirs, getMdFrontmatter } from './common'

interface NavItem {
  order: number
  path?: string
  items?: NavItem[]
  text: string
  link?: string
}

interface GenerateNavOptions {
  root?: string
  exclude?: string[] // 支持 globby 格式
  changelogName?: string
  defaultNav?: ({ text: string, link: string, order?: number })[] // 支持 order
  unifiedOrder?: Record<string, number> // 合并排序配置
  gitignorePath?: string
  // 别名
  alias?: Record<string, string>
}

function sortNavRecursively(nav: NavItem[]): NavItem[] {
  // 递归排序
  return nav.map((item) => {
    if (item.items) {
      item.items = sortNavRecursively(item.items)
    }
    return item
  })
    .sort((a, b) => {
      if (a.order === b.order)
        return a.text.localeCompare(b.text)
      return a.order - b.order
    })
}

export function generateNavFromPackages(options: GenerateNavOptions = {}) {
  const {
    root = 'packages',
    exclude = [],
    defaultNav = [],
    unifiedOrder = {},
    gitignorePath = path.resolve(cwd(), '.gitignore'),
    alias = {},
  } = options
  // 自动合并 .gitignore 目录
  const gitignore = getGitignoreDirs(gitignorePath)
  // 全局排除目录
  const globalExcludeDirs = Array.from(new Set([...exclude, ...gitignore]))

  const nav: NavItem[] = []
  // defaultNav 支持 order 字段
  if (defaultNav && Array.isArray(defaultNav)) {
    nav.push(...defaultNav.map(item => ({
      ...item,
      order: item.order ?? 0,
    })))
  }
  // 新增：使用 globby 查找包目录
  const packageDirs = globbySync(root, {
    deep: 1,
    onlyDirectories: true,
    ignore: globalExcludeDirs,
  })

  for (const packageDir of packageDirs) {
    const packageName = path.basename(packageDir)
    const modelDirs = globbySync(`${packageDir}`, {
      deep: 1,
      onlyDirectories: true,
      ignore: globalExcludeDirs,
    })
    const items: NavItem[] = []
    if (modelDirs.length) {
      const itemDirs = globbySync(`${packageDir}/*.md`, {
        deep: 1,
        ignore: [...globalExcludeDirs, '**/index.md'],
      })
      modelDirs.forEach((dir) => {
        itemDirs.push(...globbySync(`${dir}/index.md`, {
          deep: 1,
          ignore: globalExcludeDirs,
        }))
      })
      itemDirs.forEach((dir) => {
        const fullPath = path.join(cwd(), dir)
        const modelName = path.basename(dir.replace(/\/index\.md$/, '').replace('.md', ''))
        const title = getMdFrontmatter(fullPath, 'title') || alias[modelName] || modelName
        const _order = getMdFrontmatter(fullPath, 'order')
        const order = unifiedOrder[modelName] ?? (_order ? Number(_order) : 100)
        items.push({
          text: title,
          link: `/${packageName}/${modelName}`,
          path: fullPath,
          order,
        })
      })
    }
    /// 判断目录下是否有index.md
    const indexPth = path.join(cwd(), `${packageDir}/index.md`)
    const hasIndex = fs.existsSync(indexPth)
    const pkgTitle = hasIndex ? getMdFrontmatter(indexPth, 'title') : undefined
    const link = packageName.replace(`${root}/`, '')
    const _order = getMdFrontmatter(indexPth, 'order')
    const pkgOrder = unifiedOrder[packageName] ?? (_order ? Number(_order) : 100)
    if (items.length > 0) {
      nav.push({ text: pkgTitle || alias[link] || link, items, order: pkgOrder })
    }
    else if (hasIndex) {
      nav.push({ text: pkgTitle || alias[link] || link, link, order: pkgOrder })
    }
  }

  return sortNavRecursively(nav) as DefaultTheme.NavItem[]
}
