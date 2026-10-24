import { STAGES, type StageId } from '../../config/stages'

interface DevStageNavProps {
  current: StageId
  onJump: (stage: StageId) => void
}

// Chỉ render ở chế độ phát triển (npm run dev) để xem khung từng chặng. Không có trong bản build.
export function DevStageNav({ current, onJump }: DevStageNavProps) {
  return (
    <aside className="dev-nav" aria-label="Xem khung chặng (chế độ phát triển)">
      <p className="dev-nav__title">Xem khung (chỉ chế độ phát triển)</p>
      <div className="dev-nav__buttons">
        {STAGES.map((stage) => (
          <button
            key={stage.id}
            type="button"
            className={`dev-nav__btn ${stage.id === current ? 'is-current' : ''}`}
            onClick={() => onJump(stage.id)}
          >
            Chặng {stage.id}
          </button>
        ))}
      </div>
    </aside>
  )
}
