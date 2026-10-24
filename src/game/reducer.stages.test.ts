import { describe, expect, it } from 'vitest'
import { STAGE1_IMAGES } from '../content/stage1'
import { STAGE2_CARDS } from '../content/stage2'
import { ROOM1_ARTIFACTS, ROOM2_BLANKS, ROOM3_QUESTIONS } from '../content/stage3'
import { createInitialState, gameReducer, placeArtifact } from './reducer'
import { getBreakdown, getStageOutcome, getTotal } from './selectors'
import { defaultShuffles } from './shuffle'
import type { GameAction, GameState } from './types'

const student = { name: 'Nguyễn Văn A', className: '12A1', school: 'THPT Chuyên' }

function run(state: GameState, ...actions: GameAction[]): GameState {
  return actions.reduce(gameReducer, state)
}

function playing(): GameState {
  return run(createInitialState(), { type: 'START' }, { type: 'SUBMIT_INFO', student })
}

function stage1Actions(correct: boolean, tiles = 1): GameAction[] {
  const actions: GameAction[] = []
  STAGE1_IMAGES.forEach((image, index) => {
    for (let tile = 0; tile < tiles; tile += 1) actions.push({ type: 'OPEN_TILE', image: index as 0 | 1, tile })
    actions.push({
      type: 'SELECT_STAGE1_OPTION',
      image: index as 0 | 1,
      optionId: correct ? image.correctOptionId : 'shwedagon',
    })
  })
  return actions
}

function stage2Actions(correct: boolean): GameAction[] {
  return STAGE2_CARDS.map((card) => ({
    type: 'PLACE_CARD',
    cardId: card.id,
    period: correct ? card.period : card.period === 'p1' ? 'p2' : 'p1',
  }))
}

function stage3Actions(correct: boolean): GameAction[] {
  const wrong = (id: string) => (id === 'A' ? 'C' : 'A')
  return [
    ...ROOM1_ARTIFACTS.map<GameAction>((item, index) => ({
      type: 'PLACE_ARTIFACT',
      itemId: item.id,
      // Sai: xoay vòng sang tủ kế tiếp
      cabinetId: correct ? item.correctCabinetId : ROOM1_ARTIFACTS[(index + 1) % 4].correctCabinetId,
    })),
    { type: 'COMPLETE_ROOM', room: 1 },
    ...ROOM2_BLANKS.map<GameAction>((blank) => ({
      type: 'ANSWER_ROOM2',
      blankId: blank.id,
      optionId: correct ? blank.correctOptionId : wrong(blank.correctOptionId),
    })),
    { type: 'COMPLETE_ROOM', room: 2 },
    ...ROOM3_QUESTIONS.map<GameAction>((q) => ({
      type: 'ANSWER_ROOM3',
      questionId: q.id,
      optionId: correct ? q.correctOptionId : wrong(q.correctOptionId),
    })),
    { type: 'COMPLETE_ROOM', room: 3 },
  ]
}

