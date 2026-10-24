import type { CSSProperties } from 'react'
import { STAGE1_TILE_COLORS } from '../../config/stages'
import { STAGE1_IMAGES, STAGE1_OPTION_LABELS } from '../../content/stage1'
import { UI_TEXT } from '../../content/uiText'
import { countOpenedTiles, canSubmitStage1, STAGE1_TILE_COUNT } from '../../game/scoring/stage1'
import { useGame } from '../../state/useGame'
import { Button } from '../common/Button'
import { ImageSlot } from '../common/ImageSlot'
import { OptionGroup } from '../common/OptionGroup'
import { StageFrame } from './StageFrame'

export function Stage1Frame() {
  const { state, dispatch } = useGame()
  const { opened, selected, optionOrder } = state.stage1
  const locked = state.stageStatus[1] !== 'in_progress'
  const canSubmit = !locked && canSubmitStage1(opened, selected)

  return (
    <StageFrame
      stageId={1}
      footer={
        <>
          <p className="stage__note">
            {locked ? UI_TEXT.stage1Locked : UI_TEXT.stage1Hint}
          </p>
          <Button disabled={!canSubmit} onClick={() => dispatch({ type: 'SUBMIT_STAGE1' })}>
            {UI_TEXT.stageComplete}
          </Button>
        </>
      }
    >
      <div className="grid grid--2">
        {STAGE1_IMAGES.map((image, index) => {
          const imageIndex = index as 0 | 1
          const openedCount = countOpenedTiles(opened[index])
          return (
            <section key={image.id} className="card mystery" aria-label={image.alt}>
              <h2 className="card__title card__title--small">{image.alt}</h2>
              <div className="mystery__stage">
                <ImageSlot imageKey={image.imageKey} alt={image.alt} />
                <div className="mystery__tiles">
                  {STAGE1_TILE_COLORS.slice(0, STAGE1_TILE_COUNT).map((color, tile) => {
                    const isOpen = opened[index][tile]
                    return (
                      <button
                        key={tile}
                        type="button"
                        className={`mystery__tile ${isOpen ? 'is-open' : ''}`}
                        style={isOpen ? undefined : ({ backgroundColor: color, '--tile-color': color } as CSSProperties)}
                        disabled={locked || isOpen}
                        aria-label={isOpen ? `Ô ${tile + 1} đã mở` : `Mở ô ${tile + 1}`}
                        onClick={() => dispatch({ type: 'OPEN_TILE', image: imageIndex, tile })}
                      >
                        {isOpen ? '' : tile + 1}
                      </button>
                    )
                  })}
                </div>
              </div>
              <p className="mystery__count" aria-live="polite">
                Đã mở {openedCount}/{STAGE1_TILE_COUNT} ô
              </p>
              <OptionGroup
                name={`stage1-${image.id}`}
                legend="Chọn đáp án"
                disabled={locked}
                value={selected[index]}
                options={optionOrder[index].map((id) => ({ id, label: STAGE1_OPTION_LABELS[id] }))}
                onChange={(optionId) => dispatch({ type: 'SELECT_STAGE1_OPTION', image: imageIndex, optionId })}
              />
            </section>
          )
        })}
      </div>
    </StageFrame>
  )
}
