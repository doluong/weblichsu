import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { IMAGE_ASSETS, imageUrl } from './assets'

const dir = join(process.cwd(), 'public', 'images', 'placeholders')

describe('ảnh giữ chỗ', () => {
  it('mỗi vị trí có tên file và khóa duy nhất', () => {
    const files = IMAGE_ASSETS.map((image) => image.file)
    const keys = IMAGE_ASSETS.map((image) => image.key)
    expect(new Set(files).size).toBe(files.length)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('mỗi file được khai báo đều tồn tại trong public/images/placeholders', () => {
    for (const image of IMAGE_ASSETS) {
      expect(existsSync(join(dir, image.file)), image.file).toBe(true)
    }
  })

  it('không có file thừa chưa khai báo', () => {
    const declared = new Set(IMAGE_ASSETS.map((image) => image.file))
    for (const file of readdirSync(dir)) expect(declared.has(file), file).toBe(true)
  })

  it('không dùng chung một ảnh cho nhiều vị trí (nội dung file khác nhau)', () => {
    const hashes = IMAGE_ASSETS.map((image) =>
      createHash('sha256').update(readFileSync(join(dir, image.file))).digest('hex'),
    )
    expect(new Set(hashes).size).toBe(hashes.length)
  })

  it('đường dẫn được dựng từ BASE_URL của Vite (base thật /weblichsu/ được kiểm tra trên bản build)', () => {
    expect(imageUrl('mysteryAngkorWat')).toBe(
      `${import.meta.env.BASE_URL}images/placeholders/mystery-angkor-wat-placeholder.jpg`,
    )
  })
})
