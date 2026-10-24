import { describe, expect, it } from 'vitest'
import { ACTION_MAX_WORDS, ACTION_MIN_WORDS, countWords, isActionLengthValid, normalizeWhitespace } from './wordCount'

const words = (count: number) => Array.from({ length: count }, (_, index) => `từ${index + 1}`).join(' ')

describe('đếm từ', () => {
  it('chuỗi rỗng hoặc chỉ có khoảng trắng là 0 từ', () => {
    expect(countWords('')).toBe(0)
    expect(countWords('   \t\n  ')).toBe(0)
  })

  it('đếm theo khoảng trắng, mỗi âm tiết tiếng Việt là một từ', () => {
    expect(countWords('Bảo tồn di sản')).toBe(4)
    expect(countWords('Sáng tạo nội dung số quảng bá di sản')).toBe(9)
  })

  it('gộp khoảng trắng liên tiếp, tab, xuống dòng và khoảng trắng đầu/cuối', () => {
    expect(countWords('  Tham   gia\tcác\nchiến dịch  ')).toBe(5)
    expect(normalizeWhitespace('  a   b  ')).toBe('a b')
  })

  it('không chỉ dựa vào độ dài ký tự', () => {
    expect(countWords('a')).toBe(1)
    expect(countWords('Nghiêng nghiêng nghiêng')).toBe(3)
    expect(countWords('x'.repeat(500))).toBe(1)
  })

  it('từ có gạch nối là một từ; ký hiệu đứng riêng cũng tính là một từ (C9)', () => {
    expect(countWords('kế-hoạch bảo-tồn')).toBe(2)
    expect(countWords('một - hai')).toBe(3)
  })

  it('dấu câu dính liền từ không làm tăng số từ', () => {
    expect(countWords('Hãy bảo vệ di sản, giữ gìn văn hóa.')).toBe(9)
  })

  it('chuẩn hóa Unicode NFC không đổi số từ', () => {
    expect(countWords('Sa\u0309n tồn')).toBe(2)
  })

  it('khoảng 10-30 từ, tính cả hai đầu mút', () => {
    expect(ACTION_MIN_WORDS).toBe(10)
    expect(ACTION_MAX_WORDS).toBe(30)
    for (const [count, valid] of [
      [0, false],
      [1, false],
      [9, false],
      [10, true],
      [20, true],
      [30, true],
      [31, false],
      [50, false],
      [200, false],
    ] as const) {
      expect(isActionLengthValid(words(count)), `${count} từ`).toBe(valid)
    }
  })

  it('khoảng trắng thừa không làm đủ hay vượt số từ', () => {
    expect(isActionLengthValid(`   ${words(10)}   `)).toBe(true)
    expect(isActionLengthValid(words(9).replace(/ /g, '    '))).toBe(false)
  })
})
