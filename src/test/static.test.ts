import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

function listFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    return statSync(full).isDirectory() ? listFiles(full) : [full]
  })
}

const root = process.cwd()
const sources = listFiles(join(root, 'src')).filter(
  (file) => /\.(ts|tsx|css)$/.test(file) && !/\.test\.(ts|tsx)$/.test(file),
)

// Dựng chuỗi để chính file test này không bị khớp khi quét.
const FORBIDDEN = ['local' + 'Storage', 'session' + 'Storage', 'index' + 'edDB', 'document.' + 'cookie', 'fetch' + '(', 'XMLHttp' + 'Request', 'qr' + 'code']

const EMOJI = /[\u2600-\u27BF\u{1F000}-\u{1FFFF}]/u

describe('ràng buộc kỹ thuật', () => {
  it('không dùng cơ chế lưu dữ liệu, gọi mạng hoặc QR trong mã nguồn', () => {
    for (const file of sources) {
      const text = readFileSync(file, 'utf8').toLowerCase()
      for (const word of FORBIDDEN) {
        expect(text.includes(word.toLowerCase()), `${relative(root, file)} chứa ${word}`).toBe(false)
      }
    }
  })

  it('không có emoji trong mã nguồn', () => {
    for (const file of sources) {
      expect(EMOJI.test(readFileSync(file, 'utf8')), relative(root, file)).toBe(false)
    }
  })

  it('vite.config.ts dùng base /weblichsu/', () => {
    expect(readFileSync(join(root, 'vite.config.ts'), 'utf8')).toContain("base: '/weblichsu/'")
  })
})
