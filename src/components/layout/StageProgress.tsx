import { STAGES, type StageId } from '../../config/stages'
import type { StageStatus } from '../../game/types'

interface StageProgressProps {
  current: StageId
  status: Record<StageId, StageStatus>
  onSelect: (stage: StageId) => void
}

const STATUS_LABEL: Record<StageStatus, string> = {
  locked: 'Chưa mở',
  in_progress: 'Đang thực hiện',
  completed: 'Đã hoàn thành',
}

export function StageProgress({ current, status, onSelect }: StageProgressProps) {
  return (
    <nav className="progress" aria-label="Tiến trình 5 chặng">
      <ol className="progress__list">
        {STAGES.map((stage) => {
          const stageStatus = status[stage.id]
          const isCurrent = stage.id === current
          return (
            <li key={stage.id} className="progress__item">
              <button
                type="button"
                className={`progress__step progress__step--${stageStatus} ${isCurrent ? 'is-current' : ''}`}
                disabled={stageStatus === 'locked'}
                aria-current={isCurrent ? 'step' : undefined}
                onClick={() => onSelect(stage.id)}
              >
                <span className="progress__number">{stage.id}</span>
                <span className="progress__text">
                  <span className="progress__name">{stage.shortTitle}</span>
                  <span className="progress__status">{STATUS_LABEL[stageStatus]}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
