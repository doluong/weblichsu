import type { ScoredStageId, StageId } from '../config/stages'
import type { PeriodId } from '../content/stage2'
import type { Shuffles } from './shuffle'
import type { HalfPoints } from './scoring/points'

export type { PeriodId }

export type Screen = 'intro' | 'info' | 'stage'

export type StageStatus = 'locked' | 'in_progress' | 'completed'

export interface StudentInfo {
  name: string
  className: string
  school: string
}

export interface Stage1State {
  // Ô đã mở của từng ảnh (4 ô mỗi ảnh); ô đã mở không thể đóng lại.
  opened: [boolean[], boolean[]]
  selected: [string | null, string | null]
  // Thứ tự lựa chọn đã xáo của từng ảnh, tạo một lần khi vào chặng.
  optionOrder: [string[], string[]]
}

export interface Stage2State {
  placements: Record<string, PeriodId | null>
  cardOrder: string[]
}

export type RoomId = 1 | 2 | 3

export interface Stage3State {
  room: RoomId
  roomDone: [boolean, boolean, boolean]
  room1: Record<string, string | null>
  room1Order: string[]
  room2: Record<string, string | null>
  // Thứ tự hiển thị lựa chọn đã xáo của từng chỗ trống / câu hỏi (theo mã lựa chọn).
  room2Order: Record<string, string[]>
  room3: Record<string, string | null>
  room3Order: Record<string, string[]>
}

export interface Stage4State {
  roleId: string | null
  opened: string[]
  voteId: string | null
}

export type AmbassadorStep = 1 | 2 | 3 | 4
export type AmbassadorOutcome = 'success' | 'failed'

// Chặng 5 không tính điểm. Mọi dữ liệu chỉ nằm trong bộ nhớ; ảnh chân dung là object URL của phiên hiện tại.
export interface AmbassadorState {
  step: AmbassadorStep
  code: string
  action: string
  avatarUrl: string | null
  // null: chưa kiểm tra mật mã; 'failed': sai mật mã, không tạo thẻ (chỉ có thể tái khởi động).
  outcome: AmbassadorOutcome | null
  // Ngày cấp (dd/mm/yyyy) tại thời điểm tạo thẻ.
  issuedAt: string | null
}

export interface GameState {
  screen: Screen
  student: StudentInfo
  currentStage: StageId
  stageStatus: Record<StageId, StageStatus>
  stage1: Stage1State
  stage2: Stage2State
  stage3: Stage3State
  stage4: Stage4State
  ambassador: AmbassadorState
  // Điểm từng chặng (nửa điểm); null khi chặng chưa hoàn thành. Chặng 5 không có điểm.
  scores: Record<ScoredStageId, HalfPoints | null>
  // Mảnh mật mã đã nhận theo chặng; chặng chưa nhận là ô trống.
  fragments: Record<ScoredStageId, boolean>
}

export type GameAction =
  | { type: 'START' }
  | { type: 'BACK_TO_INTRO' }
  | { type: 'SUBMIT_INFO'; student: StudentInfo; shuffles?: Shuffles }
  | { type: 'VIEW_STAGE'; stage: StageId }
  | { type: 'DEV_JUMP'; stage: StageId }
  | { type: 'RESET' }
  | { type: 'OPEN_TILE'; image: 0 | 1; tile: number }
  | { type: 'SELECT_STAGE1_OPTION'; image: 0 | 1; optionId: string }
  | { type: 'SUBMIT_STAGE1' }
  | { type: 'PLACE_CARD'; cardId: string; period: PeriodId | null }
  | { type: 'SUBMIT_STAGE2' }
  | { type: 'PLACE_ARTIFACT'; itemId: string; cabinetId: string | null }
  | { type: 'ANSWER_ROOM2'; blankId: string; optionId: string }
  | { type: 'ANSWER_ROOM3'; questionId: string; optionId: string }
  | { type: 'COMPLETE_ROOM'; room: RoomId }
  | { type: 'SELECT_ROLE'; roleId: string }
  | { type: 'OPEN_EVIDENCE'; evidenceId: string }
  | { type: 'SELECT_VOTE'; voteId: string }
  | { type: 'SUBMIT_STAGE4' }
  | { type: 'UPDATE_STUDENT'; student: StudentInfo }
  | { type: 'SET_CODE'; code: string }
  | { type: 'SET_ACTION'; action: string }
  | { type: 'SET_AVATAR'; avatarUrl: string | null }
  | { type: 'AMBASSADOR_STEP'; step: 1 | 2 }
  | { type: 'SUBMIT_AMBASSADOR'; issuedAt: string }
  | { type: 'AMBASSADOR_TO_EXPORT' }
