import { describe, expect, it } from 'vitest'
import { createInitialState } from './reducer'
import { getTotal } from './selectors'
import { VALID_ACTION, atStage5, playing, run, student } from '../test/actions'

const fillValid = (code = 'DI SẢN KẾT NỐI TƯƠNG LAI') => [
  { type: 'SET_CODE', code } as const,
  { type: 'SET_ACTION', action: VALID_ACTION } as const,
]

describe('Chặng 5 - điều kiện vào và chỉnh sửa', () => {
  it('chặng 5 bị khóa cho đến khi hoàn thành Chặng 4', () => {
    const start = playing()
    expect(start.stageStatus[5]).toBe('locked')
    expect(run(start, { type: 'SET_CODE', code: 'x' })).toBe(start)
    expect(run(start, { type: 'SUBMIT_AMBASSADOR', issuedAt: '24/10/2026' })).toBe(start)
  })

  it('sau Chặng 4, Chặng 5 mở và không có điểm riêng', () => {
    const state = atStage5()
    expect(state.stageStatus[5]).toBe('in_progress')
    expect(Object.keys(state.scores)).toEqual(['1', '2', '3', '4'])
    expect(getTotal(state)).toBe(200)
  })

  it('sửa họ tên, lớp, trường cập nhật state chung; thông tin không hợp lệ bị từ chối', () => {
    const state = atStage5()
    const edited = run(state, { type: 'UPDATE_STUDENT', student: { name: ' Trần  Thị B ', className: '12A2', school: 'THPT X' } })
    expect(edited.student).toEqual({ name: 'Trần Thị B', className: '12A2', school: 'THPT X' })
    expect(run(state, { type: 'UPDATE_STUDENT', student: { ...student, name: '' } })).toBe(state)
  })

  it('không sang Bước 2 khi thông tin học sinh không hợp lệ (qua DEV_JUMP không có thông tin)', () => {
    const state = run(createInitialState(), { type: 'DEV_JUMP', stage: 5 })
    expect(run(state, { type: 'AMBASSADOR_STEP', step: 2 })).toBe(state)
  })

  it('đi tới Bước 2 và quay lại Bước 1', () => {
    const state = run(atStage5(), { type: 'AMBASSADOR_STEP', step: 2 })
    expect(state.ambassador.step).toBe(2)
    expect(run(state, { type: 'AMBASSADOR_STEP', step: 1 }).ambassador.step).toBe(1)
  })

  it('lưu mật mã, hành động và ảnh trong bộ nhớ; có thể bỏ ảnh', () => {
    const state = run(atStage5(), ...fillValid('di sản'), { type: 'SET_AVATAR', avatarUrl: 'blob:abc' })
    expect(state.ambassador.code).toBe('di sản')
    expect(state.ambassador.action).toBe(VALID_ACTION)
    expect(state.ambassador.avatarUrl).toBe('blob:abc')
    expect(run(state, { type: 'SET_AVATAR', avatarUrl: null }).ambassador.avatarUrl).toBeNull()
  })
})