describe('Chặng 1 - luồng và khóa', () => {
  it('chưa đủ điều kiện thì Hoàn thành không có tác dụng', () => {
    const start = playing()
    expect(run(start, { type: 'SUBMIT_STAGE1' })).toBe(start)
    const onlyTiles = run(start, { type: 'OPEN_TILE', image: 0, tile: 0 }, { type: 'OPEN_TILE', image: 1, tile: 3 })
    expect(run(onlyTiles, { type: 'SUBMIT_STAGE1' })).toBe(onlyTiles)
    const onlyAnswers = run(
      start,
      { type: 'SELECT_STAGE1_OPTION', image: 0, optionId: 'angkor-wat' },
      { type: 'SELECT_STAGE1_OPTION', image: 1, optionId: 'borobudur' },
    )
    expect(run(onlyAnswers, { type: 'SUBMIT_STAGE1' })).toBe(onlyAnswers)
  })

  it.each([
    [1, 40],
    [2, 32],
    [3, 24],
    [4, 16],
  ])('đúng cả hai ảnh khi mỗi ảnh mở %i ô được %i nửa điểm, nhận mảnh DI nếu từ 8 điểm', (tiles, half) => {
    const state = run(playing(), ...stage1Actions(true, tiles), { type: 'SUBMIT_STAGE1' })
    expect(state.scores[1]).toBe(half)
    expect(state.fragments[1]).toBe(true)
    expect(state.stageStatus[1]).toBe('completed')
    expect(state.stageStatus[2]).toBe('in_progress')
  })

  it('trả lời sai cả hai: 0 điểm, không có mảnh DI, vẫn mở Chặng 2', () => {
    const state = run(playing(), ...stage1Actions(false), { type: 'SUBMIT_STAGE1' })
    expect(state.scores[1]).toBe(0)
    expect(state.fragments[1]).toBe(false)
    expect(state.stageStatus[2]).toBe('in_progress')
    expect(getStageOutcome(state, 1)?.result?.message).toContain('Rất tiếc')
  })

  it('bấm hoàn thành liên tục chỉ tính điểm một lần', () => {
    const once = run(playing(), ...stage1Actions(true), { type: 'SUBMIT_STAGE1' })
    const many = run(once, { type: 'SUBMIT_STAGE1' }, { type: 'SUBMIT_STAGE1' }, { type: 'SUBMIT_STAGE1' })
    expect(many).toBe(once)
    expect(getTotal(many)).toBe(40)
  })

  it('sau khi hoàn thành, mở ô và đổi đáp án đều bị khóa', () => {
    const done = run(playing(), ...stage1Actions(false), { type: 'SUBMIT_STAGE1' })
    const after = run(
      done,
      { type: 'OPEN_TILE', image: 0, tile: 3 },
      { type: 'SELECT_STAGE1_OPTION', image: 0, optionId: 'angkor-wat' },
      { type: 'SUBMIT_STAGE1' },
    )
    expect(after).toBe(done)
  })

  it('chấm theo mã lựa chọn nên không phụ thuộc thứ tự đã xáo', () => {
    const reversed = defaultShuffles()
    reversed.stage1Options = [
      [...reversed.stage1Options[0]].reverse(),
      [...reversed.stage1Options[1]].reverse(),
    ]
    const start = run(createInitialState(), { type: 'START' }, { type: 'SUBMIT_INFO', student, shuffles: reversed })
    expect(start.stage1.optionOrder[0][0]).toBe('wat-rong-khun')
    const done = run(start, ...stage1Actions(true), { type: 'SUBMIT_STAGE1' })
    expect(done.scores[1]).toBe(40)
  })

  it('đáp án không hợp lệ và ô ngoài phạm vi bị bỏ qua', () => {
    const start = playing()
    expect(run(start, { type: 'SELECT_STAGE1_OPTION', image: 0, optionId: 'bogus' })).toBe(start)
    expect(run(start, { type: 'OPEN_TILE', image: 0, tile: 4 })).toBe(start)
  })
})

describe('Chặng 2 - luồng và khóa', () => {
  const atStage2 = () => run(playing(), ...stage1Actions(true), { type: 'SUBMIT_STAGE1' })

  it('không thể chơi khi Chặng 2 còn khóa', () => {
    const start = playing()
    expect(run(start, { type: 'PLACE_CARD', cardId: 'c01', period: 'p1' })).toBe(start)
    expect(run(start, { type: 'SUBMIT_STAGE2' })).toBe(start)
  })

  it('xếp đúng 15 thẻ: 30 điểm và mảnh SẢN', () => {
    const state = run(atStage2(), ...stage2Actions(true), { type: 'SUBMIT_STAGE2' })
    expect(state.scores[2]).toBe(60)
    expect(state.fragments[2]).toBe(true)
    expect(state.stageStatus[3]).toBe('in_progress')
  })

  it('hoàn thành khi chưa đặt thẻ nào: 0 điểm, không nhận mảnh', () => {
    const state = run(atStage2(), { type: 'SUBMIT_STAGE2' })
    expect(state.scores[2]).toBe(0)
    expect(state.fragments[2]).toBe(false)
  })

  it('đặt sai toàn bộ: 0 điểm; chỉ đúng 7 thẻ: 14 điểm, không nhận mảnh', () => {
    const wrong = run(atStage2(), ...stage2Actions(false), { type: 'SUBMIT_STAGE2' })
    expect(wrong.scores[2]).toBe(0)
    const seven = run(
      atStage2(),
      ...stage2Actions(true).slice(0, 7),
      { type: 'SUBMIT_STAGE2' },
    )
    expect(seven.scores[2]).toBe(28)
    expect(seven.fragments[2]).toBe(false)
  })

  it('có thể đưa thẻ về ngân hàng và đặt lại; thẻ lạ bị bỏ qua', () => {
    const base = atStage2()
    const moved = run(
      base,
      { type: 'PLACE_CARD', cardId: 'c01', period: 'p2' },
      { type: 'PLACE_CARD', cardId: 'c01', period: null },
    )
    expect(moved.stage2.placements.c01).toBeNull()
    expect(run(base, { type: 'PLACE_CARD', cardId: 'zzz', period: 'p1' })).toBe(base)
  })

  it('bấm hoàn thành nhiều lần và đổi thẻ sau khi hoàn thành đều không có tác dụng', () => {
    const done = run(atStage2(), ...stage2Actions(true), { type: 'SUBMIT_STAGE2' })
    expect(run(done, { type: 'SUBMIT_STAGE2' }, { type: 'PLACE_CARD', cardId: 'c01', period: 'p3' })).toBe(done)
  })
})

