# Quy tắc tính điểm - MẬT MÃ VĂN MINH ĐÔNG NAM Á

Nguồn: `Ý tưởng web trò chơi(1).docx` và các quyết định chính thức ở phần D, G của [OPEN_QUESTIONS.md](./OPEN_QUESTIONS.md) (D, G ưu tiên hơn đề xuất tạm ở phần B). Không tự đặt thêm luật. Điểm còn là đề xuất chờ duyệt được đánh dấu **[ĐỀ XUẤT]** và liệt kê ở phần H của OPEN_QUESTIONS.md. Mọi con số dưới đây phải nằm trong một file cấu hình duy nhất (`src/config/scoring.ts`) khi triển khai để dễ sửa.

Cập nhật lần 3: đã áp dụng phần G (C1-C11 được người dùng xác nhận).

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

Quyết định (D: B2-B5, E1):
- Dòng "Điểm tối đa 10 điểm" trong tài liệu được hiểu là tối đa 10 điểm mỗi ảnh; Chặng 1 tối đa 20 điểm.
- Hai ảnh hiển thị cùng lúc. Người chơi mở ô và chọn đáp án cho cả hai ảnh, sau đó bấm một nút "Hoàn thành" để chấm điểm; nút chỉ sáng khi mỗi ảnh đã mở ít nhất 1 ô và đã chọn đáp án.
- Có thể mở thêm ô trước khi bấm "Hoàn thành"; sau khi hoàn thành thì khóa, không thử lại, trả lời sai không được sửa.
- Điểm tính riêng từng ảnh theo số ô thực tế đã mở lúc hoàn thành và đáp án đã chọn; Chặng 1 = điểm ảnh 1 + điểm ảnh 2 (G.C2, thay cho "chốt từng ảnh" ở B5). Khi trả lời sai, không tiết lộ đáp án đúng.
- Không có yếu tố thời gian (B3), không có điểm thưởng thêm.
- Dữ liệu (G.C3): cả hai ảnh dùng cùng 4 lựa chọn, thứ tự trình bày được xáo trộn (mỗi ảnh xáo riêng, một lần khi vào chặng, xáo lại khi tái khởi động); nhãn A-D gán sau khi xáo; chấm điểm theo mã lựa chọn, không theo vị trí. Người chơi có thể suy luận loại trừ; không có luật bổ sung.

| Mã lựa chọn | Nhãn hiển thị | Ảnh 1 | Ảnh 2 |
|---|---|---|---|
| angkor-wat | Đền Angkor Wat (Campuchia) | đúng | sai |
| borobudur | Chùa Bô-rô-bu-đua (Indonesia) **[ĐỀ XUẤT]** | sai | đúng |
| shwedagon | Chùa Shwedagon (Myanmar) | sai | sai |
| wat-rong-khun | Đền Wat Rong Khun (Thái Lan) | sai | sai |

Nhãn đã sửa chính tả: "Wat Rong Khun" (nguồn người dùng ghi "War"), "Shwedagon" (ghi "Shwedagob"), "Bô-rô-bu-đua" theo E1.5. Việc dùng "Chùa" thay "Đền" cho Bô-rô-bu-đua **[ĐỀ XUẤT]**

Thông báo và phần thưởng (điểm tổng kết của chặng):

| Điểm TK | Thông báo | Mảnh |
|---|---|---|
| 20 | Chúc mừng nhà thám hiểm thiên tài đã hoàn thành thử thách! | DI |
| 16-18 | Chúc mừng nhà thám hiểm thông thái đã hoàn thành thử thách! | DI |
| 8-14 | Chúc mừng nhà thám hiểm kiên trì đã hoàn thành thử thách! | DI |
| Dưới 8 | Rất tiếc bạn không nhận được mật mã trong chặng này. Hãy cố gắng hơn ở chặng tiếp theo! | không |

Tổng điểm khả dụng (từ hai giá trị thuộc {0, 4, 6, 8, 10}): 0, 4, 6, 8, 10, 12, 14, 16, 18, 20. Mọi giá trị này đều thuộc đúng một mốc; các giá trị 15, 17, 19 không thể xảy ra nên không cần thông báo riêng.

Mảnh "DI" chỉ nhận khi tổng Chặng 1 từ 8 điểm trở lên. Không có trường hợp "đúng khi mở 0 ô" vì phải mở ít nhất 1 ô mới được hoàn thành (B4).

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
| 0-14 | Mật mã thời gian chưa thể giải mã trọn vẹn do một số mốc lịch sử bị xáo trộn. Hãy cố gắng hơn ở các chặng tiếp theo! | không (B8) |

