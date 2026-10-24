import { STAGE4_HEADINGS } from '../../content/source'
import { STAGE4_EVIDENCE, STAGE4_ROLE_LABELS, STAGE4_VOTES } from '../../content/stage4'
import { UI_TEXT } from '../../content/uiText'
import { STAGE4_ROLE_IDS, canCompleteStage4 } from '../../game/scoring/stage4'
import { useGame } from '../../state/useGame'
import { Button } from '../common/Button'
import { OptionGroup } from '../common/OptionGroup'
import { StageFrame } from './StageFrame'

export function Stage4Frame() {
  const { state, dispatch } = useGame()
  const { roleId, opened, voteId } = state.stage4
  const locked = state.stageStatus[4] !== 'in_progress'
  const canSubmit = !locked && canCompleteStage4(roleId, voteId)

  return (
    <StageFrame
      stageId={4}
      footer={
        <>
          <p className="stage__note">{locked ? UI_TEXT.stage4Locked : UI_TEXT.stage4Hint}</p>
          <Button disabled={!canSubmit} onClick={() => dispatch({ type: 'SUBMIT_STAGE4' })}>
            {UI_TEXT.stageComplete}
          </Button>
        </>
      }
    >
      <p className="notice">{UI_TEXT.stage4HypotheticalNote}</p>

      <section className="card" aria-label={STAGE4_HEADINGS.roles}>
        <OptionGroup
          name="stage4-role"
          legend={STAGE4_HEADINGS.roles}
          disabled={locked}
          value={roleId}
          options={STAGE4_ROLE_IDS.map((id) => ({ id, label: STAGE4_ROLE_LABELS[id] }))}
          letterOf={(_, index) => String(index + 1)}
          onChange={(id) => dispatch({ type: 'SELECT_ROLE', roleId: id })}
        />
      </section>

      <section className="card" aria-label={STAGE4_HEADINGS.evidence}>
        <h2 className="card__title card__title--small">{STAGE4_HEADINGS.evidence}</h2>
        <ul className="grid grid--3 evidence-list">
          {STAGE4_EVIDENCE.map((card) => {
            const isOpen = opened.includes(card.id)
            return (
              <li key={card.id} className={`evidence ${isOpen ? 'is-open' : ''}`}>
                <h3 className="evidence__title">{card.title}</h3>
                {isOpen ? (
                  <p className="evidence__content">{card.content}</p>
                ) : (
                  <Button
                    variant="secondary"
                    className="btn--small"
                    disabled={locked}
                    aria-label={`Mở ${card.title}`}
                    onClick={() => dispatch({ type: 'OPEN_EVIDENCE', evidenceId: card.id })}
                  >
                    {UI_TEXT.stage4OpenCard}
                  </Button>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <section className="card" aria-label={STAGE4_HEADINGS.vote}>
        <OptionGroup
          name="stage4-vote"
          legend={STAGE4_HEADINGS.vote}
          disabled={locked}
          value={voteId}
          options={STAGE4_VOTES.map((vote) => ({ id: vote.id, label: `${vote.title}: ${vote.description}` }))}
          letterOf={(option) => option.id}
          onChange={(id) => dispatch({ type: 'SELECT_VOTE', voteId: id })}
        />
      </section>
    </StageFrame>
  )
}
