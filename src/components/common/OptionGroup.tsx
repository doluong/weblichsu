interface OptionItem {
  id: string
  label: string
}

interface OptionGroupProps {
  name: string
  legend: string
  options: readonly OptionItem[]
  value: string | null
  onChange: (optionId: string) => void
  disabled?: boolean
  // Nhãn A-D: mặc định theo vị trí hiển thị; có thể dùng mã lựa chọn của tài liệu.
  letterOf?: (option: OptionItem, index: number) => string
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

export function OptionGroup({ name, legend, options, value, onChange, disabled, letterOf }: OptionGroupProps) {
  return (
    <fieldset className="options" disabled={disabled}>
      <legend className="options__legend">{legend}</legend>
      {options.map((option, index) => (
        <label key={option.id} className={`option ${value === option.id ? 'is-selected' : ''}`}>
          <input
            type="radio"
            name={name}
            value={option.id}
            checked={value === option.id}
            onChange={() => onChange(option.id)}
          />
          <span className="option__letter" aria-hidden="true">
            {letterOf ? letterOf(option, index) : LETTERS[index]}
          </span>
          <span className="option__label">{option.label}</span>
        </label>
      ))}
    </fieldset>
  )
}
