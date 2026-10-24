import { toPng } from 'html-to-image'

// Xuất đúng phần tử thẻ (không gồm nút bấm hay giao diện website) thành ảnh PNG ngay trên thiết bị.
// Phần tử thẻ có chiều rộng thiết kế cố định nên ảnh giống nhau trên mọi kích thước màn hình.
export async function renderCardPng(node: HTMLElement): Promise<string> {
  // Chờ font tiếng Việt tải xong để chữ không bị đổi font trong ảnh.
  if (document.fonts?.ready) await document.fonts.ready
  // Không dùng cacheBust: nó thêm "?timestamp" vào URL ảnh, làm hỏng ảnh chân dung dạng blob: của người dùng.
  return toPng(node, {
    pixelRatio: 2,
    backgroundColor: '#fffdf8',
    width: node.offsetWidth,
    height: node.offsetHeight,
  })
}

// Tải file về máy (thao tác do người dùng chủ động, không lưu tiến trình trò chơi).
export function downloadDataUrl(dataUrl: string, fileName: string): void {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
}
