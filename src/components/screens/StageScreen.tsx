import type { ComponentType } from 'react'
import type { ScoredStageId, StageId } from '../../config/stages'
import type { GameState } from '../../game/types'
import { CipherFragments } from '../layout/CipherFragments'
import { ResultPanel } from '../layout/ResultPanel'
import { StageProgress } from '../layout/StageProgress'
import { Stage1Frame } from '../stages/Stage1Frame'
import { Stage2Frame } from '../stages/Stage2Frame'
import { Stage3Frame } from '../stages/Stage3Frame'
import { Stage4Frame } from '../stages/Stage4Frame'
import { Stage5Frame } from '../stages/Stage5Frame'

interface StageScreenProps {
  state: GameState
  onSelectStage: (stage: StageId) => void
}

const FRAMES: Record<StageId, ComponentType> = {
  1: Stage1Frame,
  2: Stage2Frame,
  3: Stage3Frame,
  4: Stage4Frame,
  5: Stage5Frame,
}

export function StageScreen({ state, onSelectStage }: StageScreenProps) {
  const Frame = FRAMES[state.currentStage]
  const stage = state.currentStage
  const showResult = stage <= 4 && state.stageStatus[stage] === 'completed'
  return (
    <div className="screen stage-screen">
      <div className="stage-screen__top">
        <StageProgress current={state.currentStage} status={state.stageStatus} onSelect={onSelectStage} />
        <CipherFragments fragments={state.fragments} />
      </div>
      <div key={state.currentStage} className="stage-screen__frame">
        {showResult && (
          <ResultPanel stage={stage as ScoredStageId} onContinue={() => onSelectStage((stage + 1) as StageId)} />
        )}
        <Frame />
      </div>
    </div>
  )
}
