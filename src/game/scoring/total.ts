import { getStage, type ScoredStageId } from '../../config/stages'
import { toHalf, type HalfPoints } from './points'

export const MAX_TOTAL_POINTS = 100

const SCORED_STAGES: readonly ScoredStageId[] = [1, 2, 3, 4]

export type StageScores = Readonly<Record<ScoredStageId, HalfPoints | null>>

export function maxHalfForStage(stage: ScoredStageId): HalfPoints {
  const max = getStage(stage).maxPoints
  if (max === null) throw new Error(`Chặng ${stage} không tính điểm`)
  return toHalf(max)
}

// Tổng điểm = Chặng 1 + 2 + 3 + 4. Chặng 5 không tính điểm nên không bao giờ được cộng.
// Mỗi chặng bị chặn trên bằng điểm tối đa của chặng, nên tổng không vượt 100.
export function calculateTotal(scores: StageScores): HalfPoints {
  const total = SCORED_STAGES.reduce((sum, stage) => {
    const score = scores[stage]
    if (score === null || !Number.isFinite(score)) return sum
    return sum + Math.min(Math.max(score, 0), maxHalfForStage(stage))
  }, 0)
  return Math.min(total, toHalf(MAX_TOTAL_POINTS))
}
