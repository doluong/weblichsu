// Chữ giao diện KHÔNG nằm trong tài liệu nguồn. Mỗi mục ghi rõ nguồn gốc.
// "OPEN_QUESTIONS" = người dùng đã duyệt nguyên văn; "đề xuất" = chờ người dùng xem lại (docs/OPEN_QUESTIONS.md, H2).

export const VALIDATION_MESSAGES = {
  // OPEN_QUESTIONS B26
  studentInfoRequired: 'Vui lòng nhập đầy đủ họ và tên, lớp, trường.',
  codeRequired: 'Vui lòng nhập mật mã.',
  actionLength: 'Đóng góp bảo tồn cần có từ 30 đến 50 từ.',
  reviewBeforeCard: 'Vui lòng kiểm tra lại thông tin trước khi tạo thẻ.',
} as const

export const UI_TEXT = {
  // Đề xuất (E4)
  restartConfirmTitle: 'Bắt đầu lại hành trình?',
  restartConfirmBody: 'Bạn có chắc muốn bắt đầu lại? Toàn bộ tiến trình hiện tại sẽ bị xóa.',
  restartConfirmYes: 'Bắt đầu lại',
  restartConfirmNo: 'Hủy',
  // Nút theo tài liệu (Chặng 5)
  restartButton: 'Tái khởi động hành trình',
  // Đề xuất (H2.2)
  fragmentEmpty: 'Chưa nhận',
  // Đề xuất (E4)
  stage4HypotheticalNote: 'Thánh địa A-ru-na là tình huống di sản giả định.',
  // Đề xuất
  introStart: 'Bắt đầu hành trình',
  infoTitle: 'Thông tin nhà thám hiểm',
  infoLead: 'Điền đầy đủ họ và tên, lớp, trường trước khi bắt đầu Chặng 1.',
  infoMemoryNote:
    'Thông tin chỉ được giữ trong trình duyệt khi bạn đang chơi. Tải lại hoặc đóng trang sẽ bắt đầu lại từ đầu.',
  infoSubmit: 'Bắt đầu Chặng 1',
  infoBack: 'Quay lại',
  nameLabel: 'Họ và tên',
  classLabel: 'Lớp',
  schoolLabel: 'Trường',
  stageSkeletonNote: 'Khung giao diện. Luật chơi và tính điểm sẽ được bổ sung ở bước sau.',
  stageCompleteDisabled: 'Hoàn thành',
  // Nút "Hoàn thành" theo tài liệu; gợi ý và thông báo khóa là đề xuất (OPEN_QUESTIONS K1)
  stageComplete: 'Hoàn thành',
  stage1Hint: 'Mỗi ảnh cần mở ít nhất 1 ô và chọn một đáp án trước khi hoàn thành.',
  stage1Locked: 'Chặng 1 đã hoàn thành, các câu trả lời đã được khóa.',
  // Chặng 2: nút theo tài liệu "Hoàn thành thử thách"; các chữ còn lại là đề xuất (K1)
  stage2Complete: 'Hoàn thành thử thách',
  stage2Hint:
    'Chọn một thẻ rồi chọn giai đoạn (hoặc kéo thả). Có thể hoàn thành khi chưa đặt hết; thẻ chưa đặt được 0 điểm.',
  stage2Locked: 'Chặng 2 đã hoàn thành, các thẻ đã được khóa.',
  stage2PickZone: 'Hãy chọn giai đoạn để đặt thẻ.',
  stage2PlaceHere: 'Đặt thẻ vào đây',
  stage2EmptyZone: 'Chưa có thẻ',
  stage2BankEmpty: 'Đã đặt hết thẻ',
  stage2ReturnToBank: 'Trả thẻ đã chọn về ngân hàng',
} as const
