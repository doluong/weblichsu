import type { ComponentProps } from 'react'

type TextAreaProps = Omit<ComponentProps<'textarea'>, 'id'> & {
  id: string
  label: string
  error?: string
  hint?: string
}

export function TextArea({ id, label, error, hint, className = '', ...rest }: TextAreaProps) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  return (
    <div className={`field ${error ? 'field--invalid' : ''} ${className}`.trim()}>
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <textarea
        id={id}
        className="field__input field__input--area"
        aria-invalid={error ? true : undefined}
        aria-describedby={`${hint ? `${hintId} ` : ''}${error ? errorId : ''}`.trim() || undefined}
        {...rest}
      />
      {hint && (
        <p id={hintId} className="field__hint" aria-live="polite">
          {hint}
        </p>
      )}
      <p id={errorId} className="field__error" role={error ? 'alert' : undefined}>
        {error}
      </p>
    </div>
  )
}
