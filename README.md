# Mật mã văn minh Đông Nam Á

Website trò chơi giáo dục bằng tiếng Việt gồm 5 chặng (tổng tối đa 100 điểm), xây dựng bằng React + TypeScript + Vite và triển khai miễn phí trên GitHub Pages.

Trạng thái hiện tại: **Cả 5 chặng đã chơi được.** Chặng 1-4 (tương tác, chấm điểm, thông báo, mảnh mật mã, khóa câu trả lời) và Chặng 5 (nhập thông tin, mật mã, hành động bảo tồn 30-50 từ, tạo thẻ Đại sứ, xuất thẻ PNG). Hàm chấm điểm nằm ở `src/game/scoring/`, kiểm tra mật mã và đếm từ ở `src/game/cipher.ts`, `src/game/wordCount.ts`; mỗi phần có unit test riêng.

Xuất thẻ: dùng thư viện `html-to-image` (MIT) để chụp phần tử thẻ thành PNG ngay trên trình duyệt, không gửi dữ liệu đi đâu. Thẻ có chiều rộng thiết kế cố định 820 px (xuất ảnh 1640 px chiều rộng, chiều cao tự giãn theo nội dung) nên ảnh giống nhau trên mọi kích thước màn hình; xem trước được thu nhỏ bằng CSS trên màn hình hẹp. PDF chưa làm (B30: chỉ làm sau khi PNG ổn định và được kiểm thử).

Tài liệu dự án nằm trong thư mục [`docs/`](docs):
- [PROJECT_PLAN.md](docs/PROJECT_PLAN.md): kế hoạch, kiến trúc, lộ trình.
- [SCORING_RULES.md](docs/SCORING_RULES.md): quy tắc tính điểm.
- [OPEN_QUESTIONS.md](docs/OPEN_QUESTIONS.md): các quyết định và điểm còn chờ xác nhận.
- [IMAGE_ASSETS.md](docs/IMAGE_ASSETS.md): danh sách ảnh và cách thay ảnh thật.

## Yêu cầu

- Node.js 20 trở lên (đã thử với Node 24) và npm.

## Cài đặt và chạy

```bash
npm install
npm run dev
```

Mở địa chỉ hiển thị trong terminal, dạng `http://localhost:5173/weblichsu/`. Dự án dùng `base: '/weblichsu/'` nên đường dẫn luôn có phần `/weblichsu/`.

Ở chế độ `npm run dev` có thêm bảng "Xem khung (chỉ chế độ phát triển)" ở góc dưới để chuyển nhanh giữa các chặng và các chú thích tên file ảnh giữ chỗ. Các thành phần này không có trong bản build. Bảng này chỉ đổi chặng đang xem, không cộng điểm và không cấp mảnh mật mã.

Trên Windows PowerShell, nếu lệnh `npm` báo bị chặn chạy script, hãy dùng `npm.cmd` (ví dụ `npm.cmd run dev`).

## Các lệnh

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Chạy máy chủ phát triển |
| `npm run typecheck` | Kiểm tra kiểu TypeScript |
| `npm test` | Chạy toàn bộ test (Vitest) |
| `npm run lint` | Kiểm tra mã bằng oxlint |
| `npm run build` | Kiểm tra kiểu và build ra thư mục `dist/` |
| `npm run preview` | Chạy thử bản build tại `http://localhost:4173/weblichsu/` |

## Triển khai GitHub Pages

Sau khi build, nội dung thư mục `dist/` được phục vụ ở `https://<tài khoản>.github.io/weblichsu/`. Workflow triển khai tự động sẽ được thêm ở bước sau. Dự án hiện chưa có remote Git và chưa được push.

## Ràng buộc kỹ thuật

- Không backend, API, cơ sở dữ liệu, mã QR hoặc dịch vụ trả phí.
- Không dùng `localStorage`, `sessionStorage`, cookie, IndexedDB hay cơ chế lưu trạng thái qua lần tải trang. Toàn bộ dữ liệu chỉ nằm trong React state; tải lại trang là bắt đầu lại từ đầu. Test `src/test/static.test.ts` kiểm tra điều này.
- Không dùng emoji. Không tự vẽ hoặc tạo ảnh: các ảnh hiện là file giữ chỗ màu phẳng, thay bằng ảnh thật theo [IMAGE_ASSETS.md](docs/IMAGE_ASSETS.md).
- Font Be Vietnam Pro và Playfair Display được đóng gói cùng ứng dụng qua `@fontsource` (có bộ ký tự tiếng Việt), không tải từ CDN.

## Cấu trúc thư mục

```
src/
  config/        stages.ts (chặng, điểm, mảnh mật mã), assets.ts (đường dẫn ảnh tập trung)
  content/       source.ts (nội dung nguyên văn từ tài liệu), uiText.ts (chữ giao diện bổ sung)
  game/          types.ts, reducer.ts, validation.ts
  state/         GameProvider, useGame (trạng thái trong bộ nhớ)
  components/    layout/, common/, screens/, stages/
  styles/        tokens.css, global.css, components.css
public/images/placeholders/   ảnh giữ chỗ
docs/                         tài liệu dự án
```
