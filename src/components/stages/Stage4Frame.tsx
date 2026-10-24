import {
  STAGE4_EVIDENCE_TITLES,
  STAGE4_HEADINGS,
  STAGE4_ROLES,
} from '../../content/source'
import { UI_TEXT } from '../../content/uiText'
import { StageFrame } from './StageFrame'

export function Stage4Frame() {
  return (
    <StageFrame stageId={4}>
      <p className="notice">{UI_TEXT.stage4HypotheticalNote}</p>

      <section className="card" aria-labelledby="s4-roles">
        <h2 id="s4-roles" className="card__title card__title--small">
          {STAGE4_HEADINGS.roles}
        </h2>
        <ul className="grid grid--4">
          {STAGE4_ROLES.map((role) => (
            <li key={role} className="tile-card">
              {role}
            </li>
          ))}
        </ul>
      </section>

      <section className="card" aria-labelledby="s4-evidence">
        <h2 id="s4-evidence" className="card__title card__title--small">
          {STAGE4_HEADINGS.evidence}
        </h2>
        <ul className="grid grid--3">
          {STAGE4_EVIDENCE_TITLES.map((title) => (
            <li key={title} className="tile-card tile-card--evidence">
              {title}
            </li>
          ))}
        </ul>
      </section>

      <section className="card" aria-labelledby="s4-vote">
        <h2 id="s4-vote" className="card__title card__title--small">
          {STAGE4_HEADINGS.vote}
        </h2>
        <div className="placeholder-box">Khu vực 3 dự thảo nghị quyết và bỏ phiếu cá nhân</div>
      </section>
    </StageFrame>
  )
}
