import { useCallback, useState } from 'react'
import { ConfirmDialog } from './components/layout/ConfirmDialog'
import { DevStageNav } from './components/layout/DevStageNav'
import { Header } from './components/layout/Header'
import { InfoScreen } from './components/screens/InfoScreen'
import { IntroScreen } from './components/screens/IntroScreen'
import { StageScreen } from './components/screens/StageScreen'
import { useGame } from './state/useGame'

export default function App() {
  const { state, dispatch } = useGame()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const closeConfirm = useCallback(() => setConfirmOpen(false), [])
  const confirmRestart = useCallback(() => {
    dispatch({ type: 'RESET' })
    setConfirmOpen(false)
  }, [dispatch])

  return (
    <div className="app">
      <Header
        studentName={state.student.name}
        showRestart={state.screen !== 'intro'}
        onRestart={() => setConfirmOpen(true)}
      />
      <main className="app__main" id="main">
        {state.screen === 'intro' && <IntroScreen onStart={() => dispatch({ type: 'START' })} />}
        {state.screen === 'info' && (
          <InfoScreen
            initial={state.student}
            onSubmit={(student) => dispatch({ type: 'SUBMIT_INFO', student })}
            onBack={() => dispatch({ type: 'BACK_TO_INTRO' })}
          />
        )}
        {state.screen === 'stage' && (
          <StageScreen state={state} onSelectStage={(stage) => dispatch({ type: 'VIEW_STAGE', stage })} />
        )}
      </main>
      <footer className="site-footer">
        <p>Mật mã văn minh Đông Nam Á - trò chơi giáo dục. Tiến trình chỉ lưu trong bộ nhớ trình duyệt.</p>
      </footer>
      <ConfirmDialog open={confirmOpen} onConfirm={confirmRestart} onCancel={closeConfirm} />
      {import.meta.env.DEV && (
        <DevStageNav current={state.currentStage} onJump={(stage) => dispatch({ type: 'DEV_JUMP', stage })} />
      )}
    </div>
  )
}