Quyết định (D: B6-B9): giữ nguyên đủ 15 thẻ (gồm "Hình thành", "Phát triển", "Chuyển biến"); được bấm "Hoàn thành thử thách" khi chưa đặt hết; thẻ chưa đặt hoặc đặt sai được 0 điểm; chỉ nhận "SẢN" khi từ 16 đến 30 điểm; không sửa nội dung lịch sử. Hoàn thành xong thì khóa, không tính lại. Hỗ trợ kéo thả và thao tác chọn thẻ rồi chọn giai đoạn.

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
| Dưới 15 | Không gian bảo tàng vẫn còn nhiều ẩn số chưa được khai phá do tư liệu bị nhầm lẫn. Hãy cố gắng hơn ở các chặng sau. | không (B13) |

Quyết định (D: B10-B16, E1):
- Hoàn thành từng phòng theo thứ tự 1, 2, 3; chỉ tổng kết khi đủ 3 phòng (B11).
- Một phòng chỉ hoàn thành khi đã trả lời/đặt đủ tất cả mục của phòng; phòng đã hoàn thành bị khóa.
- Không hiện điểm từng phòng trong lúc chơi; chỉ hiện ở tổng kết Chặng 3, kèm điểm từng phòng (E1.2).
- Phòng 1: chọn hiện vật rồi chọn tủ, và kéo thả trên máy tính nếu phù hợp (B10). Mỗi tủ nhận đúng một hiện vật; đặt vào tủ đã có thì hoán đổi (G.C11).
- Dùng "Hindu giáo" thống nhất, không dùng "Hin đu giáo" (B14). Chỉ hiển thị điểm trong trình duyệt, không gửi đi đâu (B12).
- Điểm là bội số của 2,5 (0 đến 40), hiển thị dấu phẩy, ví dụ 37,5 (B16). Mảnh "KẾT NỐI" chỉ nhận khi 15 đến 40 điểm.

## Chặng 4 - Phiên họp khẩn cấp (10 điểm)

| Bước | Quy tắc | Điểm |
|---|---|---|
| Chọn thẻ nhân vật | Chọn thẻ bất kỳ trong 4 thẻ, các thẻ có điểm như nhau; tính một lần | 2 |
| Mở thẻ chứng cứ | Mỗi thẻ (trong 3 thẻ) được mở: 1 điểm; không cộng lặp (đã xác nhận: tính theo từng thẻ, 0-3) | 0-3 |
| Bỏ phiếu | Phương án A (Bảo tồn nguyên trạng) | 3 |
| | Phương án B (Phục dựng toàn diện và hiện đại hóa) | 2 |
| | Phương án C (Bảo tồn thích ứng và du lịch có kiểm soát) | 5 |
| Tối đa | 2 + 3 + 5 | 10 |

Quyết định (D: B17-B20):
- Phải chọn nhân vật và phương án bỏ phiếu mới hoàn tất được chặng; thẻ chứng cứ là tùy chọn (mỗi thẻ mở thì 1 điểm).
- Chỉ sau khi hoàn tất mới có thông báo điểm, huy hiệu "Chuyên gia Di sản Số" và mảnh "TƯƠNG LAI". Không có mốc điểm; luôn nhận mảnh khi hoàn tất.
- Chỉ hiển thị tên 4 nhân vật theo tài liệu (Nhà Sử học; Chuyên gia Bảo tồn; Đại diện Cộng đồng Địa phương; Chuyên gia Du lịch & Kinh tế), không thêm mô tả.
- Bỏ phiếu cá nhân, không có biểu đồ tổng hợp. Thánh địa A-ru-na được ghi rõ là tình huống di sản giả định.
- Điểm Chặng 4 khả dụng từ 4 (nhân vật 2 + phương án B 2, không mở thẻ) đến 10. Hoàn tất xong thì khóa.

## Chặng 5 - Đại sứ Di sản số (không tính điểm)

