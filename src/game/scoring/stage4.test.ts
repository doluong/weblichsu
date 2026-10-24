import { describe, expect, it } from 'vitest'
import {
  STAGE4_ROLE_IDS,
  canCompleteStage4,
  scoreStage4,
} from './stage4'

describe('Chặng 4 - chọn nhân vật', () => {
  it.each(STAGE4_ROLE_IDS)('nhân vật %s đều được 2 điểm', (roleId) => {
    const score = scoreStage4({ roleId, openedEvidenceIds: [], voteId: null })
    expect(score.role).toBe(4)
    expect(score.total).toBe(4)
  })

  it('chưa chọn hoặc nhân vật không hợp lệ thì 0 điểm', () => {
    expect(scoreStage4({ roleId: null, openedEvidenceIds: [], voteId: null }).role).toBe(0)
    expect(scoreStage4({ roleId: 'unknown', openedEvidenceIds: [], voteId: null }).role).toBe(0)
  })
})

describe('Chặng 4 - thẻ chứng cứ', () => {
  it.each([
    [[], 0],
    [['technical'], 1],
    [['technical', 'economy'], 2],
    [['technical', 'economy', 'community'], 3],
  ])('mở %j được %i điểm', (opened, points) => {
    expect(scoreStage4({ roleId: null, openedEvidenceIds: opened, voteId: null }).evidence / 2).toBe(points)
  })

  it('mở lại cùng một thẻ không cộng lặp; thẻ lạ không được tính', () => {
    const score = scoreStage4({
      roleId: null,
      openedEvidenceIds: ['technical', 'technical', 'technical', 'bogus'],
      voteId: null,
    })
    expect(score.evidence / 2).toBe(1)
  })
})

describe('Chặng 4 - bỏ phiếu', () => {
  it.each([
    ['A', 3],
    ['B', 2],
    ['C', 5],
  ])('phương án %s được %i điểm', (voteId, points) => {
    expect(scoreStage4({ roleId: null, openedEvidenceIds: [], voteId }).vote / 2).toBe(points)
  })

  it('chưa bỏ phiếu hoặc phương án lạ thì 0 điểm', () => {
    expect(scoreStage4({ roleId: null, openedEvidenceIds: [], voteId: null }).vote).toBe(0)
    expect(scoreStage4({ roleId: null, openedEvidenceIds: [], voteId: 'D' }).vote).toBe(0)
  })
})

describe('Chặng 4 - tổng', () => {
  it('tối đa 10 điểm (2 + 3 + 5)', () => {
    const score = scoreStage4({
      roleId: 'historian',
      openedEvidenceIds: ['technical', 'economy', 'community'],
      voteId: 'C',
    })
    expect(score.total / 2).toBe(10)
  })

  it('tối thiểu khi hoàn tất là 4 điểm (nhân vật 2 + phương án B 2, không mở thẻ)', () => {
    const score = scoreStage4({ roleId: 'tourism', openedEvidenceIds: [], voteId: 'B' })
    expect(score.total / 2).toBe(4)
  })

  it('chỉ hoàn tất được khi đã chọn nhân vật và phương án', () => {
    expect(canCompleteStage4('historian', 'A')).toBe(true)
    expect(canCompleteStage4(null, 'A')).toBe(false)
    expect(canCompleteStage4('historian', null)).toBe(false)
    expect(canCompleteStage4('x', 'A')).toBe(false)
  })
})
