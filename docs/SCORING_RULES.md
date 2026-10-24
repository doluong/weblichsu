# Quy tắc tính điểm - MẬT MÃ VĂN MINH ĐÔNG NAM Á

Nguồn: `Ý tưởng web trò chơi(1).docx` (trích từ tài liệu, không tự đặt thêm luật). Các điểm chưa rõ được đánh dấu **[CHƯA XÁC NHẬN]** và liệt kê trong [OPEN_QUESTIONS.md](./OPEN_QUESTIONS.md). Mọi con số dưới đây phải nằm trong một file cấu hình duy nhất khi triển khai để dễ sửa.

## Tổng quan

| Chặng | Tên | Điểm tối đa | Mảnh mật mã |
|---|---|---|---|
| 1 | Bí ẩn lịch sử | 20 | DI |
| 2 | Dòng thời gian | 30 | SẢN |
| 3 | Bảo tàng di sản | 40 | KẾT NỐI |
| 4 | Phiên họp khẩn cấp của Hội đồng Di sản | 10 | TƯƠNG LAI |
| 5 | Đại sứ Di sản số | không tính điểm | không có (dùng mật mã ghép) |

Tổng điểm = Chặng 1 + Chặng 2 + Chặng 3 + Chặng 4, tối đa 100. Chặng 5 không cộng thêm điểm.
Mật mã đầy đủ ở Chặng 5: `DI SẢN KẾT NỐI TƯƠNG LAI`.

## Chặng 1 - Bí ẩn lịch sử (20 điểm)

Hai câu hỏi (ảnh bí ẩn Angkor Wat, Bô-rô-bu-đua), mỗi ảnh che bởi 4 ô, mỗi câu tối đa 10 điểm, tổng dự kiến 20 điểm.

| Hành động | Điểm mỗi ảnh |
|---|---|
| Đoán đúng chỉ với 1 ô mở | 10 |
| Đoán đúng khi mở 2 ô | 8 |
| Đoán đúng khi mở 3 ô | 6 |
| Đoán đúng khi mở cả 4 ô | 4 |
| Trả lời sai | 0 |

Mâu thuẫn **[CHƯA XÁC NHẬN]**: phần mô tả ghi "Điểm tối đa 10 điểm" trong khi bảng tổng kết có mốc 20 điểm. Cách hiểu dùng tạm: 10 điểm mỗi ảnh, 20 điểm cả chặng.

Thông báo và phần thưởng (điểm tổng kết của chặng):

| Điểm TK | Thông báo | Mảnh |
|---|---|---|
| 20 | Chúc mừng nhà thám hiểm thiên tài đã hoàn thành thử thách! | DI |
| 16-18 | Chúc mừng nhà thám hiểm thông thái đã hoàn thành thử thách! | DI |
| 8-14 | Chúc mừng nhà thám hiểm kiên trì đã hoàn thành thử thách! | DI |
| Dưới 8 | Rất tiếc bạn không nhận được mật mã trong chặng này. Hãy cố gắng hơn ở chặng tiếp theo! | không |

Tổng điểm khả dụng (từ hai giá trị thuộc {0, 4, 6, 8, 10}): 0, 4, 6, 8, 10, 12, 14, 16, 18, 20. Mọi giá trị này đều thuộc đúng một mốc; các giá trị 15, 17, 19 không thể xảy ra nên không cần thông báo riêng.

Điểm chưa được quy định: đúng khi mở 0 ô (bảng bắt đầu từ 1 ô); trả lời sai có được thử lại không; không có luật tính theo thời gian dù lời dẫn nhắc "trả lời càng nhanh". **[CHƯA XÁC NHẬN]**

## Chặng 2 - Dòng thời gian (30 điểm)

15 thẻ, mỗi thẻ xếp đúng giai đoạn được 2 điểm, tối đa 30 điểm.

| Giai đoạn | Thẻ đúng (5 thẻ mỗi giai đoạn) |
|---|---|
| Đầu CN - Thế kỷ VII | Hình thành; Văn Lang - Âu Lạc; Phù Nam; Các quốc gia đầu tiên xuất hiện; Bắt đầu tiếp xúc văn hóa Ấn Độ, Trung Hoa |
| Thế kỷ VII - XV | Phát triển; Định hình các nền văn hóa bản địa độc đáo; Đại Việt; Đế quốc Khmer; Pagan |
| Thế kỷ XVI - XIX | Chuyển biến; Các vương quốc phong kiến suy yếu; Ảnh hưởng của văn minh Phương Tây; Thực dân xâm lược; Thành tựu khoa học - kĩ thuật |

| Điểm TK | Thông báo | Mảnh |
|---|---|---|
| 30 | Tuyệt vời! Chúc mừng em đã hoàn tất việc phục dựng Trục thời gian Đông Nam Á một cách hoàn hảo! | SẢN |
| 16-28 | Chúc mừng em đã khôi phục một phần Trục thời gian và thu thập thêm mảnh ghép lịch sử | SẢN |
| 0-14 | Mật mã thời gian chưa thể giải mã trọn vẹn do một số mốc lịch sử bị xáo trộn. Hãy cố gắng hơn ở các chặng tiếp theo! | Tài liệu không ghi mảnh; hiểu là không nhận **[CHƯA XÁC NHẬN]** |

