import { useState, type DragEvent } from 'react'
import { ROOM1_ARTIFACTS, ROOM1_CABINETS } from '../../content/stage3'
import { UI_TEXT } from '../../content/uiText'
import { useGame } from '../../state/useGame'
import { Button } from '../common/Button'
import { ImageSlot } from '../common/ImageSlot'

const ARTIFACT_BY_ID = Object.fromEntries(ROOM1_ARTIFACTS.map((item) => [item.id, item]))

// Phòng 1: đặt 4 hiện vật vào 4 tủ. Hỗ trợ chọn hiện vật rồi chọn tủ (cảm ứng) và kéo thả (máy tính).
export function Room1({ locked }: { locked: boolean }) {
  const { state, dispatch } = useGame()
  const { room1, room1Order } = state.stage3
  const [selected, setSelected] = useState<string | null>(null)

  const pool = room1Order.filter((id) => room1[id] === null)
  const selectedIsPlaced = selected !== null && room1[selected] !== null

  const place = (itemId: string, cabinetId: string | null) => {
    dispatch({ type: 'PLACE_ARTIFACT', itemId, cabinetId })
    setSelected(null)
  }

  const onDragStart = (event: DragEvent, itemId: string) => {
    event.dataTransfer.setData('text/plain', itemId)
    event.dataTransfer.effectAllowed = 'move'
  }

  const onDrop = (event: DragEvent, cabinetId: string | null) => {
    event.preventDefault()
    if (locked) return
    const itemId = event.dataTransfer.getData('text/plain')
    if (itemId) place(itemId, cabinetId)
  }

  const artifactButton = (itemId: string) => {
    const item = ARTIFACT_BY_ID[itemId]
    return (
      <button
        type="button"
        className={`artifact ${selected === itemId ? 'is-selected' : ''}`}
        aria-pressed={selected === itemId}
        disabled={locked}
        draggable={!locked}
        onDragStart={(event) => onDragStart(event, itemId)}
        onClick={() => setSelected(selected === itemId ? null : itemId)}
      >
        <ImageSlot as="div" imageKey={item.imageKey} alt={item.description} />
      </button>
    )
  }

  return (
    <div className="room-body">
      {!locked && <p className="status-line">{UI_TEXT.stage3Room1Hint}</p>}
      <ul className="cabinets">
        {ROOM1_CABINETS.map((cabinet) => {
          const occupant = room1Order.find((id) => room1[id] === cabinet.id)
          return (
            <li
              key={cabinet.id}
              className="cabinet"
              onDragOver={(event) => !locked && event.preventDefault()}
              onDrop={(event) => onDrop(event, cabinet.id)}
            >
              <h3 className="cabinet__label">{cabinet.label}</h3>
              <div className="cabinet__slot">
                {occupant ? artifactButton(occupant) : <p className="dropzone dropzone--small">{UI_TEXT.stage3EmptyCabinet}</p>}
              </div>
              <Button
                variant="secondary"
                className="btn--small"
                disabled={locked || selected === null}
                aria-label={`Đặt hiện vật đã chọn vào tủ ${cabinet.label}`}
                onClick={() => selected !== null && place(selected, cabinet.id)}
              >
                {UI_TEXT.stage3PlaceHere}
              </Button>
            </li>
          )
        })}
      </ul>

      <section
        className="card bank"
        aria-label="Danh sách hiện vật"
        onDragOver={(event) => !locked && event.preventDefault()}
        onDrop={(event) => onDrop(event, null)}
      >
        <h3 className="card__title card__title--small">Danh sách hiện vật</h3>
        {pool.length > 0 ? (
          <ul className="artifacts">
            {pool.map((id) => (
              <li key={id}>{artifactButton(id)}</li>
            ))}
          </ul>
        ) : (
          <p className="placeholder-box placeholder-box--small">{UI_TEXT.stage3PoolEmpty}</p>
        )}
        <Button
          variant="ghost"
          className="btn--small"
          disabled={locked || !selectedIsPlaced}
          onClick={() => selected !== null && place(selected, null)}
        >
          {UI_TEXT.stage3ReturnArtifact}
        </Button>
      </section>
    </div>
  )
}
