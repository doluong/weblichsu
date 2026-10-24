// Mật mã chính xác của Chặng 5 (tài liệu nguồn): ghép từ bốn mảnh DI + SẢN + KẾT NỐI + TƯƠNG LAI.
export const CIPHER_CODE = 'DI SẢN KẾT NỐI TƯƠNG LAI'

// B23: bỏ khoảng trắng đầu/cuối, gộp khoảng trắng liên tiếp, chuẩn hóa Unicode NFC,
// không phân biệt chữ hoa/thường. Vẫn phân biệt dấu tiếng Việt (SẢN khác SAN).
export function normalizeCode(input: string): string {
  return input.normalize('NFC').replace(/\s+/g, ' ').trim().toUpperCase().normalize('NFC')
}

export function isCorrectCode(input: string): boolean {
  return normalizeCode(input) === normalizeCode(CIPHER_CODE)
}
