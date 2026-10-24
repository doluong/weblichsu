import { STAGE_IDS, type ScoredStageId, type StageId } from '../config/stages'
import { STAGE1_IMAGES, STAGE1_OPTIONS } from '../content/stage1'
import { STAGE2_CARDS, STAGE2_CORRECT, STAGE2_PERIODS } from '../content/stage2'
import { ROOM1_ARTIFACTS, ROOM1_CABINETS, ROOM2_BLANKS, ROOM3_QUESTIONS, STAGE3_KEYS } from '../content/stage3'
import { countOpenedTiles, canSubmitStage1, scoreStage1, stage1AwardsFragment, stage1Tier } from './scoring/stage1'
import { scoreStage2, stage2AwardsFragment, stage2Tier } from './scoring/stage2'
import { scoreStage3, stage3AwardsFragment, stage3Tier } from './scoring/stage3'
import {
  STAGE4_EVIDENCE_IDS,
  STAGE4_ROLE_IDS,
  STAGE4_VOTE_IDS,
  canCompleteStage4,
  scoreStage4,
} from './scoring/stage4'
import type { HalfPoints } from './scoring/points'
import { defaultShuffles, type Shuffles } from './shuffle'
import type { GameAction, GameState, RoomId, StageStatus } from './types'
import { isStudentInfoValid, normalizeStudentInfo } from './validation'

const EMPTY_STUDENT = { name: '', className: '', school: '' }

function lockedStatuses(): Record<StageId, StageStatus> {
  return { 1: 'locked', 2: 'locked', 3: 'locked', 4: 'locked', 5: 'locked' }
}

function nullMap(ids: readonly string[]): Record<string, null> {
  return Object.fromEntries(ids.map((id) => [id, null]))
}

function copyOrders(orders: Readonly<Record<string, readonly string[]>>): Record<string, string[]> {
  return Object.fromEntries(Object.entries(orders).map(([key, ids]) => [key, [...ids]]))
}

// Trạng thái ban đầu. Mọi dữ liệu chỉ nằm trong bộ nhớ; tải lại trang là bắt đầu lại.
export function createInitialState(shuffles: Shuffles = defaultShuffles()): GameState {
  return {
    screen: 'intro',
    student: { ...EMPTY_STUDENT },
    currentStage: 1,
    stageStatus: lockedStatuses(),
    stage1: {
      opened: [
        [false, false, false, false],
        [false, false, false, false],
      ],
      selected: [null, null],
      optionOrder: [[...shuffles.stage1Options[0]], [...shuffles.stage1Options[1]]],
    },
    stage2: {
      placements: nullMap(STAGE2_CARDS.map((card) => card.id)),
      cardOrder: [...shuffles.stage2Cards],
    },
    stage3: {
      room: 1,
      roomDone: [false, false, false],
      room1: nullMap(ROOM1_ARTIFACTS.map((item) => item.id)),
      room1Order: [...shuffles.stage3Artifacts],
      room2: nullMap(ROOM2_BLANKS.map((blank) => blank.id)),
      room2Order: copyOrders(shuffles.room2Options),
      room3: nullMap(ROOM3_QUESTIONS.map((question) => question.id)),
      room3Order: copyOrders(shuffles.room3Options),
    },
    stage4: { roleId: null, opened: [], voteId: null },
    scores: { 1: null, 2: null, 3: null, 4: null },
    fragments: { 1: false, 2: false, 3: false, 4: false },
  }
}

// Chỉ nhận thao tác khi chặng đang chơi; chặng đã hoàn thành bị khóa nên không thể đổi đáp án hoặc cộng điểm lần nữa.
function isOpen(state: GameState, stage: StageId): boolean {
  return state.screen === 'stage' && state.stageStatus[stage] === 'in_progress'
}

function completeStage(
  state: GameState,
  stage: ScoredStageId,
  score: HalfPoints,
  awardsFragment: boolean,
): GameState {
  const stageStatus: Record<StageId, StageStatus> = { ...state.stageStatus, [stage]: 'completed' }
  const next = (stage + 1) as StageId
  if (stageStatus[next] === 'locked') stageStatus[next] = 'in_progress'
  return {
    ...state,
    stageStatus,
    scores: { ...state.scores, [stage]: score },
    fragments: { ...state.fragments, [stage]: awardsFragment },
  }
}

// Mỗi tủ nhận đúng một hiện vật; đặt vào tủ đã có thì hoán đổi (hiện vật cũ sang tủ của hiện vật mới, hoặc về danh sách).
export function placeArtifact(
  placements: Readonly<Record<string, string | null>>,
  itemId: string,
  cabinetId: string | null,
): Record<string, string | null> {
  const next = { ...placements }
  if (cabinetId === null) {
    next[itemId] = null
    return next
  }
  const current = placements[itemId] ?? null
  if (current === cabinetId) return next
  const occupant = Object.keys(placements).find((id) => id !== itemId && placements[id] === cabinetId)
  if (occupant) next[occupant] = current
  next[itemId] = cabinetId
  return next
}

