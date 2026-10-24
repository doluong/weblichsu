import type { ReactNode } from 'react'
import { formatMaxPoints, getStage, type StageId } from '../../config/stages'
import { STAGE_INTROS } from '../../content/source'
import { UI_TEXT } from '../../content/uiText'
import { Button } from '../common/Button'

interface StageFrameProps {
  stageId: StageId
  children: ReactNode
  // Nếu không truyền, hiển thị chân trang của khung giao diện chưa triển khai.
  footer?: ReactNode
}

// Khung chung cho mỗi chặng: tiêu đề, lời dẫn nguyên văn, vùng nội dung và chân trang.
export function StageFrame({ stageId, children, footer }: StageFrameProps) {
  const stage = getStage(stageId)
  return (
    <article className="stage" aria-labelledby={`stage-${stageId}-title`}>
      <header className="stage__header">
        <p className="stage__eyebrow">Chặng {stage.id}</p>
        <h1 id={`stage-${stageId}-title`} className="stage__title">
          {stage.title}
        </h1>
        <p className="stage__points">{formatMaxPoints(stage)}</p>
      </header>
      <p className="stage__intro">{STAGE_INTROS[stageId]}</p>
      <div className="stage__body">{children}</div>
      <footer className="stage__footer">
        {footer ?? (
          <>
            <p className="stage__note">{UI_TEXT.stageSkeletonNote}</p>
            {stageId !== 5 && (
              <Button disabled aria-disabled="true">
                {UI_TEXT.stageCompleteDisabled}
              </Button>
            )}
          </>
        )}
      </footer>
    </article>
  )
}
