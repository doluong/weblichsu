import { describe, expect, it } from 'vitest'
import { VALIDATION_MESSAGES } from '../content/uiText'
import { ENCOURAGE_MESSAGE, FAILURE_MESSAGE, PRAISE_MESSAGE } from '../content/stage5'
import {
  exportFileName,
  formatIssueDate,
  getCardMessage,
  getFailureMessage,
  hasErrors,
  isPerfectScore,
  validateAmbassador,
} from './ambassador'
import { VALID_ACTION, student } from '../test/actions'

const words = (count: number) => Array.from({ length: count }, (_, index) => `từ${index}`).join(' ')

describe('kiểm tra hợp lệ Chặng 5 (thứ tự C5)', () => {
  it('đủ thông tin, mật mã không rỗng và 10-30 từ thì không có lỗi', () => {
    expect(validateAmbassador(student, 'DI SẢN', VALID_ACTION)).toEqual({})
  })

  it('thiếu thông tin học sinh', () => {
    const errors = validateAmbassador({ ...student, school: '' }, 'DI SẢN', VALID_ACTION)
    expect(errors.student).toBe(VALIDATION_MESSAGES.studentInfoRequired)
    expect(errors.summary).toBe(VALIDATION_MESSAGES.reviewBeforeCard)
  })

  it('mật mã rỗng hoặc chỉ có khoảng trắng', () => {
    expect(validateAmbassador(student, '', VALID_ACTION).code).toBe('Vui lòng nhập mật mã.')
    expect(validateAmbassador(student, '   ', VALID_ACTION).code).toBe('Vui lòng nhập mật mã.')
  })

  it.each([0, 9, 31])('hành động %i từ bị từ chối', (count) => {
    const errors = validateAmbassador(student, 'DI SẢN', words(count))
    expect(errors.action).toBe('Đóng góp bảo tồn cần có từ 10 đến 30 từ.')
  })

  it.each([10, 30])('hành động %i từ hợp lệ', (count) => {
    expect(validateAmbassador(student, 'DI SẢN', words(count)).action).toBeUndefined()
  })

  it('mật mã sai nhưng không rỗng thì chưa bị coi là lỗi nhập (so khớp ở bước sau)', () => {
    expect(hasErrors(validateAmbassador(student, 'SAI MẬT MÃ', VALID_ACTION))).toBe(false)
  })

  it('nhiều lỗi cùng lúc: hiện lỗi từng trường và thông báo chung', () => {
    const errors = validateAmbassador({ name: '', className: '', school: '' }, '', '')
    expect(Object.keys(errors).sort()).toEqual(['action', 'code', 'student', 'summary'])
  })
})

describe('ngày cấp', () => {
  it('định dạng ngày/tháng/năm, thêm số 0 phía trước', () => {
    expect(formatIssueDate(new Date(2026, 0, 5))).toBe('05/01/2026')
    expect(formatIssueDate(new Date(2026, 9, 24))).toBe('24/10/2026')
    expect(formatIssueDate(new Date(2026, 11, 31))).toBe('31/12/2026')
  })
})

describe('lời nhắn trên thẻ', () => {
  it('lời khen chỉ khi đúng 100/100, thay tên học sinh', () => {
    expect(isPerfectScore(200)).toBe(true)
    expect(isPerfectScore(199)).toBe(false)
    const message = getCardMessage(200, 'Nguyễn Văn A')
    expect(message).toBe(PRAISE_MESSAGE.replace('{name}', 'Nguyễn Văn A'))
    expect(message.startsWith('Cô Thảo cảm ơn Nguyễn Văn A đã xuất sắc')).toBe(true)
    expect(message).toContain('Con xứng đáng là một Đại sứ Di sản số tài năng!')
  })

  it('dưới 100 (kể cả 99,5) dùng lời động viên', () => {
    for (const total of [0, 150, 199]) {
      const message = getCardMessage(total, 'An')
      expect(message).toBe(ENCOURAGE_MESSAGE.replace('{name}', 'An'))
      expect(message).toContain('chưa thật sự như ý')
    }
  })

  it('lời nhắn khi sai mật mã', () => {
    expect(getFailureMessage('An')).toBe(FAILURE_MESSAGE.replace('{name}', 'An'))
    expect(getFailureMessage('An')).toContain('Đừng nản lòng nhé')
  })
})

describe('tên file xuất thẻ', () => {
  it('bỏ dấu tiếng Việt, chuyển đ thành d, chỉ gồm ký tự an toàn', () => {
    expect(exportFileName('Nguyễn Thị Đào')).toBe('the-dai-su-di-san-so-nguyen-thi-dao.png')
    expect(exportFileName('  ../A/B: C?  ')).toBe('the-dai-su-di-san-so-a-b-c.png')
  })

  it('tên rỗng vẫn có tên file hợp lệ', () => {
    expect(exportFileName('')).toBe('the-dai-su-di-san-so.png')
  })
})
