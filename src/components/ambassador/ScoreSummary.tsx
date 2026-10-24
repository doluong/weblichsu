import { STAGES, getStage, type ScoredStageId } from '../../config/stages'
import { UI_TEXT } from '../../content/uiText'
import { getTotal } from '../../game/selectors'
import { formatPoints } from '../../game/scoring/points'
import { MAX_TOTAL_POINTS } from '../../game/scoring/total'
import { useGame } from '../../state/useGame'

// Điểm tổng kết các chặng (Chặng 1-4). Chặng 5 không tính điểm nên không xuất hiện ở đây.
export function ScoreSummary() {
  const { state } = useGame()
  const scored = STAGES.filter((stage) => stage.id <= 4)
  return (
    <section className="score-summary" aria-label={UI_TEXT.stage5ScoreTitle}>
      <h2 className="card__title card__title--small">{UI_TEXT.stage5ScoreTitle}</h2>
      <ul>
        {scored.map((stage) => {
          const score = state.scores[stage.id as ScoredStageId]
          return (
            <li key={stage.id}>
              <span>
                Chặng {stage.id}: {getStage(stage.id).shortTitle}
              </span>
              <span>
                {formatPoints(score ?? 0)}/{stage.maxPoints}
              </span>
            </li>
          )
        })}
        <li className="score-summary__total">
          <span>{UI_TEXT.stage5Total}</span>
          <span>
            {formatPoints(getTotal(state))}/{MAX_TOTAL_POINTS}
          </span>
        </li>
      </ul>
    </section>
  )
}
