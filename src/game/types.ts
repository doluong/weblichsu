import type { ScoredStageId, StageId } from '../config/stages'

export type Screen = 'intro' | 'info' | 'stage'

export type StageStatus = 'locked' | 'in_progress' | 'completed'

export interface StudentInfo {
  name: string
  className: string
  school: string
}

export interface GameState {
  screen: Screen
  student: StudentInfo
  currentStage: StageId
  stageStatus: Record<StageId, StageStatus>
  // Mảnh mật mã đã nhận theo chặng; chặng chưa nhận là ô trống.
  fragments: Record<ScoredStageId, boolean>
}

export type GameAction =
  | { type: 'START' }
  | { type: 'BACK_TO_INTRO' }
  | { type: 'SUBMIT_INFO'; student: StudentInfo }
  | { type: 'VIEW_STAGE'; stage: StageId }
  | { type: 'DEV_JUMP'; stage: StageId }
  | { type: 'RESET' }
