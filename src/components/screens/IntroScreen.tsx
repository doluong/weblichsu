import { STAGES, formatMaxPoints } from '../../config/stages'
import { BRAND_TITLE, INTRO_TEXT } from '../../content/source'
import { UI_TEXT } from '../../content/uiText'
import { Button } from '../common/Button'

interface IntroScreenProps {
  onStart: () => void
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="screen intro">
      <section className="hero">
        <p className="hero__eyebrow">Hành trình khám phá</p>
        <h1 className="hero__title">{BRAND_TITLE}</h1>
        <blockquote className="hero__lead">
          <p>{`“${INTRO_TEXT}”`}</p>
        </blockquote>
        <Button className="btn--large" onClick={onStart}>
          {UI_TEXT.introStart}
        </Button>
      </section>

      <section className="journey" aria-labelledby="journey-title">
        <h2 id="journey-title" className="section-title">
          Hành trình 5 chặng
        </h2>
        <ol className="journey__grid">
          {STAGES.map((stage) => (
            <li key={stage.id} className="journey__card">
              <span className="journey__number">{stage.id}</span>
              <h3 className="journey__name">{stage.shortTitle}</h3>
              <p className="journey__points">{formatMaxPoints(stage)}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
