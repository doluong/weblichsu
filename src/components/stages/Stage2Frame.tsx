import { useState, type DragEvent } from 'react'
import { STAGE2_CARD_TEXT, STAGE2_CARDS, STAGE2_PERIODS, type PeriodId } from '../../content/stage2'
import { UI_TEXT } from '../../content/uiText'
import { useGame } from '../../state/useGame'
import { Button } from '../common/Button'
import { StageFrame } from './StageFrame'

export function Stage2Frame() {
  const { state, dispatch } = useGame()
  const { placements, cardOrder } = state.stage2
  const locked = state.stageStatus[2] !== 'in_progress'
  const [selected, setSelected] = useState<string | null>(null)

  const bank = cardOrder.filter((id) => placements[id] === null)
  const placedCount = STAGE2_CARDS.length - bank.length
  const selectedIsPlaced = selected !== null && placements[selected] !== null

  const place = (cardId: string, period: PeriodId | null) => {
    dispatch({ type: 'PLACE_CARD', cardId, period })
    setSelected(null)
  }

  const onDragStart = (event: DragEvent, cardId: string) => {
    event.dataTransfer.setData('text/plain', cardId)
    event.dataTransfer.effectAllowed = 'move'
  }

  const onDrop = (event: DragEvent, period: PeriodId | null) => {
    event.preventDefault()
    if (locked) return
    const cardId = event.dataTransfer.getData('text/plain')
    if (cardId) place(cardId, period)
  }

  const chip = (cardId: string) => (
    <li key={cardId}>
      <button
        type="button"
        className={`chip ${selected === cardId ? 'is-selected' : ''}`}
        aria-pressed={selected === cardId}
        disabled={locked}
        draggable={!locked}
        onDragStart={(event) => onDragStart(event, cardId)}
        onClick={() => setSelected(selected === cardId ? null : cardId)}
      >
        {STAGE2_CARD_TEXT[cardId]}
      </button>
    </li>
  )

  return (
    <StageFrame
      stageId={2}
      footer={
        <>
          <p className="stage__note">{locked ? UI_TEXT.stage2Locked : UI_TEXT.stage2Hint}</p>
          <Button disabled={locked} onClick={() => dispatch({ type: 'SUBMIT_STAGE2' })}>
            {UI_TEXT.stage2Complete}
          </Button>
        </>
      }
    >
      <p className="status-line" aria-live="polite">
        {selected !== null
          ? `Đã chọn thẻ: ${STAGE2_CARD_TEXT[selected]}. ${UI_TEXT.stage2PickZone}`
          : `Đã đặt ${placedCount}/${STAGE2_CARDS.length} thẻ.`}
      </p>

      <section className="timeline" aria-label="Trục thời gian Đông Nam Á">
        <h2 className="section-title section-title--small">Trục thời gian Đông Nam Á</h2>
        <ol className="timeline__zones">
          {STAGE2_PERIODS.map((period) => {
            const cards = cardOrder.filter((id) => placements[id] === period.id)
            return (
              <li
                key={period.id}
                className="timeline__zone"
                onDragOver={(event) => !locked && event.preventDefault()}
                onDrop={(event) => onDrop(event, period.id)}
              >
                <h3 className="timeline__period">{period.label}</h3>
                <ul className="chip-list chip-list--zone" aria-label={`Thẻ trong giai đoạn ${period.label}`}>
                  {cards.map(chip)}
                </ul>
                {cards.length === 0 && <p className="dropzone dropzone--small">{UI_TEXT.stage2EmptyZone}</p>}
                <Button
                  variant="secondary"
                  className="btn--small"
                  disabled={locked || selected === null}
                  aria-label={`Đặt thẻ đã chọn vào giai đoạn ${period.label}`}
                  onClick={() => selected !== null && place(selected, period.id)}
                >
                  {UI_TEXT.stage2PlaceHere}
                </Button>
              </li>
            )
          })}
        </ol>
      </section>

      <section
        className="card bank"
        aria-label="Ngân hàng thẻ"
        onDragOver={(event) => !locked && event.preventDefault()}
        onDrop={(event) => onDrop(event, null)}
      >
        <h2 className="card__title card__title--small">Ngân hàng thẻ</h2>
        {bank.length > 0 ? (
          <ul className="chip-list">{bank.map(chip)}</ul>
        ) : (
          <p className="placeholder-box placeholder-box--small">{UI_TEXT.stage2BankEmpty}</p>
        )}
        <Button
          variant="ghost"
          className="btn--small"
          disabled={locked || !selectedIsPlaced}
          onClick={() => selected !== null && place(selected, null)}
        >
          {UI_TEXT.stage2ReturnToBank}
        </Button>
      </section>
    </StageFrame>
  )
}
