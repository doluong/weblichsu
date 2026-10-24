import { describe, expect, it } from 'vitest'
import { scoreStage2, stage2AwardsFragment, stage2Tier } from './stage2'

// 15 thẻ giả lập, chia đều 5 thẻ cho mỗi giai đoạn p1, p2, p3.
const periods = ['p1', 'p2', 'p3']
const correct: Record<string, string> = {}
for (let index = 0; index < 15; index += 1) correct[`c${index}`] = periods[Math.floor(index / 5)]

function placementsWithCorrect(count: number): Record<string, string | null> {
  const result: Record<string, string | null> = {}
  Object.keys(correct).forEach((id, index) => {
    result[id] = index < count ? correct[id] : null
  })
  return result
}

describe('Chặng 2 - điểm', () => {
  it('chưa đặt thẻ nào: 0 điểm', () => {
    expect(scoreStage2(placementsWithCorrect(0), correct)).toBe(0)
  })

  it('mỗi thẻ đúng 2 điểm', () => {
    expect(scoreStage2(placementsWithCorrect(1), correct) / 2).toBe(2)
    expect(scoreStage2(placementsWithCorrect(7), correct) / 2).toBe(14)
    expect(scoreStage2(placementsWithCorrect(8), correct) / 2).toBe(16)
    expect(scoreStage2(placementsWithCorrect(14), correct) / 2).toBe(28)
    expect(scoreStage2(placementsWithCorrect(15), correct) / 2).toBe(30)
  })

  it('thẻ đặt sai giai đoạn được 0 điểm', () => {
    const wrong: Record<string, string | null> = {}
    for (const id of Object.keys(correct)) wrong[id] = correct[id] === 'p1' ? 'p2' : 'p1'
    expect(scoreStage2(wrong, correct)).toBe(0)
  })

  it('cho phép hoàn thành khi chưa đặt hết (thẻ thiếu coi như chưa đặt)', () => {
    expect(scoreStage2({ c0: correct.c0 }, correct) / 2).toBe(2)
  })
})

describe('Chặng 2 - mốc thông báo', () => {
  it.each([
    [0, 'low'],
    [1, 'low'],
    [14, 'low'],
    [16, 'partial'],
    [28, 'partial'],
    [30, 'perfect'],
  ])('%i điểm -> %s', (points, tier) => {
    expect(stage2Tier(points * 2)).toBe(tier)
  })

  it('15 và 29 điểm chưa được tài liệu quy định: trả về null, không suy diễn thông báo', () => {
    expect(stage2Tier(15 * 2)).toBeNull()
    expect(stage2Tier(29 * 2)).toBeNull()
  })

  it('ngoài khoảng 0-30 hoặc có phần thập phân thì null', () => {
    expect(stage2Tier(-2)).toBeNull()
    expect(stage2Tier(62)).toBeNull()
    expect(stage2Tier(5)).toBeNull()
  })

  it('điểm khả dụng (số chẵn từ 0 đến 30) đều có mốc', () => {
    for (let points = 0; points <= 30; points += 2) expect(stage2Tier(points * 2), String(points)).not.toBeNull()
  })

  it('chỉ nhận mảnh SẢN từ 16 đến 30 điểm', () => {
    expect(stage2AwardsFragment('perfect')).toBe(true)
    expect(stage2AwardsFragment('partial')).toBe(true)
    expect(stage2AwardsFragment('low')).toBe(false)
    expect(stage2AwardsFragment(null)).toBe(false)
  })
})
