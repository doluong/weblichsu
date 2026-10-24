import { toHalf, wholePoints, type HalfPoints } from './points'

export const STAGE1_TILE_COUNT = 4

// Điểm mỗi ảnh theo số ô đã mở khi trả lời đúng (tài liệu nguồn, Chặng 1).
const POINTS_BY_OPENED_TILES: Readonly<Record<number, number>> = { 1: 10, 2: 8, 3: 6, 4: 4 }

export interface Stage1ImageInput {
  openedTiles: number
  selectedOptionId: string | null
  correctOptionId: string
}

export interface Stage1Score {
  perImage: HalfPoints[]
  total: HalfPoints
}

export function countOpenedTiles(opened: readonly boolean[]): number {
  return opened.filter(Boolean).length
}

// Điểm một ảnh. Phải mở ít nhất 1 ô và đã chọn đáp án (B4); đầu vào sai quy định bị từ chối.
export function scoreStage1Image(input: Stage1ImageInput): HalfPoints {
  const { openedTiles, selectedOptionId, correctOptionId } = input
  if (!Number.isInteger(openedTiles) || openedTiles < 1 || openedTiles > STAGE1_TILE_COUNT) {
    throw new RangeError(`Số ô đã mở phải từ 1 đến ${STAGE1_TILE_COUNT}: ${openedTiles}`)
  }
  if (selectedOptionId === null) throw new RangeError('Chưa chọn đáp án')
  return selectedOptionId === correctOptionId ? toHalf(POINTS_BY_OPENED_TILES[openedTiles]) : 0
}

export function scoreStage1(images: readonly Stage1ImageInput[]): Stage1Score {
  const perImage = images.map(scoreStage1Image)
  return { perImage, total: perImage.reduce((sum, points) => sum + points, 0) }
}

// Nút "Hoàn thành" chỉ sáng khi mỗi ảnh đã mở ít nhất 1 ô và đã chọn đáp án.
export function canSubmitStage1(
  opened: readonly (readonly boolean[])[],
  selected: readonly (string | null)[],
): boolean {
  return (
    opened.length > 0 &&
    opened.length === selected.length &&
    opened.every((tiles, index) => countOpenedTiles(tiles) >= 1 && selected[index] !== null)
  )
}

export type Stage1Tier = 'perfect' | 'wise' | 'persevering' | 'none'

// Mốc thông báo theo tài liệu: 20; 16-18; 8-14; dưới 8. Điểm nằm ngoài các mốc (15, 19, số lẻ, ngoài 0-20)
// trả về null, không tự suy diễn thông báo. Các điểm này không thể xảy ra với luật chấm hiện tại.
export function stage1Tier(total: HalfPoints): Stage1Tier | null {
  const points = wholePoints(total)
  if (points === null || points < 0 || points > 20) return null
  if (points === 20) return 'perfect'
  if (points >= 16 && points <= 18) return 'wise'
  if (points >= 8 && points <= 14) return 'persevering'
  if (points < 8) return 'none'
  return null
}

export function stage1AwardsFragment(tier: Stage1Tier | null): boolean {
  return tier === 'perfect' || tier === 'wise' || tier === 'persevering'
}
