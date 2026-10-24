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
3. Chặng 1: hai ảnh bí ẩn hiển thị cùng lúc; mở ô, chọn đáp án cho cả hai ảnh rồi bấm một nút "Hoàn thành" (chỉ sáng khi mỗi ảnh đã mở ít nhất 1 ô và đã chọn đáp án). Chặng 2-4 mỗi chặng gồm màn chơi, nút hoàn thành (disabled khi chưa đủ điều kiện) và màn kết quả (điểm chặng, thông báo, mảnh mật mã, tổng điểm tạm). Chặng 3 gồm 3 phòng theo thứ tự, mỗi phòng phải trả lời đủ mới hoàn thành, điểm phòng chỉ hiện ở tổng kết chặng. Chỉ mở chặng kế khi chặng hiện tại đã hoàn thành; chặng đã hoàn thành bị khóa.
4. Chặng 5 (4 bước): (1) thông tin học sinh, cho sửa họ tên/lớp/trường, ảnh chân dung tùy chọn; (2) mật mã và đóng góp bảo tồn 30-50 từ; (3) xem trước: điểm các chặng, lời chúc, thẻ; (4) xuất PNG và tái khởi động. Mật mã sai (sau khi các trường hợp lệ) -> màn hình thất bại một lần, chỉ có nút "Tái khởi động hành trình".
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
- Điểm lưu theo đơn vị nửa điểm bằng số nguyên (2,5 điểm = 5); hàm định dạng hiển thị dấu phẩy kiểu Việt. Tổng điểm = tổng `s1..s4`, chặn trên 100; Chặng 5 không có điểm.
- Dữ liệu Chặng 1: `{ imageId, options: [{id, label}], correctOptionId }` với 4 lựa chọn dùng chung (angkor-wat, borobudur, shwedagon, wat-rong-khun); ảnh 1 đúng là `angkor-wat`, ảnh 2 đúng là `borobudur`. Thứ tự lựa chọn được xáo một lần khi vào chặng (hàm `shuffle` nhận RNG tiêm được để test), lưu trong state, xáo lại khi RESET; chấm điểm theo `optionId`; nhãn A-D gán sau khi xáo. Chặng 3 giữ thứ tự tài liệu.
- Bảng mảnh mật mã (`CipherFragments`) luôn hiển thị 4 ô theo thứ tự DI, SẢN, KẾT NỐI, TƯƠNG LAI; mảnh chưa nhận là ô trống (khung CSS, không emoji, không hiển thị toàn văn mật mã); dùng lại ở Bước 2 Chặng 5.
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

Placeholder: file màu phẳng, mỗi file một màu và một tên, không vẽ hình; chú thích tên file chỉ hiện ở chế độ `npm run dev`. Chi tiết và cách thay ảnh ở [IMAGE_ASSETS.md](./IMAGE_ASSETS.md).

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
- `.github/workflows/deploy.yml`: build bằng `npm ci && npm run build`, `actions/upload-pages-artifact` + `actions/deploy-pages`; Pages source là GitHub Actions. Remote chưa có: người dùng tự thêm `git remote` và push.

## 8. Quy trình làm việc và commit

- Mỗi bước dưới đây là một commit riêng, thông điệp mô tả rõ nội dung, có trailer `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`.
- Chỉ commit khi lệnh kiểm tra của bước thành công và không còn lỗi chưa xử lý. Nếu thất bại: sửa rồi chạy lại, không commit; không gộp nhiều bước vào một commit; không push (remote chưa có, người dùng tự push khi muốn).
- Git hiện đã sẵn sàng: nhánh `master`, đã có commit `init`, đã cấu hình user.name/user.email. Nếu `git commit` lỗi (hook, khóa file, thiếu danh tính) thì báo rõ nguyên nhân và cách xử lý, không giả vờ đã commit.
- Node, npm, git chưa nằm trong PATH của shell. Mỗi lệnh chạy sau khi đặt: `$env:Path = 'C:\Program Files\nodejs;C:\Program Files\Git\cmd;' + $env:Path`.
- Lệnh kiểm tra chung (sau S1): `npm run typecheck` (`tsc -b`), `npm test` (`vitest run`), `npm run build` (`vite build`).

