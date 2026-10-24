import { ROOM3_QUESTIONS, orderedOptions } from '../../content/stage3'
import { useGame } from '../../state/useGame'
import { ImageSlot } from '../common/ImageSlot'
import { OptionGroup } from '../common/OptionGroup'

// Phòng 3: 4 công trình, mỗi công trình một câu hỏi trắc nghiệm 4 lựa chọn.
export function Room3({ locked }: { locked: boolean }) {
  const { state, dispatch } = useGame()
  const answers = state.stage3.room3
  const order = state.stage3.room3Order

  return (
    <ul className="buildings">
      {ROOM3_QUESTIONS.map((item) => (
        <li key={item.id} className="building card" aria-label={item.buildingName}>
          <ImageSlot imageKey={item.imageKey} alt={item.buildingName} />
          <h3 className="building__name">{item.buildingName}</h3>
          <OptionGroup
            name={item.id}
            legend={item.question}
            disabled={locked}
            value={answers[item.id]}
            options={orderedOptions(item.options, order[item.id])}
            onChange={(optionId) => dispatch({ type: 'ANSWER_ROOM3', questionId: item.id, optionId })}
          />
        </li>
      ))}
    </ul>
  )
}
