import { describe, expect, it } from 'vitest'
import {
  scoreRoom1,
  scoreRoom2,
  scoreRoom3,
  scoreStage3,
  stage3AwardsFragment,
  stage3Tier,
  type Stage3Keys,
} from './stage3'

const keys: Stage3Keys = {
  room1: { a: 'c1', b: 'c2', c: 'c3', d: 'c4' },
  room2: { q1: 'B', q2: 'A', q3: 'B', q4: 'B' },
  room3: { r1: 'B', r2: 'A', r3: 'B', r4: 'B' },
}

const empty = { room1: {}, room2: {}, room3: {} }
const full = { room1: keys.room1, room2: keys.room2, room3: keys.room3 }

describe('Chặng 3 - từng phòng', () => {
  it('Phòng 1: 2,5 điểm mỗi hiện vật, tối đa 10', () => {
    expect(scoreRoom1({}, keys.room1)).toBe(0)
    expect(scoreRoom1({ a: 'c1' }, keys.room1)).toBe(5)
    expect(scoreRoom1({ a: 'c1', b: 'c9' }, keys.room1)).toBe(5)
    expect(scoreRoom1(keys.room1, keys.room1)).toBe(20)
  })

  it('Phòng 2: 2,5 điểm mỗi từ, tối đa 10', () => {
    expect(scoreRoom2({ q1: 'B', q2: 'B', q3: 'B' }, keys.room2)).toBe(10)
    expect(scoreRoom2(keys.room2, keys.room2)).toBe(20)
  })

  it('Phòng 3: 5 điểm mỗi câu, tối đa 20', () => {
    expect(scoreRoom3({ r1: 'B' }, keys.room3)).toBe(10)
    expect(scoreRoom3(keys.room3, keys.room3)).toBe(40)
    expect(scoreRoom3({ r1: 'A', r2: 'B', r3: 'A', r4: 'A' }, keys.room3)).toBe(0)
  })
})

describe('Chặng 3 - tổng hợp', () => {
  it('điểm tối đa là 40', () => {
    const score = scoreStage3(full, keys)
    expect(score.rooms).toEqual([20, 20, 40])
    expect(score.total).toBe(80)
    expect(score.total / 2).toBe(40)
  })

  it('điểm bằng 0 khi không đúng mục nào', () => {
    expect(scoreStage3(empty, keys)).toEqual({ rooms: [0, 0, 0], total: 0 })
  })

  it('tổng hợp ba phòng, có thể ra số thập phân (37,5)', () => {
    const score = scoreStage3(
      { room1: { a: 'c1', b: 'c2', c: 'c3' }, room2: keys.room2, room3: keys.room3 },
      keys,
    )
    expect(score.rooms.map((half) => half / 2)).toEqual([7.5, 10, 20])
    expect(score.total / 2).toBe(37.5)
  })
})

describe('Chặng 3 - mốc thông báo', () => {
  it.each([
    [40, 'perfect'],
    [37.5, 'good'],
    [15, 'good'],
    [12.5, 'low'],
    [0, 'low'],
  ])('%d điểm', (points, tier) => {
    expect(stage3Tier(points * 2)).toBe(tier)
  })

  it('ngoài 0-40 trả về null', () => {
    expect(stage3Tier(-1)).toBeNull()
    expect(stage3Tier(81)).toBeNull()
  })

  it('mọi điểm khả dụng (bội số 2,5) đều có mốc', () => {
    for (let half = 0; half <= 80; half += 5) expect(stage3Tier(half), String(half)).not.toBeNull()
  })

  it('chỉ nhận mảnh KẾT NỐI từ 15 điểm', () => {
    expect(stage3AwardsFragment('perfect')).toBe(true)
    expect(stage3AwardsFragment('good')).toBe(true)
    expect(stage3AwardsFragment('low')).toBe(false)
    expect(stage3AwardsFragment(null)).toBe(false)
  })
})
