import { getStage, type ScoredStageId } from '../config/stages'
import { STAGE1_IMAGES } from '../content/stage1'
import { STAGE3_KEYS } from '../content/stage3'
import { STAGE1_RESULTS, STAGE2_RESULTS, STAGE3_RESULTS, STAGE4_RESULT, type ResultText } from '../content/results'
import { countOpenedTiles, scoreStage1, stage1Tier } from './scoring/stage1'
import { stage2Tier } from './scoring/stage2'
import { scoreStage3, stage3Tier } from './scoring/stage3'
import { scoreStage4 } from './scoring/stage4'
import type { HalfPoints } from './scoring/points'
import { calculateTotal } from './scoring/total'
import type { GameState } from './types'

export function getTotal(state: GameState): HalfPoints {
  return calculateTotal(state.scores)
}

export interface StageOutcome {
  score: HalfPoints
  maxPoints: number
  // null khi điểm nằm ngoài các mốc của tài liệu: không tự suy diễn thông báo.
  result: ResultText | null
}

export function getStageOutcome(state: GameState, stage: ScoredStageId): StageOutcome | null {
  const score = state.scores[stage]
  if (score === null) return null
  const maxPoints = getStage(stage).maxPoints ?? 0
  let result: ResultText | null = null
  if (stage === 1) {
    const tier = stage1Tier(score)
    result = tier ? STAGE1_RESULTS[tier] : null
  } else if (stage === 2) {
    const tier = stage2Tier(score)
    result = tier ? STAGE2_RESULTS[tier] : null
  } else if (stage === 3) {
    const tier = stage3Tier(score)
    result = tier ? STAGE3_RESULTS[tier] : null
  } else {
    result = STAGE4_RESULT
  }
  return { score, maxPoints, result }
}

export interface BreakdownLine {
  label: string
  score: HalfPoints
  maxPoints: number
}

// Chi tiết điểm (chỉ gọi khi chặng đã hoàn thành và đáp án đã khóa).
export function getBreakdown(state: GameState, stage: ScoredStageId): BreakdownLine[] {
  if (state.scores[stage] === null) return []
  if (stage === 1) {
    const { perImage } = scoreStage1(
      STAGE1_IMAGES.map((image, index) => ({
        openedTiles: Math.max(1, countOpenedTiles(state.stage1.opened[index])),
        selectedOptionId: state.stage1.selected[index] ?? '',
        correctOptionId: image.correctOptionId,
      })),
    )
    return perImage.map((score, index) => ({ label: `Bức ảnh bí ẩn ${index + 1}`, score, maxPoints: 10 }))
  }
  if (stage === 3) {
    const { rooms } = scoreStage3(
      { room1: state.stage3.room1, room2: state.stage3.room2, room3: state.stage3.room3 },
      STAGE3_KEYS,
    )
    return [
      { label: 'Phòng 1: Tín ngưỡng & Tôn giáo', score: rooms[0], maxPoints: 10 },
      { label: 'Phòng 2: Chữ viết & Văn học', score: rooms[1], maxPoints: 10 },
      { label: 'Phòng 3: Kiến trúc & Điêu khắc', score: rooms[2], maxPoints: 20 },
    ]
  }
  if (stage === 4) {
    const detail = scoreStage4({
      roleId: state.stage4.roleId,
      openedEvidenceIds: state.stage4.opened,
      voteId: state.stage4.voteId,
    })
    return [
      { label: 'Chọn thẻ nhân vật', score: detail.role, maxPoints: 2 },
      { label: 'Mở thẻ hồ sơ khẩn cấp', score: detail.evidence, maxPoints: 3 },
      { label: 'Bỏ phiếu phương án hành động', score: detail.vote, maxPoints: 5 },
    ]
  }
  return []
}
