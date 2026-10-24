import { STEP_TITLES } from '../../content/stage5'
import { useGame } from '../../state/useGame'
import { AmbassadorFailure } from '../ambassador/AmbassadorFailure'
import { AmbassadorResult } from '../ambassador/AmbassadorResult'
import { AmbassadorStep1 } from '../ambassador/AmbassadorStep1'
import { AmbassadorStep2 } from '../ambassador/AmbassadorStep2'
import { StageFrame } from './StageFrame'

// Chặng 5: không tính điểm. Bốn bước: thông tin, mật mã và hành động bảo tồn, xem trước thẻ, xuất thẻ (B21).
export function Stage5Frame({ onRestart }: { onRestart: () => void }) {
  const { state } = useGame()
  const { step, outcome } = state.ambassador

  return (
    <StageFrame stageId={5} footer={null}>
      <ol className="steps" aria-label="4 bước tạo thẻ">
        {STEP_TITLES.map((title, index) => {
          const number = index + 1
          const status = number < step ? 'is-done' : number === step ? 'is-current' : ''
          return (
            <li key={title} className={`steps__item ${status}`} aria-current={number === step ? 'step' : undefined}>
              <span className="steps__number">{number}</span>
              <span className="steps__label">{title}</span>
            </li>
          )
        })}
      </ol>

      {outcome === 'failed' ? (
        <AmbassadorFailure onRestart={onRestart} />
      ) : outcome === 'success' ? (
        <AmbassadorResult onRestart={onRestart} />
      ) : step === 1 ? (
        <AmbassadorStep1 />
      ) : (
        <AmbassadorStep2 />
      )}
    </StageFrame>
  )
}
