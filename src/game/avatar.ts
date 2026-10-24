export const AVATAR_MAX_BYTES = 5 * 1024 * 1024
export const AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

// Chỉ nhận ảnh JPG, PNG hoặc WebP nhỏ hơn 5 MB. Ảnh chỉ dùng trong trình duyệt, không tải lên máy chủ.
export function isValidAvatarFile(file: { type: string; size: number }): boolean {
  return (AVATAR_TYPES as readonly string[]).includes(file.type) && file.size > 0 && file.size < AVATAR_MAX_BYTES
}
