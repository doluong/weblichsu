import { useEffect, useRef } from 'react'
import { UI_TEXT } from '../../content/uiText'
import { Button } from '../common/Button'

interface ConfirmDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

// Hộp xác nhận trước khi xóa tiến trình đang chạy (khởi động lại).
export function ConfirmDialog({ open, onConfirm, onCancel }: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    cancelRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="dialog-backdrop" onClick={onCancel}>
      <div
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-body"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-title" className="dialog__title">
          {UI_TEXT.restartConfirmTitle}
        </h2>
        <p id="confirm-body" className="dialog__body">
          {UI_TEXT.restartConfirmBody}
        </p>
        <div className="dialog__actions">
          <Button ref={cancelRef} variant="ghost" onClick={onCancel}>
            {UI_TEXT.restartConfirmNo}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {UI_TEXT.restartConfirmYes}
          </Button>
        </div>
      </div>
    </div>
  )
}