## 9. Lộ trình từng bước nhỏ

Trạng thái: Bước 2 (khung giao diện) gộp một commit gồm S1, phần khung của S2/S8/S10/S11 (kiểu dữ liệu, reducer điều hướng, cấu hình ảnh, ảnh giữ chỗ, `IMAGE_ASSETS.md`, giao diện giới thiệu/biểu mẫu/5 khung chặng/hộp xác nhận) và các test tương ứng.

Bước 3 (Chặng 1-4) đã làm, mỗi nhóm một commit: hàm chấm điểm thuần S3-S7 (trừ `cipher.ts`, `wordCount.ts` của Chặng 5); `shuffle.ts` (S7a); nội dung nguyên văn S9 cho Chặng 1-4; reducer và selectors S8; giao diện và test hành vi S12-S15. Còn lại: Chặng 5 (S16-S17: `cipher.ts`, `wordCount.ts`, biểu mẫu, thẻ, xuất PNG), test tĩnh mở rộng (S18), workflow GitHub Pages (S19), kiểm tra cuối (S20).

| Bước | Nội dung | Tiêu chí hoàn thành | Lệnh kiểm tra |
|---|---|---|---|
| S0 | Cập nhật 3 tài liệu theo phần D và G (đã làm, commit riêng) | `PROJECT_PLAN.md`, `SCORING_RULES.md`, `OPEN_QUESTIONS.md` (E-H) cập nhật; mục đề xuất chờ duyệt ghi rõ; không emoji | Quét emoji bằng `Select-String` kết quả 0; `git diff --stat` |
| S1 | Khởi tạo Vite + React + TS vào thư mục tạm rồi chép sang (không ghi đè `docs/`, `.docx`); sửa `.gitignore` (dòng lỗi mã hóa thành `~$*`, thêm `node_modules`, `dist`); `base: '/weblichsu/'`; Vitest + Testing Library | Có `package.json`, `src/`, test mẫu xanh; `dist/index.html` trỏ asset dưới `/weblichsu/`; `git status` không hiện file `~$*` | `npm run typecheck`, `npm test`, `npm run build`, kiểm tra `dist/index.html` bằng `Select-String '/weblichsu/'`, `git status -s` |
| S2 | Kiểu dữ liệu, `config/scoring.ts`, định dạng điểm nửa điểm/dấu phẩy | Test định dạng (5 đơn vị nửa điểm -> "2,5"; 75 -> "37,5"; 80 -> "40") xanh | `npm test` |
| S3 | Chấm Chặng 1 (hàm thuần, độc lập với giao diện) | Test: đúng ở 1/2/3/4 ô, sai, 0 ô bị từ chối, hai ảnh, khóa sau hoàn thành, các mốc 20/16-18/8-14/dưới 8, đúng theo `optionId` | `npm test` |
| S4 | Chấm Chặng 2 | Test 0, 2, 14, 16, 28, 30; mảnh SẢN từ 16; thẻ chưa đặt = 0 | `npm test` |
| S5 | Chấm Chặng 3 | Test từng phòng, 0, 40, 15, 37,5; mảnh KẾT NỐI từ 15 | `npm test` |
| S6 | Chấm Chặng 4 | Test 4 nhân vật, 0-3 thẻ, A/B/C, min 4, max 10, không cộng lặp | `npm test` |
| S7 | Tổng điểm, mảnh mật mã (kèm trạng thái ô trống), `cipher.ts`, `wordCount.ts`, điều kiện tạo thẻ | Test tổng không vượt 100, Chặng 5 cộng 0, so khớp mật mã (NFC, hoa/thường, khoảng trắng, dấu), đếm 29/30/50/51 từ, mảnh chưa nhận là rỗng | `npm test` |
| S7a | `shuffle.ts` (Fisher-Yates, RNG tiêm được) | Test: là hoán vị hợp lệ, không mất/trùng phần tử, không đổi mảng gốc, kết quả xác định khi cùng seed | `npm test` |
| S8 | Reducer + Context | Test chống cộng điểm hai lần, khóa chặng, gating, RESET, bấm hoàn thành liên tục | `npm test`, `npm run typecheck` |
| S9 | Nội dung nguyên văn từ docx cho Chặng 2-5 và Chặng 1 (4 lựa chọn đã sửa chính tả, đáp án đúng), áp dụng sổ sửa chính tả (E3) | Test đếm: 15 thẻ, 4 từ Phòng 2, 4 câu Phòng 3, 3 phương án, 4 lựa chọn Chặng 1 và đúng 1 đáp án đúng mỗi ảnh; không còn "Hin đu", "ĐẠO SỨ", "War Rong", "Shwedagob", "Borobudur" trong nội dung giao diện | `npm test` |
| S10 | `config/assets.ts`, 11 file placeholder trung tính khác tên (và nền tùy chọn), `docs/IMAGE_ASSETS.md` | Test tên file duy nhất, file tồn tại, đường dẫn dùng `BASE_URL` | `npm test`, `npm run build` |
| S11 | Khung giao diện: giới thiệu, form thông tin (B26, B31), tiến trình, bảng mảnh mật mã, hộp xác nhận tái khởi động | Test hành vi: nút disabled khi thiếu thông tin, thông báo đúng tại trường, xác nhận trước khi reset | `npm test`, `npm run build` |
| S12 | UI Chặng 1: hai ảnh cùng lúc, lựa chọn xáo trộn | Hoàn thành chỉ sáng khi mỗi ảnh đã mở ít nhất 1 ô và đã chọn; khóa sau hoàn thành; không lộ đáp án khi sai; chấm đúng dù thứ tự đã xáo | `npm test`, `npm run build` |
| S13 | UI Chặng 2 (kéo thả và chọn thẻ rồi chọn giai đoạn) | Test chọn thẻ, đặt thẻ, hoàn thành khi chưa đặt hết, khóa | `npm test`, `npm run build` |
| S14 | UI Chặng 3 (3 phòng tuần tự; Phòng 1 mỗi tủ một hiện vật, hoán đổi khi đặt vào tủ đã có) | Test thứ tự phòng, bắt buộc đủ mục, không hiện điểm phòng khi chơi, tổng kết kèm điểm từng phòng | `npm test`, `npm run build` |
| S15 | UI Chặng 4 | Test chọn nhân vật + phương án mới hoàn tất, thẻ chứng cứ tùy chọn, ghi chú tình huống giả định | `npm test`, `npm run build` |
| S16 | Chặng 5: 4 bước, sửa thông tin, ô mảnh trống, kiểm tra hợp lệ (B21-B26, thứ tự C5), màn hình thất bại | Test thông báo đúng 4 câu, không xóa dữ liệu khi lỗi, sai mật mã chỉ có nút tái khởi động, đoán đúng mật mã khi thiếu mảnh vẫn tạo được thẻ | `npm test`, `npm run build` |
| S17 | Thẻ Đại sứ + xuất PNG bằng `html-to-image` | Test ngày dd/mm/yyyy, lời khen 100 và dưới 100, 50 từ không bị cắt; thử xuất trên trình duyệt thật | `npm test`, `npm run build` và thử thủ công |
| S18 | Test tĩnh | Không có `localStorage`, `sessionStorage`, `document.cookie`, `indexedDB`, `fetch`, `XMLHttpRequest`, QR, emoji trong `src` | `npm test` |
| S19 | Workflow GitHub Pages | `.github/workflows/deploy.yml` hợp lệ; `vite preview` phục vụ đúng ở đường dẫn con | `npm run build`, `curl http://localhost:4173/weblichsu/` |
| S20 | Kiểm tra cuối | Tất cả lệnh chung xanh, quét tĩnh sạch; chỉ báo kết quả đã thực sự chạy | `npm run typecheck`, `npm test`, `npm run build` |

Không còn bước nào bị chặn bởi câu hỏi chưa xác nhận. Các mục đề xuất chờ duyệt (nhãn "Đền Bô-rô-bu-đua", chữ "Chưa nhận", chữ giao diện E4) được gom trong `src/content/uiText.ts` và `src/content/stage1.ts` để sửa nhanh; xem phần H của `OPEN_QUESTIONS.md`.
