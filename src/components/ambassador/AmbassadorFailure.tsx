import { UI_TEXT } from '../../content/uiText'
import { getFailureMessage } from '../../game/ambassador'
import { useGame } from '../../state/useGame'
import { Button } from '../common/Button'
import { ScoreSummary } from './ScoreSummary'

// Sai mật mã: không tạo thẻ, hiển thị tổng điểm các chặng và lời động viên; chỉ có nút "Tái khởi động hành trình" (B25).
export function AmbassadorFailure({ onRestart }: { onRestart: () => void }) {
  const { state } = useGame()
  return (
    <div className="ambassador-result">
      <section className="card failure" aria-label={UI_TEXT.stage5FailureTitle}>
        <h2 className="card__title card__title--small">{UI_TEXT.stage5FailureTitle}</h2>
        <p className="failure__message">{getFailureMessage(state.student.name)}</p>
      </section>
      <ScoreSummary />
      <div className="form-actions">
        <Button onClick={onRestart}>{UI_TEXT.restartButton}</Button>
      </div>
    </div>
  )
}
