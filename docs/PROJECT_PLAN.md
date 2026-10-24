# Kế hoạch dự án - MẬT MÃ VĂN MINH ĐÔNG NAM Á

Website trò chơi giáo dục tiếng Việt, 5 chặng, tổng tối đa 100 điểm. Nguồn yêu cầu: `Ý tưởng web trò chơi(1).docx`. Xem [SCORING_RULES.md](./SCORING_RULES.md) và [OPEN_QUESTIONS.md](./OPEN_QUESTIONS.md).

## 1. Ràng buộc

- React + TypeScript + Vite; triển khai GitHub Pages; không backend, API, cơ sở dữ liệu, QR code.
- Không `localStorage`, `sessionStorage`, cookie, IndexedDB; mọi dữ liệu chỉ nằm trong bộ nhớ; reload là bắt đầu lại.
- Không emoji; không tự vẽ/AI/tìm ảnh di tích; mỗi ảnh một file placeholder riêng.
- Không sao chép tài nguyên của trang tham khảo.

## 2. Màn hình và luồng chơi

1. Giới thiệu: tiêu đề, lời dẫn nguyên văn, nút bắt đầu.
2. Thông tin học sinh: họ tên, lớp, trường (bắt buộc, kiểm tra trước khi bắt đầu).
3. Chặng 1-4: mỗi chặng gồm màn chơi, nút hoàn thành (disabled khi chưa đủ điều kiện), màn kết quả (điểm chặng, thông báo, mảnh mật mã, tổng điểm tạm). Chỉ mở chặng kế khi chặng hiện tại đã hoàn thành.
4. Chặng 5: nhập mật mã và hành động bảo tồn; đúng -> điểm các chặng + lời chúc + thẻ + nút "Xuất thẻ" và "Tái khởi động hành trình"; sai -> tổng điểm + lời động viên + nút "Tái khởi động hành trình".
5. Thanh tiến trình 5 chặng và bảng mảnh mật mã đã nhận luôn hiển thị; "Tái khởi động" luôn hỏi xác nhận.

## 3. Cấu trúc thư mục

```
src/
  main.tsx, App.tsx
  config/        assets.ts (đường dẫn ảnh tập trung), scoring.ts (bảng điểm và ngưỡng)
  content/       intro.ts, stage1.ts ... stage5.ts (nội dung nguyên văn từ docx)
  game/          types.ts, reducer.ts, cipher.ts, wordCount.ts, scoring/{stage1..stage4,total}.ts
  state/         GameContext.tsx
  components/
    layout/      Header, StageProgress, CipherFragments, ResultPanel, ConfirmDialog
    common/      Button, Card, TextField
    stages/      Stage1 (MysteryTiles), Stage2 (Timeline), Stage3 (Rooms 1-3), Stage4 (Council), Stage5
    ambassador/  AmbassadorCard, ExportButton
  styles/        tokens.css, global.css, theo component
public/images/placeholders/
docs/
```

Nguyên tắc: dữ liệu câu hỏi/đáp án, hàm chấm điểm (thuần, không phụ thuộc React) và component giao diện nằm ở các module riêng.

## 4. Quản lý trạng thái trong bộ nhớ

- `useReducer` + React Context, không dùng thư viện lưu trữ, không persist.
- `GameState`: `screen`, `student {name, className, school}`, `stages[1..5].status` (`locked | in_progress | completed`), `answers` theo chặng, `scores {s1..s4}`, `fragments`, `ambassador {code, action, avatarUrl}`, `cardIssuedAt`.
- Điểm do hàm thuần tính từ `answers` khi hoàn thành chặng, lưu một lần; action hoàn thành bị bỏ qua nếu chặng đã `completed` (chống cộng hai lần, khóa đáp án).
- Tổng điểm = tổng `s1..s4`, chặn trên 100; Chặng 5 không có điểm.
- `RESET` (sau xác nhận) trả về trạng thái ban đầu và thu hồi `URL.createObjectURL` của ảnh chân dung. Ảnh chân dung chỉ ở trình duyệt, không tải lên đâu.

## 5. Danh sách ảnh cần có

Tất cả nằm trong `public/images/placeholders/`; người dùng thay bằng file thật **cùng tên**; đường dẫn chỉ khai báo trong `src/config/assets.ts` và build bằng `import.meta.env.BASE_URL`.

