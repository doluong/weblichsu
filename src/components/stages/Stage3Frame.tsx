import type { ImageKey } from '../../config/assets'
import { STAGE3_BUILDINGS, STAGE3_CABINETS, STAGE3_ROOMS } from '../../content/source'
import { ImageSlot } from '../common/ImageSlot'
import { StageFrame } from './StageFrame'

const ARTIFACTS: readonly ImageKey[] = [
  'artifactIndigenousBeliefs',
  'artifactShiva',
  'artifactBuddhistStupa',
  'artifactIslamicMosque',
]

const BUILDINGS: readonly ImageKey[] = [
  'architectureAngkorWat',
  'architectureBorobudur',
  'architectureAyutthaya',
  'architectureMySon',
]

export function Stage3Frame() {
  const [room1, room2, room3] = STAGE3_ROOMS
  return (
    <StageFrame stageId={3}>
      <section className="room card" aria-labelledby="room-1-title">
        <header className="room__header">
          <h2 id="room-1-title" className="card__title card__title--small">
            {room1.title}
          </h2>
          <span className="badge">{room1.points}</span>
        </header>
        <p className="room__intro">{room1.intro}</p>
        <ul className="cabinets">
          {STAGE3_CABINETS.map((name) => (
            <li key={name} className="cabinet">
              <span className="cabinet__label">{name}</span>
              <span className="dropzone dropzone--small">Tủ trưng bày</span>
            </li>
          ))}
        </ul>
        <ul className="artifacts">
          {ARTIFACTS.map((key, index) => (
            <li key={key}>
              <ImageSlot imageKey={key} alt={`Hiện vật ${index + 1}`} />
            </li>
          ))}
        </ul>
      </section>

      <section className="room card" aria-labelledby="room-2-title">
        <header className="room__header">
          <h2 id="room-2-title" className="card__title card__title--small">
            {room2.title}
          </h2>
          <span className="badge">{room2.points}</span>
        </header>
        <p className="room__intro">{room2.intro}</p>
        <div className="placeholder-box">Khu vực tư liệu và 4 chỗ trống cần điền</div>
      </section>

      <section className="room card" aria-labelledby="room-3-title">
        <header className="room__header">
          <h2 id="room-3-title" className="card__title card__title--small">
            {room3.title}
          </h2>
          <span className="badge">{room3.points}</span>
        </header>
        <p className="room__intro">{room3.intro}</p>
        <ul className="buildings">
          {BUILDINGS.map((key, index) => (
            <li key={key} className="building">
              <ImageSlot imageKey={key} alt={STAGE3_BUILDINGS[index]} />
              <p className="building__name">{STAGE3_BUILDINGS[index]}</p>
              <div className="placeholder-box placeholder-box--small">Câu hỏi trắc nghiệm</div>
            </li>
          ))}
        </ul>
      </section>
    </StageFrame>
  )
}
