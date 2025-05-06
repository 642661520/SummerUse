import fs from 'node:fs'

// 读取 md 的 frontmatter 指定字段
export function getMdFrontmatter(mdFilePath: string, key: string): string | null {
  if (!fs.existsSync(mdFilePath))
    return null
  const content = fs.readFileSync(mdFilePath, 'utf-8')
  // 安全提取 frontmatter 块
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
        value = trimmed.slice(6).replace(/^['"]|['"]$/g, '').trim()
        break
      }
    }
  }
  if (value)
    return value
  return null
}
