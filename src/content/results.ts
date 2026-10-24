import type { Stage1Tier } from '../game/scoring/stage1'
import type { Stage2Tier } from '../game/scoring/stage2'
import type { Stage3Tier } from '../game/scoring/stage3'

export interface ResultText {
  message: string
  // Phần thưởng (mảnh mật mã) theo tài liệu; null nếu không nhận mảnh.
  reward: string | null
}

// Thông báo và phần thưởng nguyên văn từ tài liệu nguồn.
export const STAGE1_RESULTS: Readonly<Record<Stage1Tier, ResultText>> = {
  perfect: {
    message: 'Chúc mừng nhà thám hiểm thiên tài đã hoàn thành thử thách!',
    reward: 'Nhận mảnh mật mã đầu tiên “DI”',
  },
  wise: {
    message: 'Chúc mừng nhà thám hiểm thông thái đã hoàn thành thử thách!',
    reward: 'Nhận mảnh mật mã đầu tiên “DI”',
  },
  persevering: {
    message: 'Chúc mừng nhà thám hiểm kiên trì đã hoàn thành thử thách!',
    reward: 'Nhận mảnh mật mã đầu tiên “DI”',
  },
  none: {
    message: 'Rất tiếc bạn không nhận được mật mã trong chặng này. Hãy cố gắng hơn ở chặng tiếp theo!',
    reward: null,
  },
}

export const STAGE2_RESULTS: Readonly<Record<Stage2Tier, ResultText>> = {
  perfect: {
    message:
      'Tuyệt vời! Chúc mừng em đã hoàn tất việc phục dựng Trục thời gian Đông Nam Á một cách hoàn hảo!',
    reward: 'Nhận mảnh mật mã thứ hai “SẢN”',
  },
  partial: {
    message: 'Chúc mừng em đã khôi phục một phần Trục thời gian và thu thập thêm mảnh ghép lịch sử',
    reward: 'Nhận mảnh mật mã thứ hai “SẢN”',
  },
  low: {
    message:
      'Mật mã thời gian chưa thể giải mã trọn vẹn do một số mốc lịch sử bị xáo trộn. Hãy cố gắng hơn ở các chặng tiếp theo!',
    reward: null,
  },
}

export const STAGE3_RESULTS: Readonly<Record<Stage3Tier, ResultText>> = {
  perfect: {
    message:
      'Tuyệt vời! Chúc mừng em đã khám phá trọn vẹn Bảo tàng Di sản và giải mã xuất sắc toàn bộ tư liệu văn minh Đông Nam Á!',
    reward: 'Nhận mảnh mật mã thứ ba “KẾT NỐI”',
  },
  good: {
    message: 'Chúc mừng em đã vượt qua các phòng trưng bày và mở khóa thành công những tư liệu di sản quý giá!',
    reward: 'Nhận mảnh mật mã thứ ba “KẾT NỐI”',
  },
  low: {
    message:
      'Không gian bảo tàng vẫn còn nhiều ẩn số chưa được khai phá do tư liệu bị nhầm lẫn. Hãy cố gắng hơn ở các chặng sau.',
    reward: null,
  },
}

export const STAGE4_RESULT: ResultText = {
  message: 'Chúc mừng bạn đã đạt huy hiệu “Chuyên gia Di sản Số” và nhận được Mảnh mật mã thứ tư: “TƯƠNG LAI”.',
  reward: null,
}
