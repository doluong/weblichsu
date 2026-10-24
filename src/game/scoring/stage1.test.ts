import { describe, expect, it } from 'vitest'
import {
  canSubmitStage1,
  countOpenedTiles,
  scoreStage1,
  scoreStage1Image,
  stage1AwardsFragment,
  stage1Tier,
} from './stage1'

const image = (openedTiles: number, selected: string | null, correct = 'right') => ({
  openedTiles,
  selectedOptionId: selected,
  correctOptionId: correct,
})

describe('Chặng 1 - điểm mỗi ảnh', () => {
  it.each([
    [1, 20],
    [2, 16],
    [3, 12],
    [4, 8],
  ])('đúng khi mở %i ô được %i nửa điểm', (opened, half) => {
    expect(scoreStage1Image(image(opened, 'right'))).toBe(half)
  })

  it.each([1, 2, 3, 4])('trả lời sai khi mở %i ô được 0 điểm', (opened) => {
    expect(scoreStage1Image(image(opened, 'wrong'))).toBe(0)
  })

  it('không tính điểm chỉ theo số ô mở: phải kiểm tra đáp án', () => {
    expect(scoreStage1Image(image(1, 'wrong'))).toBe(0)
    expect(scoreStage1Image(image(4, 'right'))).toBeGreaterThan(0)
  })

  it('từ chối 0 ô, quá 4 ô, số lẻ và chưa chọn đáp án', () => {
    expect(() => scoreStage1Image(image(0, 'right'))).toThrow(RangeError)
    expect(() => scoreStage1Image(image(5, 'right'))).toThrow(RangeError)
    expect(() => scoreStage1Image(image(1.5, 'right'))).toThrow(RangeError)
    expect(() => scoreStage1Image(image(2, null))).toThrow(RangeError)
  })
})

describe('Chặng 1 - tổng hai ảnh', () => {
  it('cộng điểm riêng từng ảnh, tối đa 20 điểm', () => {
    expect(scoreStage1([image(1, 'right'), image(1, 'right')])).toEqual({ perImage: [20, 20], total: 40 })
    expect(scoreStage1([image(1, 'right'), image(4, 'wrong')])).toEqual({ perImage: [20, 0], total: 20 })
    expect(scoreStage1([image(3, 'wrong'), image(2, 'wrong')]).total).toBe(0)
  })

  it('bấm xác nhận nhiều lần với cùng dữ liệu cho cùng kết quả (hàm thuần, không cộng dồn)', () => {
    const input = [image(2, 'right'), image(3, 'right')]
    const first = scoreStage1(input)
    expect(scoreStage1(input)).toEqual(first)
    expect(scoreStage1(input)).toEqual(first)
  })

  it('đếm ô đã mở và điều kiện bật nút Hoàn thành', () => {
    expect(countOpenedTiles([true, false, true, false])).toBe(2)
    const none = [
      [false, false, false, false],
      [false, false, false, false],
    ]
    const one = [
      [true, false, false, false],
      [false, false, true, false],
    ]
    expect(canSubmitStage1(none, ['a', 'b'])).toBe(false)
    expect(canSubmitStage1(one, ['a', null])).toBe(false)
    expect(canSubmitStage1([one[0], none[1]], ['a', 'b'])).toBe(false)
    expect(canSubmitStage1(one, ['a', 'b'])).toBe(true)
  })
})

describe('Chặng 1 - mốc thông báo', () => {
  it.each([
    [40, 'perfect'],
    [36, 'wise'],
    [32, 'wise'],
    [28, 'persevering'],
    [20, 'persevering'],
    [16, 'persevering'],
    [14, 'none'],
    [8, 'none'],
    [0, 'none'],
  ])('%i nửa điểm -> %s', (half, tier) => {
    expect(stage1Tier(half)).toBe(tier)
  })

  it('điểm chưa được quy định (15, 19, số lẻ và ngoài 0-20) trả về null, không suy diễn', () => {
    for (const half of [30, 38, 29, 42, -2, 1]) expect(stage1Tier(half), String(half)).toBeNull()
  })

  it('17 điểm nằm trong khoảng 16-18 của tài liệu nên thuộc mốc "thông thái" (dù không thể đạt được)', () => {
    expect(stage1Tier(34)).toBe('wise')
  })

  it('tổng khả dụng của hai ảnh không rơi vào khoảng chưa quy định', () => {
    const perImage = [0, 4, 6, 8, 10]
    for (const a of perImage) for (const b of perImage) expect(stage1Tier((a + b) * 2), `${a}+${b}`).not.toBeNull()
  })

  it('chỉ nhận mảnh DI từ 8 điểm', () => {
    expect(stage1AwardsFragment('perfect')).toBe(true)
    expect(stage1AwardsFragment('wise')).toBe(true)
    expect(stage1AwardsFragment('persevering')).toBe(true)
    expect(stage1AwardsFragment('none')).toBe(false)
    expect(stage1AwardsFragment(null)).toBe(false)
  })
})