function isRoomComplete(state: GameState, room: RoomId): boolean {
  const { room1, room2, room3 } = state.stage3
  if (room === 1) return ROOM1_ARTIFACTS.every((item) => room1[item.id] != null)
  if (room === 2) return ROOM2_BLANKS.every((blank) => room2[blank.id] != null)
  return ROOM3_QUESTIONS.every((question) => room3[question.id] != null)
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
        ...createInitialState(action.shuffles),
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

    // ---------- Chặng 1 ----------
    case 'OPEN_TILE': {
      if (!isOpen(state, 1) || !Number.isInteger(action.tile) || action.tile < 0 || action.tile > 3) return state
      const opened: [boolean[], boolean[]] = [[...state.stage1.opened[0]], [...state.stage1.opened[1]]]
      opened[action.image][action.tile] = true
      return { ...state, stage1: { ...state.stage1, opened } }
    }

    case 'SELECT_STAGE1_OPTION': {
      if (!isOpen(state, 1) || !STAGE1_OPTIONS.some((option) => option.id === action.optionId)) return state
      const selected: [string | null, string | null] = [...state.stage1.selected]
      selected[action.image] = action.optionId
      return { ...state, stage1: { ...state.stage1, selected } }
    }

    case 'SUBMIT_STAGE1': {
      const { opened, selected } = state.stage1
      if (!isOpen(state, 1) || !canSubmitStage1(opened, selected)) return state
      const { total } = scoreStage1(
        STAGE1_IMAGES.map((image, index) => ({
          openedTiles: countOpenedTiles(opened[index]),
          selectedOptionId: selected[index],
          correctOptionId: image.correctOptionId,
        })),
      )
      return completeStage(state, 1, total, stage1AwardsFragment(stage1Tier(total)))
    }

    // ---------- Chặng 2 ----------
    case 'PLACE_CARD': {
      const validCard = STAGE2_CARDS.some((card) => card.id === action.cardId)
      const validPeriod = action.period === null || STAGE2_PERIODS.some((period) => period.id === action.period)
      if (!isOpen(state, 2) || !validCard || !validPeriod) return state
      return {
        ...state,
        stage2: { ...state.stage2, placements: { ...state.stage2.placements, [action.cardId]: action.period } },
      }
    }

    case 'SUBMIT_STAGE2': {
      if (!isOpen(state, 2)) return state
      const total = scoreStage2(state.stage2.placements, STAGE2_CORRECT)
      return completeStage(state, 2, total, stage2AwardsFragment(stage2Tier(total)))
    }

    // ---------- Chặng 3 ----------
    case 'PLACE_ARTIFACT': {
      const s3 = state.stage3
      const validItem = ROOM1_ARTIFACTS.some((item) => item.id === action.itemId)
      const validCabinet = action.cabinetId === null || ROOM1_CABINETS.some((c) => c.id === action.cabinetId)
      if (!isOpen(state, 3) || s3.room !== 1 || s3.roomDone[0] || !validItem || !validCabinet) return state
      return {
        ...state,
        stage3: { ...s3, room1: placeArtifact(s3.room1, action.itemId, action.cabinetId) },
      }
    }

    case 'ANSWER_ROOM2': {
      const s3 = state.stage3
      const blank = ROOM2_BLANKS.find((item) => item.id === action.blankId)
      if (!isOpen(state, 3) || s3.room !== 2 || s3.roomDone[1] || !blank) return state
      if (!blank.options.some((option) => option.id === action.optionId)) return state
      return { ...state, stage3: { ...s3, room2: { ...s3.room2, [action.blankId]: action.optionId } } }
    }

    case 'ANSWER_ROOM3': {
      const s3 = state.stage3
      const question = ROOM3_QUESTIONS.find((item) => item.id === action.questionId)
      if (!isOpen(state, 3) || s3.room !== 3 || s3.roomDone[2] || !question) return state
      if (!question.options.some((option) => option.id === action.optionId)) return state
      return { ...state, stage3: { ...s3, room3: { ...s3.room3, [action.questionId]: action.optionId } } }
    }

    case 'COMPLETE_ROOM': {
      const s3 = state.stage3
      if (!isOpen(state, 3) || action.room !== s3.room || s3.roomDone[action.room - 1]) return state
      if (!isRoomComplete(state, action.room)) return state
      const roomDone: [boolean, boolean, boolean] = [...s3.roomDone]
      roomDone[action.room - 1] = true
      if (action.room < 3) {
        return { ...state, stage3: { ...s3, roomDone, room: (action.room + 1) as RoomId } }
      }
      const { total } = scoreStage3({ room1: s3.room1, room2: s3.room2, room3: s3.room3 }, STAGE3_KEYS)
      return completeStage({ ...state, stage3: { ...s3, roomDone } }, 3, total, stage3AwardsFragment(stage3Tier(total)))
    }

    // ---------- Chặng 4 ----------
    case 'SELECT_ROLE': {
      if (!isOpen(state, 4) || !(STAGE4_ROLE_IDS as readonly string[]).includes(action.roleId)) return state
      return { ...state, stage4: { ...state.stage4, roleId: action.roleId } }
    }

    case 'OPEN_EVIDENCE': {
      const valid = (STAGE4_EVIDENCE_IDS as readonly string[]).includes(action.evidenceId)
      if (!isOpen(state, 4) || !valid || state.stage4.opened.includes(action.evidenceId)) return state
      return { ...state, stage4: { ...state.stage4, opened: [...state.stage4.opened, action.evidenceId] } }
    }

    case 'SELECT_VOTE': {
      if (!isOpen(state, 4) || !(STAGE4_VOTE_IDS as readonly string[]).includes(action.voteId)) return state
      return { ...state, stage4: { ...state.stage4, voteId: action.voteId } }
    }

    case 'SUBMIT_STAGE4': {
      const { roleId, opened, voteId } = state.stage4
      if (!isOpen(state, 4) || !canCompleteStage4(roleId, voteId)) return state
      const { total } = scoreStage4({ roleId, openedEvidenceIds: opened, voteId })
      return completeStage(state, 4, total, true)
    }

    default:
      return state
  }
}
