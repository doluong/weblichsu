import { STAGE1_IMAGES } from '../content/stage1'
import { STAGE2_CARDS } from '../content/stage2'
import { ROOM1_ARTIFACTS, ROOM2_BLANKS, ROOM3_QUESTIONS } from '../content/stage3'
import { createInitialState, gameReducer } from '../game/reducer'
import type { GameAction, GameState } from '../game/types'

export const student = { name: 'Nguyễn Văn A', className: '12A1', school: 'THPT Chuyên' }

export function run(state: GameState, ...actions: GameAction[]): GameState {
  return actions.reduce(gameReducer, state)
}

export function playing(): GameState {
  return run(createInitialState(), { type: 'START' }, { type: 'SUBMIT_INFO', student })
}

// Chuỗi thao tác chơi trọn vẹn Chặng 1-4. perfect = đúng hết (100 điểm); ngược lại trả lời sai hết Chặng 1-3.
export function fullPlayActions(perfect: boolean): GameAction[] {
  const wrong = (id: string) => (id === 'A' ? 'C' : 'A')
  const actions: GameAction[] = []
  STAGE1_IMAGES.forEach((image, index) => {
    actions.push({ type: 'OPEN_TILE', image: index as 0 | 1, tile: 0 })
    actions.push({
      type: 'SELECT_STAGE1_OPTION',
      image: index as 0 | 1,
      optionId: perfect ? image.correctOptionId : 'shwedagon',
    })
  })
  actions.push({ type: 'SUBMIT_STAGE1' })
  for (const card of STAGE2_CARDS) {
    actions.push({ type: 'PLACE_CARD', cardId: card.id, period: perfect ? card.period : card.period === 'p1' ? 'p2' : 'p1' })
  }
  actions.push({ type: 'SUBMIT_STAGE2' })
  ROOM1_ARTIFACTS.forEach((item, index) => {
    actions.push({
      type: 'PLACE_ARTIFACT',
      itemId: item.id,
      cabinetId: perfect ? item.correctCabinetId : ROOM1_ARTIFACTS[(index + 1) % 4].correctCabinetId,
    })
  })
  actions.push({ type: 'COMPLETE_ROOM', room: 1 })
  for (const blank of ROOM2_BLANKS) {
    actions.push({
      type: 'ANSWER_ROOM2',
      blankId: blank.id,
      optionId: perfect ? blank.correctOptionId : wrong(blank.correctOptionId),
    })
  }
  actions.push({ type: 'COMPLETE_ROOM', room: 2 })
  for (const question of ROOM3_QUESTIONS) {
    actions.push({
      type: 'ANSWER_ROOM3',
      questionId: question.id,
      optionId: perfect ? question.correctOptionId : wrong(question.correctOptionId),
    })
  }
  actions.push({ type: 'COMPLETE_ROOM', room: 3 })
  actions.push({ type: 'SELECT_ROLE', roleId: 'historian' })
  if (perfect) {
    for (const evidenceId of ['technical', 'economy', 'community']) actions.push({ type: 'OPEN_EVIDENCE', evidenceId })
  }
  actions.push({ type: 'SELECT_VOTE', voteId: perfect ? 'C' : 'B' })
  actions.push({ type: 'SUBMIT_STAGE4' })
  return actions
}

// Trạng thái đã hoàn thành Chặng 1-4, sẵn sàng làm Chặng 5.
export function atStage5(perfect = true): GameState {
  return run(playing(), ...fullPlayActions(perfect), { type: 'VIEW_STAGE', stage: 5 })
}

export const VALID_ACTION = Array.from({ length: 35 }, (_, index) => `ý${index + 1}`).join(' ')
