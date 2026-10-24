import { useState, type FormEvent } from 'react'
import { UI_TEXT } from '../../content/uiText'
import { normalizeText, validateStudentInfo, type StudentInfoErrors } from '../../game/validation'
import type { StudentInfo } from '../../game/types'
import { Button } from '../common/Button'
import { TextField } from '../common/TextField'

interface InfoScreenProps {
  initial: StudentInfo
  onSubmit: (student: StudentInfo) => void
  onBack: () => void
}

export function InfoScreen({ initial, onSubmit, onBack }: InfoScreenProps) {
  const [values, setValues] = useState<StudentInfo>(initial)
  const [errors, setErrors] = useState<StudentInfoErrors>({})

  const update = (field: keyof StudentInfo, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    // Chỉ gỡ thông báo khi trường đã hợp lệ; không xóa dữ liệu đã nhập.
    if (errors[field] && normalizeText(value) !== '') {
      setErrors((current) => ({ ...current, [field]: undefined }))
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const found = validateStudentInfo(values)
    setErrors(found)
    if (Object.keys(found).length === 0) onSubmit(values)
  }

  return (
    <div className="screen info">
      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        <p className="card__eyebrow">Trước khi bắt đầu</p>
        <h1 className="card__title">{UI_TEXT.infoTitle}</h1>
        <p className="card__lead">{UI_TEXT.infoLead}</p>

        <TextField
          id="student-name"
          label={UI_TEXT.nameLabel}
          value={values.name}
          error={errors.name}
          autoComplete="name"
          onChange={(event) => update('name', event.target.value)}
        />
        <div className="form-row">
          <TextField
            id="student-class"
            label={UI_TEXT.classLabel}
            value={values.className}
            error={errors.className}
            autoComplete="off"
            onChange={(event) => update('className', event.target.value)}
          />
          <TextField
            id="student-school"
            label={UI_TEXT.schoolLabel}
            value={values.school}
            error={errors.school}
            autoComplete="off"
            onChange={(event) => update('school', event.target.value)}
          />
        </div>

        <p className="form-note">{UI_TEXT.infoMemoryNote}</p>

        <div className="form-actions">
          <Button variant="ghost" onClick={onBack}>
            {UI_TEXT.infoBack}
          </Button>
          <Button type="submit">{UI_TEXT.infoSubmit}</Button>
        </div>
      </form>
    </div>
  )
}