| File | Vị trí | Ảnh thật cần thay | Tỷ lệ đề xuất |
|---|---|---|---|
| mystery-angkor-wat-placeholder.jpg | Chặng 1, ảnh bí ẩn 1 | Angkor Wat (Campuchia) | 4:3 |
| mystery-borobudur-placeholder.jpg | Chặng 1, ảnh bí ẩn 2 | Borobudur (Indonesia) | 4:3 |
| artifact-indigenous-beliefs-placeholder.jpg | Chặng 3 Phòng 1 | Chạm khắc hoa văn sóng nước, thuyền đua, chim Lạc | 1:1 |
| artifact-shiva-placeholder.jpg | Chặng 3 Phòng 1 | Tượng đá thần Shiva đang múa | 1:1 |
| artifact-buddhist-stupa-placeholder.jpg | Chặng 3 Phòng 1 | Bảo tháp (Stupa) hình chuông úp | 1:1 |
| artifact-islamic-mosque-placeholder.jpg | Chặng 3 Phòng 1 | Thánh đường mái vòm hành tây, tháp Minaret | 1:1 |
| architecture-angkor-wat-placeholder.jpg | Chặng 3 Phòng 3 | Đền Angkor Wat | 16:9 |
| architecture-borobudur-placeholder.jpg | Chặng 3 Phòng 3 | Quần thể Borobudur | 16:9 |
| architecture-ayutthaya-placeholder.jpg | Chặng 3 Phòng 3 | Cố đô Ayutthaya (đầu Phật trong rễ cây hoặc tháp Prang) | 16:9 |
| architecture-my-son-placeholder.jpg | Chặng 3 Phòng 3 | Thánh địa Mỹ Sơn | 16:9 |
| portrait-default-placeholder.jpg | Chặng 5, ảnh chân dung mặc định | Không cần ảnh thật (thay thế nếu muốn) | 3:4 |
| museum-room-background-placeholder.jpg (tùy chọn) | Chặng 3 Phòng 1, nền | Ảnh góc bảo tàng | 16:9 |

Placeholder ở giai đoạn khung: file trung tính một màu, mỗi file màu và tên khác nhau, không vẽ hình; nhãn mô tả hiển thị bằng văn bản CSS. Chi tiết sẽ ghi trong `docs/IMAGE_ASSETS.md` ở giai đoạn sau.

## 6. Kiểm thử quy tắc tính điểm

Vitest cho các hàm thuần:
- Chặng 1: đúng khi mở 1/2/3/4 ô, sai, chốt nhiều lần, tổng khả dụng và các ngưỡng 20, 16-18, 8-14, dưới 8.
- Chặng 2: 0, 2, 14, 16, 28, 30 điểm; ghi nhận giá trị lẻ không thể xảy ra.
- Chặng 3: từng phòng, 0, 40, ranh giới 15 và 37,5.
- Chặng 4: bốn nhân vật, 0-3 thẻ chứng cứ, ba phương án A/B/C.
- Tổng không vượt 100; Chặng 5 cộng 0.
- `cipher` (chuẩn hóa mật mã), `wordCount` (nhiều trường hợp, tiếng Việt).
- Kiểm tra tĩnh: không có `localStorage`, `sessionStorage`, `document.cookie`, `indexedDB`, `fetch`/XHR, emoji.
Lệnh: `npm test`, `npx tsc --noEmit`, `npm run build` - chỉ báo kết quả sau khi đã chạy thật.

## 7. Cấu hình Vite và GitHub Pages

- `vite.config.ts`: `base: '/weblichsu/'` (URL dự kiến `https://<user>.github.io/weblichsu/`).
- Không dùng router (điều hướng bằng state), tránh lỗi 404 trên Pages.
- Mọi đường dẫn ảnh qua `assets.ts` + `import.meta.env.BASE_URL`; font cài qua `@fontsource` (đóng gói cùng bản build, hỗ trợ tiếng Việt), không dùng CDN.
- Xuất thẻ: `html-to-image` (miễn phí, tương thích Vite) tạo PNG ở phía trình duyệt; PDF (jsPDF) chỉ thêm nếu ổn định.
- `.github/workflows/deploy.yml`: build bằng `npm ci && npm run build`, `actions/upload-pages-artifact` + `actions/deploy-pages`; Pages source là GitHub Actions. Cần thêm `git remote` và commit đầu tiên.

## 8. Thứ tự triển khai

1. (Giai đoạn này) Ba tài liệu trong `docs/`.
2. Khởi tạo Vite + React + TS (không ghi đè file sẵn có), bộ khung màn hình, placeholder, `IMAGE_ASSETS.md`.
3. Logic và giao diện Chặng 1-4 cùng unit test.
4. Chặng 5: mật mã, đếm từ, thẻ, xuất PNG, khởi động lại.
5. Kiểm tra cuối (build, test, quét lưu trữ/emoji), cấu hình triển khai GitHub Pages.

Điều kiện tiên quyết: người dùng cung cấp đáp án Chặng 1 (B1) và duyệt các điểm trong `OPEN_QUESTIONS.md` trước khi triển khai Chặng 1-5.
