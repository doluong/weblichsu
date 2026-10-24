import type { InputHTMLAttributes } from 'react'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  id: string
  label: string
  error?: string
}

export function TextField({ id, label, error, className = '', ...rest }: TextFieldProps) {
  const errorId = `${id}-error`
  return (
    <div className={`field ${error ? 'field--invalid' : ''} ${className}`.trim()}>
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <input
        id={id}
        className="field__input"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      <p id={errorId} className="field__error" role={error ? 'alert' : undefined}>
        {error}
      </p>
    </div>
  )
}
