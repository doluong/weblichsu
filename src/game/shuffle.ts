import { STAGE1_IMAGES, STAGE1_OPTIONS } from '../content/stage1'
import { STAGE2_CARDS } from '../content/stage2'
import { ROOM1_ARTIFACTS, ROOM2_BLANKS, ROOM3_QUESTIONS } from '../content/stage3'

export type Rng = () => number

// Fisher-Yates; không làm thay đổi mảng gốc.
export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

// RNG xác định theo seed, dùng cho test.
export function mulberry32(seed: number): Rng {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface Shuffles {
  stage1Options: [string[], string[]]
  stage2Cards: string[]
  stage3Artifacts: string[]
  // Thứ tự lựa chọn của từng chỗ trống (Phòng 2) và từng câu hỏi (Phòng 3), theo mã lựa chọn (L.K1.6).
  room2Options: Record<string, string[]>
  room3Options: Record<string, string[]>
}

function optionIdsByKey(items: readonly { id: string; options: readonly { id: string }[] }[]): Record<string, string[]> {
  return Object.fromEntries(items.map((item) => [item.id, item.options.map((option) => option.id)]))
}

export function defaultShuffles(): Shuffles {
  const optionIds = STAGE1_OPTIONS.map((option) => option.id as string)
  return {
    stage1Options: [[...optionIds], [...optionIds]],
    stage2Cards: STAGE2_CARDS.map((card) => card.id),
    stage3Artifacts: ROOM1_ARTIFACTS.map((item) => item.id),
    room2Options: optionIdsByKey(ROOM2_BLANKS),
    room3Options: optionIdsByKey(ROOM3_QUESTIONS),
  }
}

function shuffleValues(map: Record<string, string[]>, rng: Rng): Record<string, string[]> {
  return Object.fromEntries(Object.entries(map).map(([key, ids]) => [key, shuffle(ids, rng)]))
}

// Mỗi ảnh Chặng 1 xáo lựa chọn riêng; Ngân hàng thẻ Chặng 2, hiện vật Phòng 1 và lựa chọn Phòng 2-3 xáo ngẫu nhiên.
export function createShuffles(rng: Rng = Math.random): Shuffles {
  const base = defaultShuffles()
  return {
    stage1Options: STAGE1_IMAGES.map(() => shuffle(base.stage1Options[0], rng)) as [string[], string[]],
    stage2Cards: shuffle(base.stage2Cards, rng),
    stage3Artifacts: shuffle(base.stage3Artifacts, rng),
    room2Options: shuffleValues(base.room2Options, rng),
    room3Options: shuffleValues(base.room3Options, rng),
  }
}
