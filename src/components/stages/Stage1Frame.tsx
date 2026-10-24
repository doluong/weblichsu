import { STAGE1_TILE_COLORS } from '../../config/stages'
import type { ImageKey } from '../../config/assets'
import { ImageSlot } from '../common/ImageSlot'
import { StageFrame } from './StageFrame'

const MYSTERIES: readonly { index: number; imageKey: ImageKey }[] = [
  { index: 1, imageKey: 'mysteryAngkorWat' },
  { index: 2, imageKey: 'mysteryBorobudur' },
]

export function Stage1Frame() {
  return (
    <StageFrame stageId={1}>
      <div className="grid grid--2">
        {MYSTERIES.map(({ index, imageKey }) => (
          <section key={index} className="card mystery" aria-label={`Bức ảnh bí ẩn ${index}`}>
            <h2 className="card__title card__title--small">Bức ảnh bí ẩn {index}</h2>
            <div className="mystery__stage">
              <ImageSlot imageKey={imageKey} alt={`Bức ảnh bí ẩn ${index}`} />
              <div className="mystery__tiles" aria-hidden="true">
                {STAGE1_TILE_COLORS.map((color, tile) => (
                  <span key={tile} className="mystery__tile" style={{ backgroundColor: color }}>
                    {tile + 1}
                  </span>
                ))}
              </div>
            </div>
            <div className="placeholder-box">Khu vực chọn đáp án (4 lựa chọn)</div>
          </section>
        ))}
      </div>
    </StageFrame>
  )
}
