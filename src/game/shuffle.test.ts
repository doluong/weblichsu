import { describe, expect, it } from 'vitest'
import { createShuffles, defaultShuffles, mulberry32, shuffle } from './shuffle'

describe('shuffle', () => {
  it('là hoán vị hợp lệ: không mất hay trùng phần tử', () => {
    const input = Array.from({ length: 15 }, (_, index) => index)
    const result = shuffle(input, mulberry32(1))
    expect([...result].sort((a, b) => a - b)).toEqual(input)
  })

  it('không làm thay đổi mảng gốc', () => {
    const input = [1, 2, 3, 4]
    shuffle(input, mulberry32(7))
    expect(input).toEqual([1, 2, 3, 4])
  })

  it('cùng seed cho cùng kết quả, khác seed thường khác nhau', () => {
    const input = Array.from({ length: 10 }, (_, index) => index)
    expect(shuffle(input, mulberry32(42))).toEqual(shuffle(input, mulberry32(42)))
    expect(shuffle(input, mulberry32(42))).not.toEqual(shuffle(input, mulberry32(43)))
  })

  it('createShuffles giữ nguyên tập phần tử và xáo riêng từng ảnh Chặng 1', () => {
    const base = defaultShuffles()
    const shuffled = createShuffles(mulberry32(5))
    for (const order of shuffled.stage1Options) expect([...order].sort()).toEqual([...base.stage1Options[0]].sort())
    expect([...shuffled.stage2Cards].sort()).toEqual([...base.stage2Cards].sort())
    expect([...shuffled.stage3Artifacts].sort()).toEqual([...base.stage3Artifacts].sort())
    expect(shuffled.stage1Options[0]).not.toEqual(shuffled.stage1Options[1])
  })

  it('xáo lựa chọn Phòng 2 và Phòng 3 nhưng giữ nguyên tập mã lựa chọn của từng mục', () => {
    const base = defaultShuffles()
    const shuffled = createShuffles(mulberry32(11))
    expect(Object.keys(shuffled.room2Options)).toEqual(Object.keys(base.room2Options))
    expect(Object.keys(shuffled.room3Options)).toEqual(Object.keys(base.room3Options))
    for (const key of Object.keys(base.room2Options)) {
      expect([...shuffled.room2Options[key]].sort()).toEqual(['A', 'B', 'C', 'D'])
    }
    for (const key of Object.keys(base.room3Options)) {
      expect([...shuffled.room3Options[key]].sort()).toEqual(['A', 'B', 'C', 'D'])
    }
    const changed = Object.keys(base.room3Options).some(
      (key) => shuffled.room3Options[key].join('') !== base.room3Options[key].join(''),
    )
    expect(changed).toBe(true)
  })
})
