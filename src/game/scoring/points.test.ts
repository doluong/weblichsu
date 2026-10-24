import { describe, expect, it } from 'vitest'
import { countMatches, formatPoints, formatScore, toHalf, wholePoints } from './points'

describe('điểm theo nửa điểm', () => {
  it('đổi qua lại nửa điểm', () => {
    expect(toHalf(2.5)).toBe(5)
    expect(toHalf(10)).toBe(20)
    expect(() => toHalf(2.3)).toThrow(RangeError)
  })

  it('định dạng kiểu Việt Nam, số nguyên không có phần thập phân', () => {
    expect(formatPoints(5)).toBe('2,5')
    expect(formatPoints(75)).toBe('37,5')
    expect(formatPoints(80)).toBe('40')
    expect(formatPoints(0)).toBe('0')
    expect(formatScore(175, 100)).toBe('87,5/100')
  })

  it('wholePoints chỉ nhận điểm nguyên', () => {
    expect(wholePoints(30)).toBe(15)
    expect(wholePoints(31)).toBeNull()
  })

  it('countMatches không tính mục chưa trả lời', () => {
    expect(countMatches({ a: 'x', b: null }, { a: 'x', b: 'y', c: 'z' })).toBe(1)
  })
})
