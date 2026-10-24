// Nội dung nguyên văn từ tài liệu nguồn (đã sửa lỗi chính tả theo docs/OPEN_QUESTIONS.md, mục E3).

export const BRAND_TITLE = 'MẬT MÃ VĂN MINH ĐÔNG NAM Á'

export const INTRO_TEXT =
  'Những mật mã tri thức về các nền văn minh Đông Nam Á đang dần chìm vào quên lãng. Được sự ủy thác từ Hội đồng Di sản, các nhà thám hiểm trẻ hãy bước vào hành trình chinh phục 5 thử thách kịch tính, tìm lại những mảnh ghép lịch sử đã thất lạc, khôi phục bản đồ văn minh Đông Nam Á và trở thành Đại sứ Di sản số!'

export const STAGE_INTROS: Record<number, string> = {
  1: 'Em hãy lật mở các mảnh ghép để nhận diện di sản tương ứng. Mở càng ít ô và trả lời càng nhanh, điểm số thu về sẽ càng cao để mở khóa mật mã đầu tiên!',
  2: 'Em hãy kéo thả các thẻ Vương quốc, Sự kiện vào đúng vị trí trên Trục thời gian Đông Nam Á để mở khóa mảnh mật mã tiếp theo.',
  3: 'Chào mừng các nhà thám hiểm đến với Bảo tàng Di sản Đông Nam Á! Em hãy lần lượt bước vào 3 Phòng trưng bày: phân biệt các hiện vật/tư liệu, khôi phục văn bản và khám phá các điểm nóng kiến trúc để thu thập mảnh mật mã thứ ba.',
  4: 'CẢNH BÁO KHẨN CẤP: Quần thể di sản cổ Thánh địa A-ru-na đang đứng trước nguy cơ sụp đổ nghiêm trọng do tác động của thiên tai và áp lực quá tải từ hàng triệu lượt khách du lịch mỗi năm. Hội đồng Di sản quyết định triệu tập một Phiên họp Khẩn cấp! Các em hãy đảm nhận các vai trò chuyên gia, nghiên cứu hồ sơ chứng cứ và tranh luận để đưa ra Quyết nghị cứu nguy cho di sản!',
  5: 'Sứ mệnh khôi phục bản đồ văn minh đã đi đến chặng cuối cùng! Hãy kích hoạt Mật mã, khởi tạo chiếc Thẻ Đại Sứ Di Sản Số mang dấu ấn cá nhân và chính thức ghi danh vào Bảng Vàng Hội đồng Di sản!',
}

export const STAGE3_ROOMS = [
  {
    id: 1,
    title: 'PHÒNG 1: TÍN NGƯỠNG & TÔN GIÁO',
    points: '10 điểm',
    intro: 'Em hãy phân biệt các hiện vật/tư liệu vào các tủ trưng bày.',
  },
  {
    id: 2,
    title: 'PHÒNG 2: CHỮ VIẾT & VĂN HỌC',
    points: '10 điểm',
    intro: 'Em hãy lựa chọn từ còn thiếu để khôi phục các tư liệu sau.',
  },
  {
    id: 3,
    title: 'PHÒNG 3: KIẾN TRÚC & ĐIÊU KHẮC',
    points: '20 điểm',
    intro:
      'Em hãy khám phá các công trình và trả lời các câu hỏi về các công trình kiến trúc. Mỗi câu trả lời đúng được 5 điểm.',
  },
] as const

export const STAGE4_HEADINGS = {
  roles: 'HÃY CHỌN THẺ NHÂN VẬT',
  evidence: 'MỞ THẺ HỒ SƠ KHẨN CẤP',
  vote: 'BỎ PHIẾU PHƯƠNG ÁN HÀNH ĐỘNG',
} as const

export const STAGE5_STEPS = [
  'Thông tin Đại sứ',
  'Mật mã và hành động bảo tồn',
  'Xem trước thẻ',
  'Xuất thẻ',
] as const

export const STAGE5_CARD_TITLE = 'THẺ ĐẠI SỨ DI SẢN SỐ'
export const STAGE5_CARD_SUBTITLE = 'VĂN MINH ĐÔNG NAM Á'
