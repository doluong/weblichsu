import { STAGE2_PERIODS } from '../../content/source'
import { StageFrame } from './StageFrame'

export function Stage2Frame() {
  return (
    <StageFrame stageId={2}>
      <section className="timeline" aria-label="Trục thời gian Đông Nam Á">
        <h2 className="section-title section-title--small">Trục thời gian Đông Nam Á</h2>
        <ol className="timeline__zones">
          {STAGE2_PERIODS.map((period) => (
            <li key={period} className="timeline__zone">
              <h3 className="timeline__period">{period}</h3>
              <div className="dropzone">Trạm thả thẻ</div>
            </li>
          ))}
        </ol>
      </section>
      <section className="card" aria-label="Ngân hàng thẻ">
        <h2 className="card__title card__title--small">Ngân hàng thẻ</h2>
        <div className="placeholder-box">Khu vực 15 thẻ (đã xáo trộn) sẽ hiển thị ở đây</div>
      </section>
    </StageFrame>
  )
}
