import { useRef } from 'react'
import { SUCCESS_BANNER } from '../../content/stage5'
import { UI_TEXT } from '../../content/uiText'
import { getTotal } from '../../game/selectors'
import { useGame } from '../../state/useGame'
import { Button } from '../common/Button'
import { AmbassadorCard } from './AmbassadorCard'
import { ScaledCard } from './ScaledCard'
import { ExportButton } from './ExportButton'
import { ScoreSummary } from './ScoreSummary'

interface AmbassadorResultProps {
  onRestart: () => void
}

// Bước 3: xem trước (điểm các chặng, lời chúc, thẻ). Bước 4: xuất thẻ và tái khởi động.
export function AmbassadorResult({ onRestart }: AmbassadorResultProps) {
  const { state, dispatch } = useGame()
  const { action, avatarUrl, issuedAt } = state.ambassador
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <div className="ambassador-result">
      <p className="notice notice--success" role="status">
        {SUCCESS_BANNER}
      </p>
      <ScoreSummary />
      <section className="card" aria-label={UI_TEXT.stage5PreviewTitle}>
        <h2 className="card__title card__title--small">{UI_TEXT.stage5PreviewTitle}</h2>
        <ScaledCard>
          <AmbassadorCard
            cardRef={cardRef}
            student={state.student}
            total={getTotal(state)}
            action={action}
            avatarUrl={avatarUrl}
            issuedAt={issuedAt ?? ''}
          />
        </ScaledCard>
        <div className="form-actions">
          <Button variant="ghost" onClick={onRestart}>
            {UI_TEXT.restartButton}
          </Button>
          <ExportButton
            cardRef={cardRef}
            studentName={state.student.name}
            onExported={() => dispatch({ type: 'AMBASSADOR_TO_EXPORT' })}
          />
        </div>
      </section>
    </div>
  )
}
