import { describe, expect, it } from 'vitest'
import { AVATAR_MAX_BYTES, isValidAvatarFile } from './avatar'

describe('kiểm tra ảnh chân dung', () => {
  it('nhận JPG, PNG, WebP nhỏ hơn 5 MB', () => {
    for (const type of ['image/jpeg', 'image/png', 'image/webp']) {
      expect(isValidAvatarFile({ type, size: 1024 })).toBe(true)
    }
  })

  it('từ chối loại tệp khác, tệp rỗng và tệp quá lớn', () => {
    expect(isValidAvatarFile({ type: 'text/plain', size: 10 })).toBe(false)
    expect(isValidAvatarFile({ type: 'image/svg+xml', size: 10 })).toBe(false)
    expect(isValidAvatarFile({ type: 'image/png', size: 0 })).toBe(false)
    expect(isValidAvatarFile({ type: 'image/png', size: AVATAR_MAX_BYTES })).toBe(false)
    expect(isValidAvatarFile({ type: 'image/png', size: AVATAR_MAX_BYTES - 1 })).toBe(true)
  })
})
