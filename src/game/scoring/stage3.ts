import { countMatches, toHalf, type HalfPoints } from './points'

export const ROOM1_POINTS_PER_ITEM = 2.5
export const ROOM2_POINTS_PER_ITEM = 2.5
export const ROOM3_POINTS_PER_ITEM = 5

type Answers = Readonly<Record<string, string | null>>
type Key = Readonly<Record<string, string>>

export function scoreRoom1(placements: Answers, correctCabinets: Key): HalfPoints {
  return countMatches(placements, correctCabinets) * toHalf(ROOM1_POINTS_PER_ITEM)
}

export function scoreRoom2(answers: Answers, correct: Key): HalfPoints {
  return countMatches(answers, correct) * toHalf(ROOM2_POINTS_PER_ITEM)
}

export function scoreRoom3(answers: Answers, correct: Key): HalfPoints {
  return countMatches(answers, correct) * toHalf(ROOM3_POINTS_PER_ITEM)
}

export interface Stage3Input {
  room1: Answers
  room2: Answers
  room3: Answers
}

export interface Stage3Keys {
  room1: Key
  room2: Key
  room3: Key
}

export interface Stage3Score {
  rooms: [HalfPoints, HalfPoints, HalfPoints]
  total: HalfPoints
}

// Điểm Chặng 3 = tổng ba phòng (tối đa 10 + 10 + 20 = 40).
export function scoreStage3(input: Stage3Input, keys: Stage3Keys): Stage3Score {
  const rooms: [HalfPoints, HalfPoints, HalfPoints] = [
    scoreRoom1(input.room1, keys.room1),
    scoreRoom2(input.room2, keys.room2),
    scoreRoom3(input.room3, keys.room3),
  ]
  return { rooms, total: rooms[0] + rooms[1] + rooms[2] }
}

export type Stage3Tier = 'perfect' | 'good' | 'low'

// Mốc theo tài liệu: 40; từ 15 đến dưới 40; dưới 15. Điểm là bội số của 2,5 nên không có khoảng trống.
export function stage3Tier(total: HalfPoints): Stage3Tier | null {
  const points = total / 2
  if (!Number.isFinite(points) || points < 0 || points > 40) return null
  if (points === 40) return 'perfect'
  if (points >= 15) return 'good'
  return 'low'
}

// B13: chỉ nhận mảnh "KẾT NỐI" khi từ 15 đến 40 điểm.
export function stage3AwardsFragment(tier: Stage3Tier | null): boolean {
  return tier === 'perfect' || tier === 'good'
}