describe('Chặng 3 - ba phòng', () => {
  const atStage3 = () =>
    run(
      playing(),
      ...stage1Actions(true),
      { type: 'SUBMIT_STAGE1' },
      ...stage2Actions(true),
      { type: 'SUBMIT_STAGE2' },
    )

  it('phải hoàn thành đúng thứ tự phòng; phòng chưa đủ mục thì không hoàn thành được', () => {
    const start = atStage3()
    expect(run(start, { type: 'ANSWER_ROOM2', blankId: 'blank-1', optionId: 'B' })).toBe(start)
    expect(run(start, { type: 'COMPLETE_ROOM', room: 2 })).toBe(start)
    expect(run(start, { type: 'COMPLETE_ROOM', room: 1 })).toBe(start)
    const partial = run(start, { type: 'PLACE_ARTIFACT', itemId: 'artifact-shiva', cabinetId: 'hindu' })
    expect(run(partial, { type: 'COMPLETE_ROOM', room: 1 })).toBe(partial)
  })

  it('hoán đổi hiện vật khi đặt vào tủ đã có', () => {
    const swapped = placeArtifact({ a: 'x', b: 'y', c: null }, 'a', 'y')
    expect(swapped).toEqual({ a: 'y', b: 'x', c: null })
    const toPool = placeArtifact({ a: null, b: 'y' }, 'a', 'y')
    expect(toPool).toEqual({ a: 'y', b: null })
    expect(placeArtifact({ a: 'x' }, 'a', null)).toEqual({ a: null })
  })

  it('đúng hết: 40 điểm, mảnh KẾT NỐI, tổng hợp từng phòng', () => {
    const state = run(atStage3(), ...stage3Actions(true))
    expect(state.scores[3]).toBe(80)
    expect(state.fragments[3]).toBe(true)
    expect(state.stageStatus[4]).toBe('in_progress')
    expect(getBreakdown(state, 3).map((line) => line.score)).toEqual([20, 20, 40])
  })

  it('sai hết: 0 điểm, không có mảnh KẾT NỐI', () => {
    const state = run(atStage3(), ...stage3Actions(false))
    expect(state.scores[3]).toBe(0)
    expect(state.fragments[3]).toBe(false)
    expect(getStageOutcome(state, 3)?.result?.message).toContain('Không gian bảo tàng')
  })

  it('phòng đã hoàn thành bị khóa; hoàn thành lại không cộng thêm', () => {
    const afterRoom1 = run(
      atStage3(),
      ...stage3Actions(true).slice(0, 5),
    )
    expect(afterRoom1.stage3.room).toBe(2)
    expect(afterRoom1.stage3.roomDone[0]).toBe(true)
    expect(run(afterRoom1, { type: 'PLACE_ARTIFACT', itemId: 'artifact-shiva', cabinetId: null })).toBe(afterRoom1)
    expect(run(afterRoom1, { type: 'COMPLETE_ROOM', room: 1 })).toBe(afterRoom1)
    const done = run(atStage3(), ...stage3Actions(true))
    expect(run(done, { type: 'COMPLETE_ROOM', room: 3 })).toBe(done)
  })

  it('chưa có điểm chặng cho đến khi hoàn thành phòng 3', () => {
    const afterTwoRooms = run(atStage3(), ...stage3Actions(true).slice(0, 10))
    expect(afterTwoRooms.scores[3]).toBeNull()
    expect(afterTwoRooms.stageStatus[3]).toBe('in_progress')
  })
})

