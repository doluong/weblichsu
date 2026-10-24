import { ROOM2_BLANKS, ROOM2_PASSAGES, orderedOptions } from '../../content/stage3'
import { useGame } from '../../state/useGame'
import { OptionGroup } from '../common/OptionGroup'

const BLANK_BY_ID = Object.fromEntries(ROOM2_BLANKS.map((blank) => [blank.id, blank]))

// Phòng 2: chọn từ còn thiếu cho 4 chỗ trống trong hai tư liệu.
export function Room2({ locked }: { locked: boolean }) {
  const { state, dispatch } = useGame()
  const answers = state.stage3.room2
  const order = state.stage3.room2Order

  return (
    <div className="room-body">
      {ROOM2_PASSAGES.map((passage) => {
        const blankIds = passage.segments.flatMap((segment) => (segment.type === 'blank' ? [segment.blankId] : []))
        return (
          <section key={passage.id} className="card passage" aria-label={passage.title}>
            <h3 className="card__title card__title--small">{passage.title}</h3>
            <p className="passage__text">
              {passage.segments.map((segment, index) => {
                if (segment.type === 'text') return <span key={index}>{segment.value}</span>
                const blank = BLANK_BY_ID[segment.blankId]
                const chosen = blank.options.find((option) => option.id === answers[blank.id])
                return (
                  <span key={index} className={`blank ${chosen ? 'is-filled' : ''}`}>
                    {chosen ? chosen.label : blank.marker}
                  </span>
                )
              })}
            </p>
            <div className="passage__choices">
              {blankIds.map((blankId) => {
                const blank = BLANK_BY_ID[blankId]
                return (
                  <OptionGroup
                    key={blankId}
                    name={blankId}
                    legend={`Lựa chọn điền ${blank.marker}`}
                    disabled={locked}
                    value={answers[blankId]}
                    options={orderedOptions(blank.options, order[blankId])}
                    onChange={(optionId) => dispatch({ type: 'ANSWER_ROOM2', blankId, optionId })}
                  />
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
