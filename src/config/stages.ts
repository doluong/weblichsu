export type StageId = 1 | 2 | 3 | 4 | 5
export type ScoredStageId = 1 | 2 | 3 | 4

export interface StageMeta {
  id: StageId
  title: string
  shortTitle: string
  // Điểm tối đa (tài liệu). Chặng 5 không tính điểm.
  maxPoints: number | null
  // Mảnh mật mã nhận được ở chặng (chặng 5 không có).
  fragment: string | null
}

export const STAGE_IDS: readonly StageId[] = [1, 2, 3, 4, 5]

export const STAGES: readonly StageMeta[] = [
  { id: 1, title: 'BÍ ẨN LỊCH SỬ', shortTitle: 'Bí ẩn lịch sử', maxPoints: 20, fragment: 'DI' },
  { id: 2, title: 'DÒNG THỜI GIAN', shortTitle: 'Dòng thời gian', maxPoints: 30, fragment: 'SẢN' },
  { id: 3, title: 'BẢO TÀNG DI SẢN', shortTitle: 'Bảo tàng di sản', maxPoints: 40, fragment: 'KẾT NỐI' },
  {
    id: 4,
    title: 'PHIÊN HỌP KHẨN CẤP CỦA HỘI ĐỒNG DI SẢN',
    shortTitle: 'Phiên họp khẩn cấp',
    maxPoints: 10,
    fragment: 'TƯƠNG LAI',
  },
  { id: 5, title: 'ĐẠI SỨ DI SẢN SỐ', shortTitle: 'Đại sứ Di sản số', maxPoints: null, fragment: null },
]

export function getStage(id: StageId): StageMeta {
  const stage = STAGES.find((item) => item.id === id)
  if (!stage) throw new Error(`Unknown stage: ${id}`)
  return stage
}

// Thứ tự 4 ô mảnh mật mã trên giao diện, suy ra từ danh sách chặng.
export const FRAGMENT_SLOTS: readonly { stage: ScoredStageId; text: string }[] = STAGES.flatMap(
  (stage) => (stage.fragment === null ? [] : [{ stage: stage.id as ScoredStageId, text: stage.fragment }]),
)

export function formatMaxPoints(stage: StageMeta): string {
  return stage.maxPoints === null ? 'Không tính điểm' : `${stage.maxPoints} điểm`
}

// Màu 4 ô che ảnh ở Chặng 1 (thứ tự: trên-trái, trên-phải, dưới-trái, dưới-phải). Có thể chỉnh tại đây.
export const STAGE1_TILE_COLORS: readonly string[] = ['#9b3d2a', '#2f6f64', '#b8893a', '#3f4f8a']
