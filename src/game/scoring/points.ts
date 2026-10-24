// Điểm được lưu bằng số nguyên theo đơn vị nửa điểm (2,5 điểm = 5) để tránh lỗi số thực.
export type HalfPoints = number

export function toHalf(points: number): HalfPoints {
  const half = points * 2
  if (!Number.isInteger(half)) throw new RangeError(`Điểm phải là bội số của 0,5: ${points}`)
  return half
}

export function fromHalf(half: HalfPoints): number {
  return half / 2
}

// Hiển thị kiểu Việt Nam: dấu phẩy thập phân, số nguyên không có phần thập phân (37,5 / 40).
export function formatPoints(half: HalfPoints): string {
  return String(fromHalf(half)).replace('.', ',')
}

export function formatScore(half: HalfPoints, maxPoints: number): string {
  return `${formatPoints(half)}/${maxPoints}`
}

// Số mục khớp đáp án đúng; mục chưa trả lời (null/thiếu) không được tính.
export function countMatches(
  given: Readonly<Record<string, string | null | undefined>>,
  correct: Readonly<Record<string, string>>,
): number {
  return Object.keys(correct).filter((key) => given[key] === correct[key]).length
}

// Trả về điểm nguyên (không phải nửa điểm) nếu hợp lệ; null nếu điểm có phần thập phân.
export function wholePoints(half: HalfPoints): number | null {
  const points = fromHalf(half)
  return Number.isInteger(points) ? points : null
}
