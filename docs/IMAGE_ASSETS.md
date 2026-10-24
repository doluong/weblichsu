# Danh mục ảnh - MẬT MÃ VĂN MINH ĐÔNG NAM Á

Mọi ảnh nằm trong thư mục [`public/images/placeholders/`](../public/images/placeholders). Hiện tại đây là các **file giữ chỗ** do chương trình tạo: mỗi file là một mảng màu phẳng khác nhau, không vẽ hay mô phỏng di tích. Mỗi vị trí ảnh có một file riêng và tên file duy nhất.

Đường dẫn ảnh chỉ được khai báo ở một nơi: [`src/config/assets.ts`](../src/config/assets.ts) (mảng `IMAGE_ASSETS`). Mã dựng URL từ `import.meta.env.BASE_URL`, nên đường dẫn đúng cả khi chạy cục bộ (`/weblichsu/images/placeholders/...`) lẫn khi triển khai GitHub Pages ở thư mục con `/weblichsu/`.

## Cách thay ảnh thật

1. Chuẩn bị ảnh thật đúng chủ đề ở cột "Ảnh thật cần thay".
2. Lưu thành file **JPG** và đặt tên **đúng bằng tên file giữ chỗ** (cột "File"). Ví dụ: ảnh Angkor Wat lưu thành `mystery-angkor-wat-placeholder.jpg`.
3. Chép đè lên file cũ trong `public/images/placeholders/`.
4. Chạy `npm run dev` (hoặc build lại) và tải lại trang. Không cần sửa mã trò chơi.

Ghi chú:
- Giữ nguyên tên file kể cả khi ảnh đã là ảnh thật (hậu tố `-placeholder` chỉ là tên). Nếu muốn đổi tên hoặc dùng định dạng khác (PNG, WebP), hãy sửa duy nhất trường `file` tương ứng trong `src/config/assets.ts`.
- Ảnh được hiển thị theo tỷ lệ khung (cột "Tỷ lệ"), cắt vừa khung (`object-fit: cover`). Nên chụp/cắt đúng tỷ lệ và để chủ thể ở giữa.
- Nên giữ mỗi ảnh dưới khoảng 300 KB để trang tải nhanh trên điện thoại.
- Ở chế độ `npm run dev`, mỗi ảnh có chú thích "Ảnh giữ chỗ: <tên file>" để dễ nhận biết; chú thích này không có trong bản build.
- Chỉ dùng ảnh bạn có quyền sử dụng. Không dùng một ảnh cho nhiều vị trí.

## Danh sách ảnh

| File | Đường dẫn trong dự án | Vị trí xuất hiện | Ảnh thật cần thay | Tỷ lệ | Kích thước đề xuất |
|---|---|---|---|---|---|
| `mystery-angkor-wat-placeholder.jpg` | `public/images/placeholders/mystery-angkor-wat-placeholder.jpg` | Chặng 1, ảnh bí ẩn 1 (bị che bởi 4 ô) | Angkor Wat (Campuchia) | 4:3 | 1200 x 900 |
| `mystery-borobudur-placeholder.jpg` | `public/images/placeholders/mystery-borobudur-placeholder.jpg` | Chặng 1, ảnh bí ẩn 2 (bị che bởi 4 ô) | Bô-rô-bu-đua (Indonesia) | 4:3 | 1200 x 900 |
| `artifact-indigenous-beliefs-placeholder.jpg` | `public/images/placeholders/artifact-indigenous-beliefs-placeholder.jpg` | Chặng 3, Phòng 1, hiện vật 1 | Chạm khắc hoa văn sóng nước, thuyền đua, chim Lạc (Tín ngưỡng bản địa) | 1:1 | 800 x 800 |
| `artifact-shiva-placeholder.jpg` | `public/images/placeholders/artifact-shiva-placeholder.jpg` | Chặng 3, Phòng 1, hiện vật 2 | Tượng đá chạm khắc thần Shiva đang múa (Hindu giáo) | 1:1 | 800 x 800 |
| `artifact-buddhist-stupa-placeholder.jpg` | `public/images/placeholders/artifact-buddhist-stupa-placeholder.jpg` | Chặng 3, Phòng 1, hiện vật 3 | Bảo tháp (Stupa) hình chuông úp (Phật giáo) | 1:1 | 800 x 800 |
| `artifact-islamic-mosque-placeholder.jpg` | `public/images/placeholders/artifact-islamic-mosque-placeholder.jpg` | Chặng 3, Phòng 1, hiện vật 4 | Thánh đường mái vòm hành tây, tháp nhọn Minaret (Hồi giáo) | 1:1 | 800 x 800 |
| `architecture-angkor-wat-placeholder.jpg` | `public/images/placeholders/architecture-angkor-wat-placeholder.jpg` | Chặng 3, Phòng 3, công trình 1 | Đền Angkor Wat (Campuchia) | 16:9 | 1280 x 720 |
| `architecture-borobudur-placeholder.jpg` | `public/images/placeholders/architecture-borobudur-placeholder.jpg` | Chặng 3, Phòng 3, công trình 2 | Quần thể Bô-rô-bu-đua (Indonesia) | 16:9 | 1280 x 720 |
| `architecture-ayutthaya-placeholder.jpg` | `public/images/placeholders/architecture-ayutthaya-placeholder.jpg` | Chặng 3, Phòng 3, công trình 3 | Cố đô Ayutthaya (Thái Lan): đầu tượng Phật trong rễ cây hoặc cụm tháp Prang | 16:9 | 1280 x 720 |
| `architecture-my-son-placeholder.jpg` | `public/images/placeholders/architecture-my-son-placeholder.jpg` | Chặng 3, Phòng 3, công trình 4 | Thánh địa Mỹ Sơn (Việt Nam) | 16:9 | 1280 x 720 |
| `portrait-default-placeholder.jpg` | `public/images/placeholders/portrait-default-placeholder.jpg` | Chặng 5, ảnh chân dung mặc định trên thẻ (khi học sinh không tải ảnh) | Ảnh chân dung mặc định, không bắt buộc thay | 3:4 | 900 x 1200 |
| `museum-room-background-placeholder.jpg` | `public/images/placeholders/museum-room-background-placeholder.jpg` | Chặng 3, Phòng 1, ảnh nền (tùy chọn, chưa dùng ở khung hiện tại) | Ảnh một góc bảo tàng, không bắt buộc | 16:9 | 1280 x 720 |

## Ảnh học sinh tải lên (Chặng 5)

Ảnh chân dung do học sinh chọn ở Chặng 5 chỉ được dùng trong trình duyệt của phiên hiện tại, không tải lên máy chủ và không được lưu. Chức năng này sẽ được làm ở bước sau.

## Kiểm tra tự động

Test `src/config/assets.test.ts` kiểm tra: tên file và khóa không trùng, mọi file khai báo đều tồn tại, không có file thừa chưa khai báo, và nội dung các file giữ chỗ khác nhau. Nếu bạn thay bằng ảnh thật, test vẫn đạt miễn là mỗi vị trí dùng một ảnh khác nhau.
