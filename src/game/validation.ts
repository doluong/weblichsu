import { VALIDATION_MESSAGES } from '../content/uiText'
import type { StudentInfo } from './types'

export type StudentInfoErrors = Partial<Record<keyof StudentInfo, string>>

export function normalizeText(value: string): string {
  return value.normalize('NFC').replace(/\s+/g, ' ').trim()
}

export function normalizeStudentInfo(info: StudentInfo): StudentInfo {
  return {
    name: normalizeText(info.name),
    className: normalizeText(info.className),
    school: normalizeText(info.school),
  }
}

// Mỗi trường rỗng nhận thông báo B26, hiển thị tại chính trường đó.
export function validateStudentInfo(info: StudentInfo): StudentInfoErrors {
  const normalized = normalizeStudentInfo(info)
  const errors: StudentInfoErrors = {}
  if (normalized.name === '') errors.name = VALIDATION_MESSAGES.studentInfoRequired
  if (normalized.className === '') errors.className = VALIDATION_MESSAGES.studentInfoRequired
  if (normalized.school === '') errors.school = VALIDATION_MESSAGES.studentInfoRequired
  return errors
}

export function isStudentInfoValid(info: StudentInfo): boolean {
  return Object.keys(validateStudentInfo(info)).length === 0
}
