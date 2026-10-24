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
  room3: Record<string, string | null>
}

export interface Stage4State {
  roleId: string | null
  opened: string[]
  voteId: string | null
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
