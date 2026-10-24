import { describe, expect, it } from 'vitest'
import { createInitialState, gameReducer } from './reducer'
import type { GameState, StudentInfo } from './types'

const valid: StudentInfo = { name: 'Nguyễn Văn A', className: '12A1', school: 'THPT Chuyên' }

function toInfo(): GameState {
  return gameReducer(createInitialState(), { type: 'START' })
}

describe('gameReducer', () => {
  it('bắt đầu ở màn hình giới thiệu, mọi chặng khóa, chưa có mảnh mật mã', () => {
    const state = createInitialState()
    expect(state.screen).toBe('intro')
    expect(Object.values(state.stageStatus).every((status) => status === 'locked')).toBe(true)
    expect(Object.values(state.fragments).every((received) => received === false)).toBe(true)
  })

  it('START chuyển sang biểu mẫu và BACK_TO_INTRO quay lại', () => {
    const info = toInfo()
    expect(info.screen).toBe('info')
    expect(gameReducer(info, { type: 'BACK_TO_INTRO' }).screen).toBe('intro')
  })

  it('SUBMIT_INFO hợp lệ mở Chặng 1 và chuẩn hóa khoảng trắng', () => {
    const state = gameReducer(toInfo(), {
      type: 'SUBMIT_INFO',
      student: { name: '  Nguyễn   Văn A ', className: '12A1', school: 'THPT Chuyên' },
    })
    expect(state.screen).toBe('stage')
    expect(state.currentStage).toBe(1)
    expect(state.student.name).toBe('Nguyễn Văn A')
    expect(state.stageStatus).toEqual({ 1: 'in_progress', 2: 'locked', 3: 'locked', 4: 'locked', 5: 'locked' })
  })

  it.each([
    { name: '', className: '12A1', school: 'THPT' },
    { name: 'A', className: '   ', school: 'THPT' },
    { name: 'A', className: '12A1', school: '' },
  ])('SUBMIT_INFO thiếu trường bắt buộc bị từ chối: %o', (student) => {
    const before = toInfo()
    expect(gameReducer(before, { type: 'SUBMIT_INFO', student })).toBe(before)
  })

  it('không thể vào chặng đang khóa', () => {
    const playing = gameReducer(toInfo(), { type: 'SUBMIT_INFO', student: valid })
    expect(gameReducer(playing, { type: 'VIEW_STAGE', stage: 2 })).toBe(playing)
    expect(gameReducer(playing, { type: 'VIEW_STAGE', stage: 1 }).currentStage).toBe(1)
  })

  it('DEV_JUMP chỉ đổi chặng đang xem, không cấp mảnh và không cộng điểm', () => {
    const jumped = gameReducer(createInitialState(), { type: 'DEV_JUMP', stage: 3 })
    expect(jumped.currentStage).toBe(3)
    expect(jumped.stageStatus).toEqual({ 1: 'completed', 2: 'completed', 3: 'in_progress', 4: 'locked', 5: 'locked' })
    expect(Object.values(jumped.fragments).every((received) => received === false)).toBe(true)
  })

  it('RESET đưa mọi thứ về trạng thái ban đầu', () => {
    const playing = gameReducer(toInfo(), { type: 'SUBMIT_INFO', student: valid })
    expect(gameReducer(playing, { type: 'RESET' })).toEqual(createInitialState())
  })
})
