import { describe, expect, it } from 'vitest'
import { CIPHER_CODE, isCorrectCode, normalizeCode } from './cipher'

describe('mật mã', () => {
  it('mật mã chính xác theo tài liệu', () => {
    expect(CIPHER_CODE).toBe('DI SẢN KẾT NỐI TƯƠNG LAI')
    expect(isCorrectCode('DI SẢN KẾT NỐI TƯƠNG LAI')).toBe(true)
  })

  it('không phân biệt chữ hoa/chữ thường', () => {
    expect(isCorrectCode('di sản kết nối tương lai')).toBe(true)
    expect(isCorrectCode('Di Sản Kết Nối Tương Lai')).toBe(true)
  })

  it('bỏ khoảng trắng đầu/cuối và gộp khoảng trắng liên tiếp (kể cả tab và xuống dòng)', () => {
    expect(isCorrectCode('   DI SẢN KẾT NỐI TƯƠNG LAI   ')).toBe(true)
    expect(isCorrectCode('DI   SẢN\tKẾT  NỐI\nTƯƠNG   LAI')).toBe(true)
    expect(isCorrectCode('DI\u00a0SẢN KẾT NỐI TƯƠNG LAI')).toBe(true)
  })

  it('chuẩn hóa Unicode NFC: dạng tổ hợp và dạng dựng sẵn đều đúng', () => {
    const decomposed = 'DI SA\u0309N KE\u0302\u0301T NO\u0302\u0301I TU\u031BO\u031BNG LAI'
    expect(decomposed).not.toBe(CIPHER_CODE)
    expect(isCorrectCode(decomposed)).toBe(true)
    expect(isCorrectCode('di sa\u0309n ke\u0302\u0301t no\u0302\u0301i tu\u031Bo\u031Bng lai')).toBe(true)
  })

  it('vẫn phân biệt dấu tiếng Việt', () => {
    expect(isCorrectCode('DI SAN KET NOI TUONG LAI')).toBe(false)
    expect(isCorrectCode('DI SẢN KẾT NỐI TƯƠNG LẠI')).toBe(false)
    expect(isCorrectCode('DI SÂN KẾT NỐI TƯƠNG LAI')).toBe(false)
  })

  it('sai mật mã: thiếu mảnh, thừa mảnh, đảo thứ tự, rỗng', () => {
    expect(isCorrectCode('DI SẢN KẾT NỐI')).toBe(false)
    expect(isCorrectCode('DI SẢN KẾT NỐI TƯƠNG LAI 1')).toBe(false)
    expect(isCorrectCode('SẢN DI KẾT NỐI TƯƠNG LAI')).toBe(false)
    expect(isCorrectCode('DISẢNKẾTNỐITƯƠNGLAI')).toBe(false)
    expect(isCorrectCode('')).toBe(false)
    expect(isCorrectCode('   ')).toBe(false)
  })

  it('normalizeCode trả về dạng in hoa, một khoảng trắng', () => {
    expect(normalizeCode('  di   sản ')).toBe('DI SẢN')
  })
})
