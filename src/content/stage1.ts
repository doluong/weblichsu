import type { ImageKey } from '../config/assets'

// 4 lựa chọn dùng chung cho cả hai ảnh (người dùng cung cấp, đã sửa chính tả theo OPEN_QUESTIONS G.C3).
// Nhãn "Chùa Bô-rô-bu-đua" theo bản người dùng chỉnh trong SCORING_RULES.md (đề xuất, chờ duyệt cuối: H2.1).
export const STAGE1_OPTIONS = [
  { id: 'angkor-wat', label: 'Đền Angkor Wat (Campuchia)' },
  { id: 'borobudur', label: 'Chùa Bô-rô-bu-đua (Indonesia)' },
  { id: 'shwedagon', label: 'Chùa Shwedagon (Myanmar)' },
  { id: 'wat-rong-khun', label: 'Đền Wat Rong Khun (Thái Lan)' },
] as const

export interface Stage1Image {
  id: string
  imageKey: ImageKey
  alt: string
  correctOptionId: string
}

// Ảnh 1 đáp án đúng là Angkor Wat, ảnh 2 là Bô-rô-bu-đua (G.C3c).
export const STAGE1_IMAGES: readonly [Stage1Image, Stage1Image] = [
  { id: 'mystery-1', imageKey: 'mysteryAngkorWat', alt: 'Bức ảnh bí ẩn 1', correctOptionId: 'angkor-wat' },
  { id: 'mystery-2', imageKey: 'mysteryBorobudur', alt: 'Bức ảnh bí ẩn 2', correctOptionId: 'borobudur' },
]

export const STAGE1_OPTION_LABELS: Readonly<Record<string, string>> = Object.fromEntries(
  STAGE1_OPTIONS.map((option) => [option.id, option.label]),
)

export const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const
