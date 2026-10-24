import { STAGE5_CARD_SUBTITLE, STAGE5_CARD_TITLE, STAGE5_STEPS } from '../../content/source'
import { ImageSlot } from '../common/ImageSlot'
import { StageFrame } from './StageFrame'

export function Stage5Frame() {
  return (
    <StageFrame stageId={5}>
      <ol className="steps" aria-label="4 bước tạo thẻ">
        {STAGE5_STEPS.map((step, index) => (
          <li key={step} className={`steps__item ${index === 0 ? 'is-current' : ''}`}>
            <span className="steps__number">{index + 1}</span>
            <span className="steps__label">{step}</span>
          </li>
        ))}
      </ol>

      <section className="ambassador-card" aria-label="Khung thẻ Đại sứ">
        <p className="ambassador-card__title">{STAGE5_CARD_TITLE}</p>
        <p className="ambassador-card__subtitle">{STAGE5_CARD_SUBTITLE}</p>
        <div className="ambassador-card__body">
          <ImageSlot imageKey="portraitDefault" alt="Ảnh chân dung" className="ambassador-card__portrait" />
          <div className="placeholder-box">Họ tên, lớp, trường, mật mã, đóng góp bảo tồn và điểm số</div>
        </div>
      </section>
    </StageFrame>
  )
}
