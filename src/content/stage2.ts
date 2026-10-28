export type PeriodId = 'p1' | 'p2' | 'p3'

export const STAGE2_PERIODS: readonly { id: PeriodId; label: string }[] = [
  { id: 'p1', label: 'Đầu CN – Thế kỷ VII' },
  { id: 'p2', label: 'Thế kỷ VII – XV' },
  { id: 'p3', label: 'Thế kỷ XVI – XIX' },
]

export interface Stage2Card {
  id: string
  text: string
  period: PeriodId
}

// 15 thẻ nguyên văn từ tài liệu (3 giai đoạn x 5 thẻ), gồm cả "Hình thành", "Phát triển", "Chuyển biến" (B6).
export const STAGE2_CARDS: readonly Stage2Card[] = [
  { id: 'c01', text: 'Thời kỳ hình thành', period: 'p1' },
  { id: 'c02', text: 'Văn Lang – Âu Lạc', period: 'p1' },
  { id: 'c03', text: 'Phù Nam', period: 'p1' },
  { id: 'c04', text: 'Các quốc gia đầu tiên xuất hiện', period: 'p1' },
  { id: 'c05', text: 'Bắt đầu tiếp xúc văn hóa Ấn Độ, Trung Hoa', period: 'p1' },
  { id: 'c06', text: 'Thời kỳ phát triển thịnh đạt', period: 'p2' },
  { id: 'c07', text: 'Định hình các nền văn hóa bản địa độc đáo', period: 'p2' },
  { id: 'c08', text: 'Đại Việt', period: 'p2' },
  { id: 'c09', text: 'Đế quốc Khmer', period: 'p2' },
  { id: 'c10', text: 'Pagan', period: 'p2' },
  { id: 'c11', text: 'Thời kỳ chuyển biến và suy thoái', period: 'p3' },
  { id: 'c12', text: 'Các vương quốc phong kiến suy yếu', period: 'p3' },
  { id: 'c13', text: 'Ảnh hưởng của văn minh Phương Tây', period: 'p3' },
  { id: 'c14', text: 'Thực dân xâm lược', period: 'p3' },
  { id: 'c15', text: 'Đạt được nhiều thành tựu khoa học – kĩ thuật', period: 'p3' },
]

export const STAGE2_CORRECT: Readonly<Record<string, PeriodId>> = Object.fromEntries(
  STAGE2_CARDS.map((card) => [card.id, card.period]),
)

export const STAGE2_CARD_TEXT: Readonly<Record<string, string>> = Object.fromEntries(
  STAGE2_CARDS.map((card) => [card.id, card.text]),
)
