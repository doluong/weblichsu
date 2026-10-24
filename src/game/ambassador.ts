import { VALIDATION_MESSAGES } from '../content/uiText'
import { ENCOURAGE_MESSAGE, FAILURE_MESSAGE, PRAISE_MESSAGE, fillName } from '../content/stage5'
import { normalizeCode } from './cipher'
import type { HalfPoints } from './scoring/points'
import { toHalf } from './scoring/points'
import { MAX_TOTAL_POINTS } from './scoring/total'
import type { StudentInfo } from './types'
import { isStudentInfoValid } from './validation'
import { isActionLengthValid } from './wordCount'

export interface AmbassadorErrors {
  student?: string
  code?: string
  action?: string
  summary?: string
}

// C5: kiểm tra thông tin học sinh, mật mã rỗng, độ dài 10-30 từ. Nếu có lỗi thì thêm thông báo chung,
// không xóa dữ liệu đã nhập. Chưa so khớp mật mã ở bước này.
export function validateAmbassador(student: StudentInfo, code: string, action: string): AmbassadorErrors {
  const errors: AmbassadorErrors = {}
  if (!isStudentInfoValid(student)) errors.student = VALIDATION_MESSAGES.studentInfoRequired
  if (normalizeCode(code) === '') errors.code = VALIDATION_MESSAGES.codeRequired
  if (!isActionLengthValid(action)) errors.action = VALIDATION_MESSAGES.actionLength
  if (Object.keys(errors).length > 0) errors.summary = VALIDATION_MESSAGES.reviewBeforeCard
  return errors
}

export function hasErrors(errors: AmbassadorErrors): boolean {
  return Object.keys(errors).length > 0
}

// B27: ngày tạo thẻ theo ngày thực tế trên thiết bị, định dạng ngày/tháng/năm.
export function formatIssueDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${date.getFullYear()}`
}

// Lời khen chỉ dùng khi tổng điểm đúng bằng 100; còn lại dùng lời động viên (nguyên văn tài liệu).
export function isPerfectScore(total: HalfPoints): boolean {
  return total === toHalf(MAX_TOTAL_POINTS)
}

export function getCardMessage(total: HalfPoints, name: string): string {
  return fillName(isPerfectScore(total) ? PRAISE_MESSAGE : ENCOURAGE_MESSAGE, name)
}

export function getFailureMessage(name: string): string {
  return fillName(FAILURE_MESSAGE, name)
}

// Tên file xuất thẻ: không dấu, chỉ gồm chữ thường, số và dấu gạch nối.
export function exportFileName(name: string): string {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `the-dai-su-di-san-so${slug ? `-${slug}` : ''}.png`
}
