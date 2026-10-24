import { useState, type RefObject } from 'react'
import { UI_TEXT } from '../../content/uiText'
import { exportFileName } from '../../game/ambassador'
import { Button } from '../common/Button'
import { downloadDataUrl, renderCardPng } from './exportCard'

interface ExportButtonProps {
  cardRef: RefObject<HTMLDivElement | null>
  studentName: string
  // Gọi sau khi xuất thành công (để chuyển thanh bước sang "Xuất thẻ").
  onExported?: () => void
}

export function ExportButton({ cardRef, studentName, onExported }: ExportButtonProps) {
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  const onExport = async () => {
    const node = cardRef.current
    if (!node || busy) return
    setBusy(true)
    setFailed(false)
    try {
      const dataUrl = await renderCardPng(node)
      downloadDataUrl(dataUrl, exportFileName(studentName))
      onExported?.()
    } catch {
      setFailed(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="export">
      <Button onClick={onExport} disabled={busy} aria-busy={busy}>
        {busy ? UI_TEXT.stage5ExportBusy : UI_TEXT.stage5Export}
      </Button>
      <p className="field__hint">{UI_TEXT.stage5ExportHint}</p>
      {failed && (
        <p className="field__error" role="alert">
          {UI_TEXT.stage5ExportError}
        </p>
      )}
    </div>
  )
}