describe('Chặng 5 - tạo thẻ', () => {
  const toStep2 = () => run(atStage5(), { type: 'AMBASSADOR_STEP', step: 2 })

  it('đúng mật mã và dữ liệu hợp lệ: tạo thẻ, ghi ngày cấp, sang Bước 3', () => {
    const state = run(toStep2(), ...fillValid(), { type: 'SUBMIT_AMBASSADOR', issuedAt: '24/10/2026' })
    expect(state.ambassador.outcome).toBe('success')
    expect(state.ambassador.step).toBe(3)
    expect(state.ambassador.issuedAt).toBe('24/10/2026')
    expect(state.stageStatus[5]).toBe('completed')
  })

  it('không phân biệt hoa/thường và khoảng trắng thừa khi so khớp mật mã', () => {
    const state = run(toStep2(), ...fillValid('  di  sản kết nối   tương lai '), {
      type: 'SUBMIT_AMBASSADOR',
      issuedAt: '24/10/2026',
    })
    expect(state.ambassador.outcome).toBe('success')
  })

  it('sai mật mã: không tạo thẻ, không có ngày cấp, Chặng 5 không hoàn thành', () => {
    const state = run(toStep2(), ...fillValid('DI SAN KET NOI TUONG LAI'), {
      type: 'SUBMIT_AMBASSADOR',
      issuedAt: '24/10/2026',
    })
    expect(state.ambassador.outcome).toBe('failed')
    expect(state.ambassador.issuedAt).toBeNull()
    expect(state.stageStatus[5]).toBe('in_progress')
  })

  it('sai mật mã chỉ một lần: không nhập lại được trong lượt chơi này', () => {
    const failed = run(toStep2(), ...fillValid('SAI'), { type: 'SUBMIT_AMBASSADOR', issuedAt: '24/10/2026' })
    const retry = run(
      failed,
      { type: 'SET_CODE', code: 'DI SẢN KẾT NỐI TƯƠNG LAI' },
      { type: 'AMBASSADOR_STEP', step: 1 },
      { type: 'SUBMIT_AMBASSADOR', issuedAt: '24/10/2026' },
    )
    expect(retry).toBe(failed)
    expect(retry.ambassador.outcome).toBe('failed')
  })

  it('dữ liệu không hợp lệ thì không nộp (không đổi trạng thái)', () => {
    const noCode = run(toStep2(), { type: 'SET_ACTION', action: VALID_ACTION })
    expect(run(noCode, { type: 'SUBMIT_AMBASSADOR', issuedAt: 'x' })).toBe(noCode)
    const shortAction = run(toStep2(), { type: 'SET_CODE', code: 'DI SẢN KẾT NỐI TƯƠNG LAI' }, { type: 'SET_ACTION', action: 'quá ngắn' })
    expect(run(shortAction, { type: 'SUBMIT_AMBASSADOR', issuedAt: 'x' })).toBe(shortAction)
  })

  it('chỉ nộp được ở Bước 2', () => {
    const atStep1 = run(atStage5(), ...fillValid())
    expect(run(atStep1, { type: 'SUBMIT_AMBASSADOR', issuedAt: 'x' })).toBe(atStep1)
  })

  it('bấm nộp nhiều lần chỉ tạo thẻ một lần; ngày cấp không bị ghi đè', () => {
    const done = run(toStep2(), ...fillValid(), { type: 'SUBMIT_AMBASSADOR', issuedAt: '24/10/2026' })
    const again = run(done, { type: 'SUBMIT_AMBASSADOR', issuedAt: '25/10/2026' })
    expect(again).toBe(done)
    expect(again.ambassador.issuedAt).toBe('24/10/2026')
  })

  it('sau khi tạo thẻ, dữ liệu bị khóa; chuyển Bước 4 để xuất thẻ', () => {
    const done = run(toStep2(), ...fillValid(), { type: 'SUBMIT_AMBASSADOR', issuedAt: '24/10/2026' })
    expect(run(done, { type: 'SET_ACTION', action: 'khác' })).toBe(done)
    expect(run(done, { type: 'UPDATE_STUDENT', student: { ...student, name: 'Tên khác' } })).toBe(done)
    const exportStep = run(done, { type: 'AMBASSADOR_TO_EXPORT' })
    expect(exportStep.ambassador.step).toBe(4)
    expect(run(exportStep, { type: 'AMBASSADOR_TO_EXPORT' })).toBe(exportStep)
  })

  it('Chặng 5 không cộng điểm: tổng điểm không đổi sau khi tạo thẻ', () => {
    const before = atStage5(false)
    const done = run(before, { type: 'AMBASSADOR_STEP', step: 2 }, ...fillValid(), { type: 'SUBMIT_AMBASSADOR', issuedAt: 'x' })
    expect(getTotal(done)).toBe(getTotal(before))
    expect(Object.keys(done.scores)).toEqual(['1', '2', '3', '4'])
  })

  it('RESET xóa mọi dữ liệu Chặng 5', () => {
    const done = run(toStep2(), ...fillValid(), { type: 'SET_AVATAR', avatarUrl: 'blob:x' }, { type: 'SUBMIT_AMBASSADOR', issuedAt: 'x' })
    expect(run(done, { type: 'RESET' })).toEqual(createInitialState())
  })
})
