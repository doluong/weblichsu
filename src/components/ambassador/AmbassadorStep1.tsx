import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { UI_TEXT } from '../../content/uiText'
import { isValidAvatarFile } from '../../game/avatar'
import { normalizeText, validateStudentInfo, type StudentInfoErrors } from '../../game/validation'
import type { StudentInfo } from '../../game/types'
import { useGame } from '../../state/useGame'
import { Button } from '../common/Button'
import { TextField } from '../common/TextField'

// Bước 1: thông tin Đại sứ (cho sửa họ tên, lớp, trường) và ảnh chân dung tùy chọn.
export function AmbassadorStep1() {
  const { state, dispatch } = useGame()
  const [values, setValues] = useState<StudentInfo>(state.student)
  const [errors, setErrors] = useState<StudentInfoErrors>({})
  const [avatarError, setAvatarError] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const avatarUrl = state.ambassador.avatarUrl

  const update = (field: keyof StudentInfo, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    if (errors[field] && normalizeText(value) !== '') setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const replaceAvatar = (nextUrl: string | null) => {
    if (avatarUrl) URL.revokeObjectURL(avatarUrl)
    dispatch({ type: 'SET_AVATAR', avatarUrl: nextUrl })
  }

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!isValidAvatarFile(file)) {
      setAvatarError(true)
      return
    }
    setAvatarError(false)
    replaceAvatar(URL.createObjectURL(file))
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const found = validateStudentInfo(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    dispatch({ type: 'UPDATE_STUDENT', student: values })
    dispatch({ type: 'AMBASSADOR_STEP', step: 2 })
  }

  return (
    <form className="card ambassador-form" onSubmit={onSubmit} noValidate>
      <h2 className="card__title card__title--small">Bước 1: Thông tin Đại sứ</h2>
      <TextField
        id="amb-name"
        label={UI_TEXT.nameLabel}
        value={values.name}
        error={errors.name}
        autoComplete="name"
        onChange={(event) => update('name', event.target.value)}
      />
      <div className="form-row">
        <TextField
          id="amb-class"
          label={UI_TEXT.classLabel}
          value={values.className}
          error={errors.className}
          autoComplete="off"
          onChange={(event) => update('className', event.target.value)}
        />
        <TextField
          id="amb-school"
          label={UI_TEXT.schoolLabel}
          value={values.school}
          error={errors.school}
          autoComplete="off"
          onChange={(event) => update('school', event.target.value)}
        />
      </div>

      <div className="avatar-picker">
        <p className="field__label">{UI_TEXT.stage5AvatarLabel}</p>
        {avatarUrl && <img className="avatar-picker__preview" src={avatarUrl} alt="Ảnh chân dung đã chọn" />}
        <div className="avatar-picker__actions">
          <input
            ref={fileInput}
            id="amb-avatar"
            className="avatar-picker__input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-label={UI_TEXT.stage5AvatarLabel}
            onChange={onFile}
          />
          {avatarUrl && (
            <Button variant="ghost" className="btn--small" onClick={() => replaceAvatar(null)}>
              {UI_TEXT.stage5AvatarRemove}
            </Button>
          )}
        </div>
        <p className="field__hint">{UI_TEXT.stage5AvatarNote}</p>
        <p className="field__error" role={avatarError ? 'alert' : undefined}>
          {avatarError ? UI_TEXT.stage5AvatarError : ''}
        </p>
      </div>

      <div className="form-actions form-actions--end">
        <Button type="submit">{UI_TEXT.stage5Next}</Button>
      </div>
    </form>
  )
}
