import { useState } from 'react'
import { STAGE3_ROOMS } from '../../content/source'
import { ROOM1_ARTIFACTS, ROOM2_BLANKS, ROOM3_QUESTIONS } from '../../content/stage3'
import { UI_TEXT } from '../../content/uiText'
import type { RoomId } from '../../game/types'
import { useGame } from '../../state/useGame'
import { Button } from '../common/Button'
import { Room1 } from './Room1'
import { Room2 } from './Room2'
import { Room3 } from './Room3'
import { StageFrame } from './StageFrame'

const INCOMPLETE_HINT: Record<RoomId, string> = {
  1: UI_TEXT.stage3Room1Incomplete,
  2: UI_TEXT.stage3Room2Incomplete,
  3: UI_TEXT.stage3Room3Incomplete,
}

export function Stage3Frame() {
  const { state, dispatch } = useGame()
  const s3 = state.stage3
  // Người chơi có thể xem lại phòng đã hoàn thành; khi phòng hiện tại thay đổi thì quay về phòng hiện tại.
  const [picked, setPicked] = useState<{ room: RoomId; base: RoomId } | null>(null)
  const viewRoom: RoomId = picked && picked.base === s3.room ? picked.room : s3.room

  const done = s3.roomDone[viewRoom - 1]
  const isCurrent = viewRoom === s3.room && state.stageStatus[3] === 'in_progress'
  const complete =
    viewRoom === 1
      ? ROOM1_ARTIFACTS.every((item) => s3.room1[item.id] !== null)
      : viewRoom === 2
        ? ROOM2_BLANKS.every((blank) => s3.room2[blank.id] !== null)
        : ROOM3_QUESTIONS.every((question) => s3.room3[question.id] !== null)
  const room = STAGE3_ROOMS[viewRoom - 1]

  return (
    <StageFrame
      stageId={3}
      footer={
        <>
          <p className="stage__note">
            {done ? UI_TEXT.stage3RoomLocked : complete ? '' : INCOMPLETE_HINT[viewRoom]}
          </p>
          <Button
            disabled={!isCurrent || done || !complete}
            onClick={() => dispatch({ type: 'COMPLETE_ROOM', room: viewRoom })}
          >
            {UI_TEXT.stage3RoomComplete} {viewRoom}
          </Button>
        </>
      }
    >
      <nav className="room-nav" aria-label="Các phòng trưng bày">
        {STAGE3_ROOMS.map((item) => {
          const id = item.id as RoomId
          const status = s3.roomDone[id - 1] ? 'Đã hoàn thành' : id === s3.room ? 'Đang thực hiện' : 'Chưa mở'
          return (
            <button
              key={id}
              type="button"
              className={`room-nav__btn ${id === viewRoom ? 'is-current' : ''}`}
              aria-current={id === viewRoom ? 'step' : undefined}
              disabled={id > s3.room}
              onClick={() => setPicked({ room: id, base: s3.room })}
            >
              <span>Phòng {id}</span>
              <span className="room-nav__status">{status}</span>
            </button>
          )
        })}
      </nav>

      <section className="room card" aria-labelledby={`room-${viewRoom}-title`}>
        <header className="room__header">
          <h2 id={`room-${viewRoom}-title`} className="card__title card__title--small">
            {room.title}
          </h2>
          <span className="badge">{room.points}</span>
        </header>
        <p className="room__intro">{room.intro}</p>
        {viewRoom === 1 && <Room1 locked={!isCurrent || done} />}
        {viewRoom === 2 && <Room2 locked={!isCurrent || done} />}
        {viewRoom === 3 && <Room3 locked={!isCurrent || done} />}
      </section>
    </StageFrame>
  )
}
