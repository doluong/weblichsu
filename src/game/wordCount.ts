export const ACTION_MIN_WORDS = 30
export const ACTION_MAX_WORDS = 50

// B22: chuẩn hóa khoảng trắng (NFC, gộp khoảng trắng liên tiếp, cắt đầu/cuối) rồi đếm theo khoảng trắng.
// Tiếng Việt viết rời từng âm tiết nên mỗi âm tiết được tính là một "từ". Từ có gạch nối (ví dụ "kế-hoạch")
// được tính là một từ; ký hiệu đứng riêng (ví dụ "-") cũng được tính là một từ (OPEN_QUESTIONS C9).
export function normalizeWhitespace(text: string): string {
  return text.normalize('NFC').replace(/\s+/g, ' ').trim()
}

export function countWords(text: string): number {
  const normalized = normalizeWhitespace(text)
  return normalized === '' ? 0 : normalized.split(' ').length
}

// Từ 30 đến 50 từ, tính cả hai đầu mút.
export function isActionLengthValid(text: string): boolean {
  const words = countWords(text)
  return words >= ACTION_MIN_WORDS && words <= ACTION_MAX_WORDS
}
