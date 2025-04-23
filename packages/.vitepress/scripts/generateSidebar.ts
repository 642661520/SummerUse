import fs from 'node:fs'
import path from 'node:path'
import { cwd } from 'node:process'
import { globbySync } from 'globby'

interface SidebarItem {
  text: string
  link?: string
  items?: SidebarItem[]
  order?: number
}

interface GenerateSidebarOptions {
  root?: string
  exclude?: string[]
  alias?: Record<string, string>
  unifiedOrder?: Record<string, number>
  gitignorePath?: string
}

function getGitignoreDirs(gitignorePath: string): string[] {
  if (!fs.existsSync(gitignorePath))
    return []
  const content = fs.readFileSync(gitignorePath, 'utf-8')
  return content.split('\n').map(line => line.trim()).filter(Boolean)
}

function getMdFrontmatter(mdFilePath: string, key: string): string | null {
  if (!fs.existsSync(mdFilePath))
    return null
  const content = fs.readFileSync(mdFilePath, 'utf-8')
  let inFrontmatter = false
  let value: string | null = null
  const lines = content.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true
        continue
      }
      else {
        break
      }
    }
    if (inFrontmatter) {
      if (trimmed.startsWith(`${key}:`)) {
        value = trimmed.slice(key.length + 1).replace(/^['"]|['"]$/g, '').trim()
        break
      }
    }
  }
  return value
}

function sortSidebar(items: SidebarItem[]): SidebarItem[] {
  return items
    .map(item => ({
      ...item,
      items: item.items ? sortSidebar(item.items) : undefined,
    }))
    .sort((a, b) => {
      if ((a.order ?? 100) === (b.order ?? 100)) {
        return a.text.localeCompare(b.text)
      }
      return (a.order ?? 100) - (b.order ?? 100)
    })
}

export function generateSidebarFromPackages(options: GenerateSidebarOptions = {}) {
  const {
    root = 'packages',
    exclude = [],
    alias = {},
    unifiedOrder = {},
    gitignorePath = path.resolve(cwd(), '.gitignore'),
  } = options

  const gitignore = getGitignoreDirs(gitignorePath)
  const globalExcludeDirs = Array.from(new Set([...exclude, ...gitignore]))

  // 获取所有包名
  const packageDirs = globbySync(`${root}/*/index.md`, {
    // onlyDirectories: true,
    ignore: globalExcludeDirs,
  }).map(dir => dir.replace('/index.md', ''))

  // 生成一级菜单
  const allPackagesMenu = packageDirs.map((dir) => {
    const packageName = dir.replace(`${root}/`, '')
    return {
      text: alias[packageName] || packageName,
      link: packageName,
      order: unifiedOrder[packageName] ?? 100,
      items: [] as SidebarItem[],
    }
  })

  const sidebar: Record<string, SidebarItem[]> = {}

  for (const pkgPath of packageDirs) {
    const pkgName = path.basename(pkgPath)
    const sidebarKey = `/${pkgName}/`
    const items: SidebarItem[] = []

    // 递归扫描二级目录
    const subDirs = globbySync(`${pkgPath}`, {
      deep: 1,
      onlyDirectories: true,
      ignore: globalExcludeDirs,
    })

    // 处理二级目录
    for (const subDir of subDirs) {
      const subName = path.basename(subDir)

      // 三级目录
      const subItems: SidebarItem[] = []

      // 三级目录
      const thirdDirs = globbySync(`${subDir}/*`, {
        onlyDirectories: true,
        ignore: globalExcludeDirs,
      })

      // 处理三级目录下的 index.md
      for (const thirdDir of thirdDirs) {
        const thirdName = path.basename(thirdDir)
        const indexMd = path.join(thirdDir, 'index.md')
        if (fs.existsSync(indexMd)) {
          const title = getMdFrontmatter(indexMd, 'title') || alias[thirdName] || thirdName
          subItems.push({
            text: title,
            link: `/${pkgName}/${subName}/${thirdName}/`,
            order: unifiedOrder[thirdName] ?? 100,
          })
        }
      }
      // 处理二级目录下的其他 .md 文件 添加到三级目录
      const subFiles = globbySync(`${subDir}/*.md`, {
        deep: 1,
        ignore: [...globalExcludeDirs, '**/index.md'],
      })
      for (const file of subFiles) {
        const fileName = path.basename(file, '.md')
        const title = getMdFrontmatter(file, 'title') || alias[fileName] || fileName
        subItems.push({
          text: title,
          link: `/${pkgName}/${subName}/${fileName}`,
          order: unifiedOrder[fileName] ?? 100,
        })
      }

      // 处理二级目录下的 index.md
      const subIndexMd = path.join(cwd(), `${pkgPath}/${subName}/index.md`)

      const hasIndexMd = fs.existsSync(subIndexMd)
      const title = getMdFrontmatter(subIndexMd, 'title') || alias[subName] || subName
      items.push({
        text: title,
        link: hasIndexMd ? `/${pkgName}/${subName}/` : undefined,
        items: subItems.length ? subItems : undefined,
        order: unifiedOrder[subName] ?? 100,
      })
    }

    // 处理一级目录下的 其他.md 文件
    const files = globbySync(`${pkgPath}/*.md`, {
      deep: 1,
      ignore: [...globalExcludeDirs, '**/index.md'],
    })
    for (const file of files) {
      const fileName = path.basename(file, '.md')
      const title = getMdFrontmatter(file, 'title') || alias[fileName] || fileName
      items.push({
        text: title,
        link: `/${pkgName}/${fileName}`,
        order: unifiedOrder[fileName] ?? 100,
      })
    }
    const menu = JSON.parse(JSON.stringify(allPackagesMenu)) as SidebarItem[]

    menu.forEach((pkg) => {
      if (pkg.link === pkgName) {
        pkg.items = items.filter(item => item.link || item.items?.length)
      }
    })

    sidebar[sidebarKey] = sortSidebar(menu)
  }
  return sidebar
}
