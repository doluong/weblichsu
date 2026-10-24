import { useState, type FormEvent } from 'react'
import { ACTION_SUGGESTIONS, FIELD_TEXT } from '../../content/stage5'
import { UI_TEXT } from '../../content/uiText'
import { formatIssueDate, hasErrors, validateAmbassador, type AmbassadorErrors } from '../../game/ambassador'
import { countWords } from '../../game/wordCount'
import { useGame } from '../../state/useGame'
import { Button } from '../common/Button'
import { TextArea } from '../common/TextArea'
import { TextField } from '../common/TextField'

// Bước 2: nhập mật mã và hành động bảo tồn (10-30 từ). Gợi ý chỉ để tham khảo, không tự điền sẵn.
export function AmbassadorStep2() {
  const { state, dispatch } = useGame()
  const { code, action } = state.ambassador
  const [errors, setErrors] = useState<AmbassadorErrors>({})

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const found = validateAmbassador(state.student, code, action)
    setErrors(found)
    if (hasErrors(found)) return
    dispatch({ type: 'SUBMIT_AMBASSADOR', issuedAt: formatIssueDate(new Date()) })
  }

  return (
    <form className="card ambassador-form" onSubmit={onSubmit} noValidate>
      <h2 className="card__title card__title--small">Bước 2: Mật mã và hành động bảo tồn</h2>

      <TextField
        id="amb-code"
        label={FIELD_TEXT.codeLabel}
        value={code}
        error={errors.code}
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        onChange={(event) => {
          dispatch({ type: 'SET_CODE', code: event.target.value })
          if (errors.code) setErrors((current) => ({ ...current, code: undefined, summary: undefined }))
        }}
      />

      <TextArea
        id="amb-action"
        label={FIELD_TEXT.actionLabel}
        value={action}
        error={errors.action}
        hint={UI_TEXT.stage5WordCount(countWords(action))}
        rows={6}
        onChange={(event) => {
          dispatch({ type: 'SET_ACTION', action: event.target.value })
          if (errors.action) setErrors((current) => ({ ...current, action: undefined, summary: undefined }))
        }}
      />

      <div className="suggestions">
        <p className="field__label">{FIELD_TEXT.suggestionsTitle}</p>
        <ul>
          {ACTION_SUGGESTIONS.map((suggestion) => (
            <li key={suggestion}>{suggestion}</li>
          ))}
        </ul>
      </div>

      {errors.student && <p className="field__error" role="alert">{errors.student}</p>}
      {errors.summary && (
        <p className="form-summary-error" role="alert">
          {errors.summary}
        </p>
      )}

      <div className="form-actions">
        <Button variant="ghost" onClick={() => dispatch({ type: 'AMBASSADOR_STEP', step: 1 })}>
          {UI_TEXT.stage5Back}
        </Button>
        <Button type="submit">{UI_TEXT.stage5Submit}</Button>
      </div>
    </form>
  )
}
