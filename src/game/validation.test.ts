import { describe, expect, it } from 'vitest'
import { VALIDATION_MESSAGES } from '../content/uiText'
import { isStudentInfoValid, normalizeText, validateStudentInfo } from './validation'

describe('validation', () => {
  it('chuẩn hóa: cắt đầu/cuối, gộp khoảng trắng, NFC', () => {
    expect(normalizeText('  12   A1 ')).toBe('12 A1')
    const decomposed = 'Sa\u0309n' // "Sản" ở dạng tổ hợp
    expect(normalizeText(decomposed)).toBe('Sản')
  })

  it('trường rỗng nhận đúng thông báo B26 tại trường đó', () => {
    const errors = validateStudentInfo({ name: '', className: '12A1', school: '   ' })
    expect(errors.name).toBe(VALIDATION_MESSAGES.studentInfoRequired)
    expect(errors.school).toBe(VALIDATION_MESSAGES.studentInfoRequired)
    expect(errors.className).toBeUndefined()
  })

  it('đủ ba trường thì hợp lệ', () => {
    expect(isStudentInfoValid({ name: 'A', className: 'B', school: 'C' })).toBe(true)
  })

  it('thông báo đúng nguyên văn tài liệu quyết định', () => {
    expect(VALIDATION_MESSAGES.studentInfoRequired).toBe('Vui lòng nhập đầy đủ họ và tên, lớp, trường.')
    expect(VALIDATION_MESSAGES.codeRequired).toBe('Vui lòng nhập mật mã.')
    expect(VALIDATION_MESSAGES.actionLength).toBe('Đóng góp bảo tồn cần có từ 10 đến 30 từ.')
    expect(VALIDATION_MESSAGES.reviewBeforeCard).toBe('Vui lòng kiểm tra lại thông tin trước khi tạo thẻ.')
  })
})