Điểm khả dụng là số chẵn 0-30; giá trị 15 không thể xảy ra. Không có khoảng điểm nào chưa được quy định.

## Chặng 3 - Bảo tàng di sản (40 điểm)

| Phòng | Nội dung | Điểm mỗi mục | Số mục | Tối đa |
|---|---|---|---|---|
| 1 | Tín ngưỡng và Tôn giáo: đặt hiện vật vào đúng tủ (Tín ngưỡng bản địa / Hin đu giáo / Phật giáo / Hồi giáo) | 2,5 | 4 | 10 |
| 2 | Chữ viết và Văn học: chọn từ còn thiếu (đáp án B, A, B, B) | 2,5 | 4 | 10 |
| 3 | Kiến trúc và Điêu khắc: trắc nghiệm (Angkor Wat B, Borobudur A, Ayutthaya B, Mỹ Sơn B) | 5 | 4 | 20 |
| Tổng | | | | 40 |

| Điểm TK | Thông báo | Mảnh |
|---|---|---|
| 40 | Tuyệt vời! Chúc mừng em đã khám phá trọn vẹn Bảo tàng Di sản và giải mã xuất sắc toàn bộ tư liệu văn minh Đông Nam Á! | KẾT NỐI |
| Từ 15 đến dưới 40 | Chúc mừng em đã vượt qua các phòng trưng bày và mở khóa thành công những tư liệu di sản quý giá! | KẾT NỐI |
| Dưới 15 | Không gian bảo tàng vẫn còn nhiều ẩn số chưa được khai phá do tư liệu bị nhầm lẫn. Hãy cố gắng hơn ở các chặng sau. | Tài liệu không ghi mảnh; hiểu là không nhận **[CHƯA XÁC NHẬN]** |

Điểm khả dụng là bội số của 2,5 (0 đến 40), ví dụ 37,5; cần định dạng số thập phân kiểu Việt (dấu phẩy). Không có khoảng điểm nào chưa được quy định. Điều kiện cho phép tổng kết chặng (phải hoàn tất cả ba phòng hay không) **[CHƯA XÁC NHẬN]**.

## Chặng 4 - Phiên họp khẩn cấp (10 điểm)

| Bước | Quy tắc | Điểm |
|---|---|---|
| Chọn thẻ nhân vật | Chọn thẻ bất kỳ trong 4 thẻ, các thẻ có điểm như nhau; tính một lần | 2 |
| Mở thẻ chứng cứ | Mỗi thẻ (trong 3 thẻ) được mở: 1 điểm; không cộng lặp (đã xác nhận: tính theo từng thẻ, 0-3) | 0-3 |
| Bỏ phiếu | Phương án A (Bảo tồn nguyên trạng) | 3 |
| | Phương án B (Phục dựng toàn diện và hiện đại hóa) | 2 |
| | Phương án C (Bảo tồn thích ứng và du lịch có kiểm soát) | 5 |
| Tối đa | 2 + 3 + 5 | 10 |

Thông báo: điểm số + "Chúc mừng bạn đã đạt huy hiệu 'Chuyên gia Di sản Số'" + nhận Mảnh mật mã thứ tư "TƯƠNG LAI". Tài liệu không nêu mốc điểm; chưa rõ huy hiệu và mảnh có luôn được trao hay chỉ khi hoàn tất các bước **[CHƯA XÁC NHẬN]**. Tổng điểm khả dụng từ 3 đến 10 nếu bắt buộc chọn phương án.

## Chặng 5 - Đại sứ Di sản số (không tính điểm)

- Không cộng điểm; hiển thị tổng điểm của bốn chặng đầu ("ĐIỂM SỐ .../100" trên thẻ).
- Điều kiện tạo thẻ (theo tài liệu): mật mã đúng `DI SẢN KẾT NỐI TƯƠNG LAI` và điền đầy đủ thông tin bắt buộc (họ tên, lớp, trường, mật mã, hành động bảo tồn 30-50 từ).
- Lời cảm ơn trên thẻ: đạt 100/100 dùng lời khen xuất sắc; dưới 100 dùng lời động viên (nguyên văn trong tài liệu).
- Sai mật mã: không tạo thẻ, hiển thị tổng điểm các chặng và lời động viên nhập sai mật mã (nguyên văn trong tài liệu) cùng nút "Tái khởi động hành trình".
- Đúng mật mã: hiển thị điểm các chặng, "Chúc mừng em đã hoàn thành thử thách đại sứ di sản số", ảnh thẻ, nút "Tái khởi động hành trình" và "Xuất thẻ" (PNG/JPG hoặc PDF).

## Không được tự thêm

Không thêm điểm thưởng, không tính thời gian, không đổi ngưỡng thông báo, không thêm thông báo cho khoảng điểm không được quy định.