- Không cộng điểm; hiển thị điểm từng chặng (Chặng 1-4) và tổng điểm; trên thẻ ghi "ĐIỂM SỐ .../100". Không hiển thị điểm cho Chặng 5.
- Bốn bước (B21): (1) thông tin học sinh (hiển thị giá trị đã nhập, cho sửa họ tên, lớp, trường; ảnh chân dung tùy chọn), (2) mật mã và đóng góp bảo tồn, (3) xem trước thẻ kèm điểm các chặng và lời chúc, (4) xuất thẻ PNG và tái khởi động.
- Tiêu đề thẻ: "THẺ ĐẠI SỨ DI SẢN SỐ" (sửa lỗi gõ "ĐẠO SỨ"), phụ đề "VĂN MINH ĐÔNG NAM Á".
- Mật mã: bỏ khoảng trắng đầu/cuối, gộp khoảng trắng liên tiếp, chuẩn hóa Unicode NFC, không phân biệt hoa/thường, vẫn phân biệt dấu. Mật mã chính xác: `DI SẢN KẾT NỐI TƯƠNG LAI` (B23).
- Đóng góp bảo tồn: chuẩn hóa khoảng trắng rồi tách theo khoảng trắng; từ 30 đến 50 từ, tính cả hai đầu mút (B22).
- Thông báo kiểm tra hợp lệ (B26, hiển thị tại trường, không xóa dữ liệu đã nhập): "Vui lòng nhập đầy đủ họ và tên, lớp, trường."; "Vui lòng nhập mật mã."; "Đóng góp bảo tồn cần có từ 30 đến 50 từ."; "Vui lòng kiểm tra lại thông tin trước khi tạo thẻ."
- Điều kiện tạo thẻ: Chặng 1-4 đã hoàn thành theo luồng chơi, họ tên/lớp/trường hợp lệ, đóng góp 30-50 từ, mật mã đúng. Không yêu cầu thêm điều kiện đã nhận đủ mảnh (tài liệu không nêu).
- Lời cảm ơn trên thẻ: tổng điểm đúng 100 dùng lời khen xuất sắc; dưới 100 dùng lời động viên (nguyên văn trong tài liệu).
- Sai mật mã (B25): không tạo thẻ, hiển thị đúng thông báo thất bại theo tài liệu cùng tổng điểm các chặng, chỉ có nút "Tái khởi động hành trình"; không cho nhập lại trong lượt chơi đó.
- Đúng mật mã: hiển thị điểm các chặng, "Chúc mừng em đã hoàn thành thử thách đại sứ di sản số", thẻ, nút "Xuất thẻ" (PNG trước; PDF chỉ sau khi PNG ổn định, B30) và "Tái khởi động hành trình".
- Ngày cấp (B27): ngày tạo thẻ theo thiết bị, định dạng ngày/tháng/năm.
- Không bảng vàng, không nộp bài, không lưu kết quả (B28).

## Tổng điểm, mảnh mật mã và điều kiện tạo thẻ

- Mỗi điểm chặng lưu theo đơn vị nửa điểm bằng số nguyên (2,5 điểm = 5 đơn vị) để tránh lỗi số thực; hiển thị chia 2, dùng dấu phẩy, số nguyên không có phần thập phân (ví dụ "37,5", "40").
- Tổng điểm = Chặng 1 + Chặng 2 + Chặng 3 + Chặng 4, tối đa 100 (20 + 30 + 40 + 10), có chặn trên 100. Lời khen chỉ dùng khi tổng đúng 100.
- Mảnh mật mã: DI khi Chặng 1 từ 8 điểm; SẢN khi Chặng 2 từ 16 điểm; KẾT NỐI khi Chặng 3 từ 15 điểm; TƯƠNG LAI khi hoàn tất Chặng 4. Các mảnh đã nhận được hiển thị suốt hành trình và ở Chặng 5; chặng không nhận mảnh thì ô mảnh để trống (G.C1). Không hiển thị toàn văn mật mã và không tự cấp mảnh chưa đạt điều kiện (B24). Người chơi vẫn có thể đoán mật mã; phải nhập đúng mới hoàn thành Chặng 5. Chữ cho ô trống ("Chưa nhận") là **[ĐỀ XUẤT]**.
- Điểm một chặng chỉ được tính một lần khi hoàn thành; sau đó chặng bị khóa.

## Kiểm tra nhất quán giữa 5 chặng

| # | Nội dung | Kết luận |
|---|---|---|
| C1 | Có thể không nhận một số mảnh (điểm thấp) nhưng phải nhập đúng cả mật mã, chỉ một lần | Đã xác nhận (G): chỉ hiển thị mảnh đã nhận, mảnh chưa nhận là ô trống; người chơi có thể đoán; không thêm luật |
| C2 | Chặng 1: B5 (chốt từng ảnh) và E1.4 (một nút Hoàn thành cho cả hai ảnh) | Đã xác nhận (G): áp dụng E1.4 |
| C3 | Chặng 1: chính tả tên riêng, đáp án đúng, thứ tự lựa chọn | Đã xác nhận (G); nhãn "Chùa Bô-rô-bu-đua" là đề xuất chờ duyệt |
| C6 | Thẻ không yêu cầu đã đủ 4 mảnh | Theo đúng tài liệu và D |
| C7 | Tổng dùng nửa điểm, tối đa 100, không vượt | Nhất quán: 20 + 30 + 40 + 10 = 100 |
| C12 | Mọi tổng khả dụng của Chặng 1, 2, 3 đều thuộc đúng một mốc | Không có khoảng chưa quy định |
| C8 | Chặng 4 khả dụng 4-10 (không phải 3-10) | Đã sửa |

## Không được tự thêm

Không thêm điểm thưởng, không tính thời gian, không đổi ngưỡng thông báo, không thêm thông báo cho khoảng điểm không được quy định.