describe('Chặng 4 - luồng và khóa', () => {
  const atStage4 = () =>
    run(
      playing(),
      ...stage1Actions(true),
      { type: 'SUBMIT_STAGE1' },
      ...stage2Actions(true),
      { type: 'SUBMIT_STAGE2' },
      ...stage3Actions(true),
    )

  it('phải chọn nhân vật và phương án mới hoàn tất', () => {
    const start = atStage4()
    expect(run(start, { type: 'SUBMIT_STAGE4' })).toBe(start)
    const onlyRole = run(start, { type: 'SELECT_ROLE', roleId: 'historian' })
    expect(run(onlyRole, { type: 'SUBMIT_STAGE4' })).toBe(onlyRole)
    const onlyVote = run(start, { type: 'SELECT_VOTE', voteId: 'C' })
    expect(run(onlyVote, { type: 'SUBMIT_STAGE4' })).toBe(onlyVote)
  })

  it('tối đa 10 điểm: nhân vật + 3 thẻ + phương án C; nhận mảnh TƯƠNG LAI', () => {
    const state = run(
      atStage4(),
      { type: 'SELECT_ROLE', roleId: 'community' },
      { type: 'OPEN_EVIDENCE', evidenceId: 'technical' },
      { type: 'OPEN_EVIDENCE', evidenceId: 'economy' },
      { type: 'OPEN_EVIDENCE', evidenceId: 'community' },
      { type: 'SELECT_VOTE', voteId: 'C' },
      { type: 'SUBMIT_STAGE4' },
    )
    expect(state.scores[4]).toBe(20)
    expect(state.fragments[4]).toBe(true)
    expect(state.stageStatus[5]).toBe('in_progress')
  })

  it('mở lại thẻ không cộng lặp; đổi lựa chọn trước khi hoàn thành chỉ tính lựa chọn cuối', () => {
    const state = run(
      atStage4(),
      { type: 'SELECT_ROLE', roleId: 'historian' },
      { type: 'SELECT_ROLE', roleId: 'tourism' },
      { type: 'OPEN_EVIDENCE', evidenceId: 'technical' },
      { type: 'OPEN_EVIDENCE', evidenceId: 'technical' },
      { type: 'SELECT_VOTE', voteId: 'C' },
      { type: 'SELECT_VOTE', voteId: 'A' },
      { type: 'SUBMIT_STAGE4' },
    )
    expect(state.stage4.opened).toEqual(['technical'])
    expect(state.scores[4]).toBe(2 * (2 + 1 + 3))
  })

  it('khóa sau khi hoàn thành và không cộng điểm lần hai', () => {
    const done = run(
      atStage4(),
      { type: 'SELECT_ROLE', roleId: 'historian' },
      { type: 'SELECT_VOTE', voteId: 'B' },
      { type: 'SUBMIT_STAGE4' },
    )
    expect(done.scores[4]).toBe(8)
    const after = run(done, { type: 'SELECT_VOTE', voteId: 'C' }, { type: 'OPEN_EVIDENCE', evidenceId: 'economy' }, {
      type: 'SUBMIT_STAGE4',
    })
    expect(after).toBe(done)
  })
})

describe('tổng điểm toàn hành trình', () => {
  it('điểm tối đa 100 và Chặng 5 không cộng điểm', () => {
    const state = run(
      playing(),
      ...stage1Actions(true),
      { type: 'SUBMIT_STAGE1' },
      ...stage2Actions(true),
      { type: 'SUBMIT_STAGE2' },
      ...stage3Actions(true),
      { type: 'SELECT_ROLE', roleId: 'historian' },
      { type: 'OPEN_EVIDENCE', evidenceId: 'technical' },
      { type: 'OPEN_EVIDENCE', evidenceId: 'economy' },
      { type: 'OPEN_EVIDENCE', evidenceId: 'community' },
      { type: 'SELECT_VOTE', voteId: 'C' },
      { type: 'SUBMIT_STAGE4' },
    )
    expect(getTotal(state) / 2).toBe(100)
    expect(Object.keys(state.scores)).toEqual(['1', '2', '3', '4'])
    expect(state.stageStatus[5]).toBe('in_progress')
    expect(Object.values(state.fragments).every(Boolean)).toBe(true)
  })

  it('điểm một phần: tổng chỉ gồm các chặng đã hoàn thành', () => {
    const state = run(playing(), ...stage1Actions(true, 2), { type: 'SUBMIT_STAGE1' })
    expect(getTotal(state) / 2).toBe(16)
    expect(getStageOutcome(state, 2)).toBeNull()
  })
})
