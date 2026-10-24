import { UI_TEXT } from '../../content/uiText'
import { BRAND_TITLE } from '../../content/source'
import { Button } from '../common/Button'

interface HeaderProps {
  studentName: string
  showRestart: boolean
  onRestart: () => void
}

export function Header({ studentName, showRestart, onRestart }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__brand">
          <span className="site-header__mark" aria-hidden="true" />
          <p className="site-header__title">{BRAND_TITLE}</p>
        </div>
        <div className="site-header__actions">
          {studentName !== '' && <p className="site-header__student">{studentName}</p>}
          {showRestart && (
            <Button variant="ghost" className="btn--small" onClick={onRestart}>
              {UI_TEXT.restartButton}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
