import { countMatches, toHalf, wholePoints, type HalfPoints } from './points'

export const STAGE2_POINTS_PER_CARD = 2

// Mỗi thẻ xếp đúng giai đoạn được 2 điểm; thẻ chưa đặt hoặc đặt sai được 0 (B7).
export function scoreStage2(
  placements: Readonly<Record<string, string | null>>,
  correctPeriods: Readonly<Record<string, string>>,
): HalfPoints {
  return countMatches(placements, correctPeriods) * toHalf(STAGE2_POINTS_PER_CARD)
}

export type Stage2Tier = 'perfect' | 'partial' | 'low'

// Mốc theo tài liệu: 30; 16-28; 0-14. Điểm nằm ngoài (15, 29, số lẻ, ngoài 0-30) trả về null.
export function stage2Tier(total: HalfPoints): Stage2Tier | null {
  const points = wholePoints(total)
  if (points === null || points < 0 || points > 30) return null
  if (points === 30) return 'perfect'
  if (points >= 16 && points <= 28) return 'partial'
  if (points <= 14) return 'low'
  return null
}

// B8: chỉ nhận mảnh "SẢN" khi từ 16 đến 30 điểm.
export function stage2AwardsFragment(tier: Stage2Tier | null): boolean {
  return tier === 'perfect' || tier === 'partial'
}
