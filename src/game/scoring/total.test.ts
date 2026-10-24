import { describe, expect, it } from 'vitest'
import { MAX_TOTAL_POINTS, calculateTotal, maxHalfForStage } from './total'

describe('tổng điểm', () => {
  it('cộng điểm bốn chặng', () => {
    expect(calculateTotal({ 1: 20, 2: 20, 3: 30, 4: 10 })).toBe(80)
  })

  it('chặng chưa hoàn thành (null) không được cộng', () => {
    expect(calculateTotal({ 1: 40, 2: null, 3: null, 4: null })).toBe(40)
    expect(calculateTotal({ 1: null, 2: null, 3: null, 4: null })).toBe(0)
  })

  it('điểm tối đa mỗi chặng là 20, 30, 40, 10 và tổng là 100', () => {
    expect([1, 2, 3, 4].map((stage) => maxHalfForStage(stage as 1 | 2 | 3 | 4) / 2)).toEqual([20, 30, 40, 10])
    expect(calculateTotal({ 1: 40, 2: 60, 3: 80, 4: 20 })).toBe(MAX_TOTAL_POINTS * 2)
  })

  it('tổng không vượt 100 dù dữ liệu đầu vào lớn bất thường', () => {
    expect(calculateTotal({ 1: 999, 2: 999, 3: 999, 4: 999 })).toBe(200)
  })

  it('điểm âm hoặc không hữu hạn không làm giảm hay phá tổng', () => {
    expect(calculateTotal({ 1: -10, 2: Number.NaN, 3: 10, 4: null })).toBe(10)
  })

  it('Chặng 5 không cộng điểm: khóa 5 trong đầu vào bị bỏ qua', () => {
    const withStage5 = { 1: 40, 2: 60, 3: 80, 4: 20, 5: 999 } as unknown as Parameters<typeof calculateTotal>[0]
    expect(calculateTotal(withStage5)).toBe(200)
    expect(() => maxHalfForStage(5 as never)).toThrow()
  })

  it('điểm có phần thập phân được giữ chính xác (87,5)', () => {
    expect(calculateTotal({ 1: 40, 2: 60, 3: 55, 4: 20 }) / 2).toBe(87.5)
  })
})
