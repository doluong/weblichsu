# Mật mã văn minh Đông Nam Á

Website trò chơi giáo dục bằng tiếng Việt gồm 5 chặng (tổng tối đa 100 điểm), xây dựng bằng React + TypeScript + Vite và triển khai miễn phí trên GitHub Pages.

Trạng thái hiện tại: **Bước 2 - khung giao diện**. Đã có màn hình giới thiệu, biểu mẫu thông tin học sinh, thanh tiến trình 5 chặng, bảng mảnh mật mã và khung riêng cho từng chặng. Luật chơi và tính điểm của các chặng chưa được triển khai.

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

Ở chế độ `npm run dev` có thêm bảng "Xem khung (chỉ chế độ phát triển)" ở góc dưới để chuyển nhanh giữa các chặng và các chú thích tên file ảnh giữ chỗ. Các thành phần này không có trong bản build.

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
