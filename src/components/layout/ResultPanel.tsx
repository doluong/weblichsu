import { useEffect, useRef } from 'react'
import { getStage, type ScoredStageId } from '../../config/stages'
import { getBreakdown, getStageOutcome, getTotal } from '../../game/selectors'
import { formatPoints } from '../../game/scoring/points'
import { MAX_TOTAL_POINTS } from '../../game/scoring/total'
import { useGame } from '../../state/useGame'
import { Button } from '../common/Button'

interface ResultPanelProps {
  stage: ScoredStageId
  onContinue: () => void
}

// Kết quả sau mỗi chặng: điểm, thông báo và phần thưởng nguyên văn từ tài liệu, tổng điểm hiện tại.
export function ResultPanel({ stage, onContinue }: ResultPanelProps) {
  const { state } = useGame()
  const ref = useRef<HTMLElement>(null)
  const outcome = getStageOutcome(state, stage)
  const completed = outcome !== null

  useEffect(() => {
    if (!completed) return
    ref.current?.focus()
    ref.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
  }, [completed])

  if (!outcome) return null
  const breakdown = getBreakdown(state, stage)
  const nextStage = getStage((stage + 1) as 2 | 3 | 4 | 5)

  return (
    <section ref={ref} tabIndex={-1} className="result" aria-labelledby={`result-${stage}-title`}>
      <h2 id={`result-${stage}-title`} className="result__title">
        Kết quả Chặng {stage}
      </h2>
      <p className="result__score">
        Điểm số: <strong>{formatPoints(outcome.score)}</strong>/{outcome.maxPoints} điểm
      </p>
      {outcome.result && (
        <>
          <p className="result__message">{outcome.result.message}</p>
          {outcome.result.reward && <p className="result__reward">{outcome.result.reward}</p>}
        </>
      )}
      {breakdown.length > 0 && (
        <ul className="result__breakdown">
          {breakdown.map((line) => (
            <li key={line.label}>
              <span>{line.label}</span>
              <span>
                {formatPoints(line.score)}/{line.maxPoints}
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="result__total">
        Tổng điểm hiện tại: <strong>{formatPoints(getTotal(state))}</strong>/{MAX_TOTAL_POINTS}
      </p>
      <Button onClick={onContinue}>Tiếp tục Chặng {nextStage.id}</Button>
    </section>
  )
}
