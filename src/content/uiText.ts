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
  // Hộp cảnh báo khi hoàn thành Chặng 2 còn thẻ chưa đặt (L.K1.2; chữ là đề xuất, K1.3 đã đồng ý)
  stage2ConfirmTitle: 'Còn thẻ chưa được đặt',
  stage2ConfirmBody: (remaining: number) =>
    `Bạn còn ${remaining} thẻ chưa đặt vào giai đoạn nào, các thẻ này sẽ được 0 điểm. Bạn có chắc muốn hoàn thành?`,
  stage2ConfirmYes: 'Vẫn hoàn thành',
  stage2ConfirmNo: 'Quay lại',
  // Chặng 3: nút và gợi ý là đề xuất (K1)
  stage3RoomComplete: 'Hoàn thành phòng',
  stage3Room1Hint: 'Chọn một hiện vật rồi chọn tủ trưng bày (hoặc kéo thả). Mỗi tủ chứa một hiện vật.',
  stage3Room1Incomplete: 'Hãy đặt đủ 4 hiện vật vào các tủ để hoàn thành phòng.',
  stage3Room2Incomplete: 'Hãy chọn từ cho cả 4 chỗ trống để hoàn thành phòng.',
  stage3Room3Incomplete: 'Hãy trả lời cả 4 câu hỏi để hoàn thành phòng.',
  stage3RoomLocked: 'Phòng này đã hoàn thành, các câu trả lời đã được khóa.',
  stage3PlaceHere: 'Đặt vào tủ này',
  stage3ReturnArtifact: 'Lấy hiện vật đã chọn ra khỏi tủ',
  stage3EmptyCabinet: 'Tủ trống',
  // Chặng 4: gợi ý và nút mở thẻ là đề xuất (K1)
  stage4Hint: 'Hãy chọn một thẻ nhân vật và một phương án hành động trước khi hoàn thành. Mở thẻ hồ sơ để xem chứng cứ.',
  stage4Locked: 'Chặng 4 đã hoàn thành, lựa chọn của bạn đã được khóa.',
  stage4OpenCard: 'Mở thẻ',
  stage3PoolEmpty: 'Đã đặt hết hiện vật',
} as const
