import { STAGE_IDS, type ScoredStageId, type StageId } from '../config/stages'
import type { GameAction, GameState, StageStatus } from './types'
import { isStudentInfoValid, normalizeStudentInfo } from './validation'

const EMPTY_STUDENT = { name: '', className: '', school: '' }

function lockedStatuses(): Record<StageId, StageStatus> {
  return { 1: 'locked', 2: 'locked', 3: 'locked', 4: 'locked', 5: 'locked' }
}

const NO_FRAGMENTS: Record<ScoredStageId, boolean> = { 1: false, 2: false, 3: false, 4: false }

// Trạng thái ban đầu. Mọi dữ liệu chỉ nằm trong bộ nhớ; tải lại trang là bắt đầu lại.
export function createInitialState(): GameState {
  return {
    screen: 'intro',
    student: { ...EMPTY_STUDENT },
    currentStage: 1,
    stageStatus: lockedStatuses(),
    fragments: { ...NO_FRAGMENTS },
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START':
      return state.screen === 'intro' ? { ...state, screen: 'info' } : state

    case 'BACK_TO_INTRO':
      return state.screen === 'info' ? { ...state, screen: 'intro' } : state

    case 'SUBMIT_INFO': {
      if (state.screen !== 'info' || !isStudentInfoValid(action.student)) return state
      return {
        ...state,
        screen: 'stage',
        student: normalizeStudentInfo(action.student),
        currentStage: 1,
        stageStatus: { ...lockedStatuses(), 1: 'in_progress' },
      }
    }

    case 'VIEW_STAGE': {
      if (state.screen !== 'stage' || state.stageStatus[action.stage] === 'locked') return state
      return { ...state, currentStage: action.stage }
    }

    // Chỉ dùng ở chế độ phát triển để xem khung từng chặng; không cộng điểm, không cấp mảnh.
    case 'DEV_JUMP': {
      const statuses = lockedStatuses()
      for (const id of STAGE_IDS) {
        statuses[id] = id < action.stage ? 'completed' : id === action.stage ? 'in_progress' : 'locked'
      }
      return { ...state, screen: 'stage', currentStage: action.stage, stageStatus: statuses }
    }

    case 'RESET':
      return createInitialState()

    default:
      return state
  }
}
