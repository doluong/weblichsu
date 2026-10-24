// Nội dung nguyên văn từ tài liệu nguồn cho Chặng 5 (đã sửa "ĐẠO SỨ" thành "ĐẠI SỨ", "bản than" thành "bản thân").
// "{name}" được thay bằng họ tên học sinh (tài liệu ghi "[Tên học sinh]").

export const CARD_TEXT = {
  title: 'THẺ ĐẠI SỨ DI SẢN SỐ',
  subtitle: 'VĂN MINH ĐÔNG NAM Á',
  awardedTo: 'Tuyên dương và khen thưởng em:',
  classLabel: 'Lớp:',
  schoolLabel: 'Trường:',
  completed: 'Đã hoàn thành các chặng thử thách, giải mật mã văn minh Đông Nam Á',
  contribution: 'Đóng góp ý tưởng và hành động thiết thực:',
  score: 'ĐIỂM SỐ',
  issuedDate: 'Ngày cấp',
  teacherLabel: 'GIÁO VIÊN',
  teacherName: 'NGUYỄN THỊ THẢO',
} as const

// Học sinh đạt điểm tối đa 100/100.
export const PRAISE_MESSAGE =
  'Cô Thảo cảm ơn {name} đã xuất sắc vượt qua các thử thách trong hành trình khám phá văn minh Đông Nam Á! Sự thông minh và tinh thần học hỏi của con đã góp phần khôi phục trọn vẹn bản đồ di sản. Con xứng đáng là một Đại sứ Di sản số tài năng!'

// Học sinh chưa đạt điểm tối đa.
export const ENCOURAGE_MESSAGE =
  'Cô Thảo cảm ơn {name} đã nhiệt tình tham gia hành trình khám phá văn minh Đông Nam Á! Dù kết quả lần này chưa thật sự như ý, nhưng cô tin chỉ cần con kiên trì tìm hiểu thêm một chút nữa, con chắc chắn sẽ chinh phục thành công mọi thử thách!'

// Sai mật mã: không tạo thẻ.
export const FAILURE_MESSAGE =
  'Cảm ơn {name} đã dấn thân vào chuyến thám hiểm lịch sử cùng cô Thảo! Mọi tri thức đều cần thời gian để khai phá. Đừng nản lòng nhé, hãy quay lại và sẵn sàng chinh phục bản đồ di sản lần nữa nào!'

export const SUCCESS_BANNER = 'Chúc mừng em đã hoàn thành thử thách đại sứ di sản số'

export const STEP_TITLES = [
  'Thông tin Đại sứ',
  'Mật mã và hành động bảo tồn',
  'Xem trước thẻ',
  'Xuất thẻ',
] as const

export const FIELD_TEXT = {
  codeLabel: 'Mật mã (in hoa có dấu)',
  actionLabel: 'Hành động bảo tồn (đề xuất giải pháp thực tế của bản thân, 30-50 từ)',
  suggestionsTitle: 'Gợi ý tham khảo',
} as const

// Gợi ý nguyên văn; chỉ để tham khảo, không được tự điền sẵn vào ô nhập.
export const ACTION_SUGGESTIONS = [
  'Sáng tạo nội dung số quảng bá di sản',
  'Tuyên truyền không xả rác tại khu di tích',
  'Tham gia các chiến dịch tình nguyện bảo tồn',
] as const

export function fillName(template: string, name: string): string {
  return template.replaceAll('{name}', name)
}
