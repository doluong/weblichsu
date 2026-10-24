import { FRAGMENT_SLOTS } from '../../config/stages'
import { UI_TEXT } from '../../content/uiText'
import type { GameState } from '../../game/types'

interface CipherFragmentsProps {
  fragments: GameState['fragments']
}

// Luôn hiển thị 4 ô theo thứ tự chặng; mảnh chưa nhận là ô trống, không lộ toàn văn mật mã.
export function CipherFragments({ fragments }: CipherFragmentsProps) {
  return (
    <section className="cipher" aria-label="Mảnh mật mã đã nhận">
      <h2 className="cipher__title">Mảnh mật mã</h2>
      <ul className="cipher__list">
        {FRAGMENT_SLOTS.map((slot) => {
          const received = fragments[slot.stage]
          return (
            <li
              key={slot.stage}
              className={`cipher__slot ${received ? 'cipher__slot--filled' : 'cipher__slot--empty'}`}
            >
              <span className="cipher__index">Chặng {slot.stage}</span>
              <span className="cipher__value">{received ? slot.text : UI_TEXT.fragmentEmpty}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
