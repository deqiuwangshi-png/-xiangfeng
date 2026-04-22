#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')

const workspaceRoot = process.cwd()

function toPosixPath(p) {
  return p.split(path.sep).join('/')
}

function extractComponentTreeBlock(readmeContent) {
  const sectionMarker = '### 组件文件'
  const sectionIndex = readmeContent.indexOf(sectionMarker)
  if (sectionIndex === -1) {
    throw new Error('未找到 "### 组件文件" 章节')
  }

  const blockStart = readmeContent.indexOf('```', sectionIndex)
  if (blockStart === -1) {
    throw new Error('未找到组件文件代码块开始标记')
  }

  const contentStart = blockStart + 3
  const blockEnd = readmeContent.indexOf('```', contentStart)
  if (blockEnd === -1) {
    throw new Error('未找到组件文件代码块结束标记')
  }

  return readmeContent.slice(contentStart, blockEnd).trim()
}

function parseTreePaths(treeBlock) {
  const lines = treeBlock
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean)

  const rootLine = lines.find((line) => /\/\s*$/.test(line) && !line.includes('──'))
  if (!rootLine) {
    throw new Error('组件树中未找到根目录行（示例：components/publish/）')
  }

  const rootDir = rootLine.replace(/\/\s*$/, '')
  const parsedPaths = []
  const dirsByDepth = []

  for (const rawLine of lines) {
    const match = rawLine.match(/^((?:│   |    )*)(?:├── |└── )(.+)$/)
    if (!match) continue

    const indent = match[1] || ''
    const entry = match[2].trim()
    const depth = Math.floor(indent.length / 4)
    const isDir = entry.endsWith('/')
    const name = isDir ? entry.slice(0, -1) : entry

    if (isDir) {
      dirsByDepth[depth] = name
      dirsByDepth.length = depth + 1
      continue
    }

    const parentDirs = dirsByDepth.slice(0, depth).filter(Boolean)
    const fullPath = path.posix.join(rootDir, ...parentDirs, name)
    parsedPaths.push(fullPath)
  }

  return parsedPaths
}

function checkReadme(readmeRelativePath) {
  const readmePath = path.resolve(workspaceRoot, readmeRelativePath)
  if (!fs.existsSync(readmePath)) {
    return [`README 不存在: ${readmeRelativePath}`]
  }

  const content = fs.readFileSync(readmePath, 'utf8')
  const treeBlock = extractComponentTreeBlock(content)
  const declaredFiles = parseTreePaths(treeBlock)

  const errors = []
  for (const declared of declaredFiles) {
    const absolute = path.resolve(workspaceRoot, declared)
    if (!fs.existsSync(absolute)) {
      errors.push(`声明存在但未找到文件: ${toPosixPath(declared)}`)
    }
  }
  return errors
}

function main() {
  const targets = process.argv.slice(2)
  const readmes =
    targets.length > 0
      ? targets
      : ['components/publish/README.md']

  const allErrors = []
  for (const readme of readmes) {
    try {
      const errors = checkReadme(readme)
      if (errors.length > 0) {
        allErrors.push(`\n[${toPosixPath(readme)}]`)
        allErrors.push(...errors.map((error) => `- ${error}`))
      }
    } catch (error) {
      allErrors.push(`\n[${toPosixPath(readme)}]`)
      allErrors.push(`- 校验失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  if (allErrors.length > 0) {
    console.error('README 同步检查未通过：')
    console.error(allErrors.join('\n'))
    process.exit(1)
  }

  console.log(`README 同步检查通过 (${readmes.length} 项)`)
}

main()
