// Nội dung nguyên văn từ tài liệu nguồn (đã sửa lỗi chính tả theo docs/OPEN_QUESTIONS.md, mục E3).

export const BRAND_TITLE = 'MẬT MÃ VĂN MINH ĐÔNG NAM Á'

export const INTRO_TEXT =
  'Những mật mã tri thức về các nền văn minh Đông Nam Á đang dần chìm vào quên lãng. Được sự ủy thác từ Hội đồng Di sản, các nhà thám hiểm trẻ hãy bước vào hành trình chinh phục 5 thử thách kịch tính, tìm lại những mảnh ghép lịch sử đã thất lạc, khôi phục bản đồ văn minh Đông Nam Á và trở thành Đại sứ Di sản số!'

export const STAGE_INTROS: Record<number, string> = {
  1: 'Bí ẩn lịch sử đang chờ bạn khám phá! Mỗi bức hình được che giấu đằng sau 4 mảnh ghép. Bạn hãy đưa ra đáp án chính xác với số ô mở ra ít nhất! Càng liều lĩnh, điểm càng cao: mở 1 ô nhận ngay 10 điểm, mở 2 ô được 8 điểm, mở 3 ô được 6 điểm, và mở trọn 4 ô được 4 điểm. Trả lời sai sẽ lập tức mất quyền ghi điểm. Bạn đã sẵn sàng lật mảnh ghép đầu tiên chưa?',
  2: 'Giải mã Trục thời gian Đông Nam Á! Bạn hãy sắp xếp 15 thẻ nội dung vào 3 khoảng thời gian trên trục lịch sử cho chính xác. Đặt đúng 1 thẻ được 2 điểm. Đặt sai hoặc bỏ trống không tính điểm. Càng đạt điểm cao, cơ hội sở hữu mảnh mật mã tiếp theo càng lớn. Sẵn sàng chinh phục thử thách chưa nào?',
  3: 'Chào mừng các nhà thám hiểm đến với Bảo tàng Di sản Đông Nam Á! Em hãy lần lượt bước vào 3 Phòng trưng bày: phân biệt các hiện vật/tư liệu, khôi phục văn bản và khám phá các điểm nóng kiến trúc để thu thập mảnh mật mã thứ ba.',
  4: 'CẢNH BÁO KHẨN CẤP: Quần thể di sản cổ Thánh địa A-ru-na đang đứng trước nguy cơ sụp đổ nghiêm trọng do tác động của thiên tai và áp lực quá tải từ hàng triệu lượt khách du lịch mỗi năm. Hội đồng Di sản quyết định triệu tập một Phiên họp Khẩn cấp! Bạn hãy đảm nhận một vai trò chuyên gia, nghiên cứu tất cả hồ sơ chứng cứ và đưa ra phương án hành động.',
  5: 'Bạn hãy kích hoạt Thẻ Đại sứ và chính thức ghi danh vào Hội đồng Di sản! Kiểm tra lại các mảnh mật mã đã thu thập được từ các chặng trước để ghép thành mật mã hoàn chỉnh, viết 1 đề xuất ngắn gọn về cách bảo tồn di sản. Lưu ý: Thẻ Đại sứ số chỉ được khởi tạo thành công khi bạn điền chính xác mật mã!',
}

export const STAGE3_ROOMS = [
  {
    id: 1,
    title: 'PHÒNG 1: TÍN NGƯỠNG & TÔN GIÁO',
    points: '10 điểm',
    intro: 'Bạn hãy sắp xếp các hiện vật và tư liệu vào đúng các tủ trưng bày tương ứng. Mỗi câu trả lời đúng nhận ngay 2,5 điểm.',
  },
  {
    id: 2,
    title: 'PHÒNG 2: CHỮ VIẾT & VĂN HỌC',
    points: '10 điểm',
    intro: 'Bạn hãy lựa chọn các từ khóa chính xác còn thiếu để khôi phục hoàn chỉnh các đoạn tư liệu. Mỗi từ khóa đúng nhận ngay 2,5 điểm.',
  },
  {
    id: 3,
    title: 'PHÒNG 3: KIẾN TRÚC & ĐIÊU KHẮC',
    points: '20 điểm',
    intro:
      'Bạn hãy khám phá các công trình và trả lời chính xác các câu hỏi liên quan đến kiến trúc lịch sử. Mỗi câu trả lời đúng nhận ngay 5 điểm.',
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
