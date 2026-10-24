import { describe, expect, it } from 'vitest'
import { STAGE_INTROS } from './source'
import { STAGE1_IMAGES, STAGE1_OPTIONS } from './stage1'
import { STAGE2_CARDS, STAGE2_PERIODS } from './stage2'
import {
  ROOM1_ARTIFACTS,
  ROOM1_CABINETS,
  ROOM2_BLANKS,
  ROOM2_PASSAGES,
  ROOM3_QUESTIONS,
  STAGE3_KEYS,
} from './stage3'
import { STAGE4_EVIDENCE, STAGE4_ROLE_LABELS, STAGE4_VOTES } from './stage4'
import { STAGE1_RESULTS, STAGE2_RESULTS, STAGE3_RESULTS, STAGE4_RESULT } from './results'
import { IMAGE_ASSETS } from '../config/assets'

describe('nội dung Chặng 1', () => {
  it('có 4 lựa chọn dùng chung và mỗi ảnh có đúng một đáp án đúng thuộc danh sách', () => {
    expect(STAGE1_OPTIONS).toHaveLength(4)
    expect(new Set(STAGE1_OPTIONS.map((option) => option.id)).size).toBe(4)
    expect(STAGE1_IMAGES.map((image) => image.correctOptionId)).toEqual(['angkor-wat', 'borobudur'])
    for (const image of STAGE1_IMAGES) {
      expect(STAGE1_OPTIONS.some((option) => option.id === image.correctOptionId)).toBe(true)
    }
  })

  it('đã sửa chính tả tên riêng theo xác nhận', () => {
    const labels = STAGE1_OPTIONS.map((option) => option.label).join(' | ')
    expect(labels).toContain('Wat Rong Khun')
    expect(labels).toContain('Shwedagon')
    expect(labels).not.toMatch(/War Rong|Shwedagob|Borobudur/)
  })

  it('hai ảnh dùng hai file ảnh giữ chỗ khác nhau', () => {
    expect(new Set(STAGE1_IMAGES.map((image) => image.imageKey)).size).toBe(2)
  })
})

describe('nội dung Chặng 2', () => {
  it('có 15 thẻ, 3 giai đoạn, mỗi giai đoạn 5 thẻ', () => {
    expect(STAGE2_CARDS).toHaveLength(15)
    expect(STAGE2_PERIODS.map((period) => period.label)).toEqual([
      'Đầu CN – Thế kỷ VII',
      'Thế kỷ VII – XV',
      'Thế kỷ XVI – XIX',
    ])
    for (const period of STAGE2_PERIODS) {
      expect(STAGE2_CARDS.filter((card) => card.period === period.id)).toHaveLength(5)
    }
    expect(new Set(STAGE2_CARDS.map((card) => card.id)).size).toBe(15)
  })

  it('giữ nguyên văn các thẻ, kể cả "Hình thành", "Phát triển", "Chuyển biến"', () => {
    const texts = STAGE2_CARDS.map((card) => card.text)
    for (const text of ['Hình thành', 'Phát triển', 'Chuyển biến', 'Phù Nam', 'Pagan', 'Thành tựu khoa học – kĩ thuật']) {
      expect(texts).toContain(text)
    }
  })
})

describe('nội dung Chặng 3', () => {
  it('Phòng 1: 4 tủ, 4 hiện vật, mỗi hiện vật một tủ đúng khác nhau, dùng "Hindu giáo"', () => {
    expect(ROOM1_CABINETS.map((cabinet) => cabinet.label)).toEqual([
      'Tín ngưỡng bản địa',
      'Hindu giáo',
      'Phật giáo',
      'Hồi giáo',
    ])
    expect(ROOM1_ARTIFACTS).toHaveLength(4)
    expect(new Set(ROOM1_ARTIFACTS.map((item) => item.correctCabinetId)).size).toBe(4)
    expect(new Set(ROOM1_ARTIFACTS.map((item) => item.imageKey)).size).toBe(4)
  })

  it('Phòng 2: 4 chỗ trống, 4 lựa chọn mỗi chỗ, đáp án B, A, B, B', () => {
    expect(ROOM2_BLANKS).toHaveLength(4)
    expect(ROOM2_BLANKS.map((blank) => blank.correctOptionId)).toEqual(['B', 'A', 'B', 'B'])
    for (const blank of ROOM2_BLANKS) expect(blank.options).toHaveLength(4)
    const used = ROOM2_PASSAGES.flatMap((passage) => passage.segments)
      .filter((segment) => segment.type === 'blank')
      .map((segment) => (segment.type === 'blank' ? segment.blankId : ''))
    expect(used).toEqual(ROOM2_BLANKS.map((blank) => blank.id))
  })

  it('Tư liệu 2 có dấu chấm cuối câu (L.K1.5)', () => {
    const passage2 = ROOM2_PASSAGES[1].segments
    const last = passage2[passage2.length - 1]
    expect(last.type === 'text' && last.value.endsWith('giá trị nhân văn Đông Nam Á.')).toBe(true)
  })

  it('Phòng 3: 4 câu, đáp án B, A, B, B, mỗi công trình một ảnh riêng', () => {
    expect(ROOM3_QUESTIONS).toHaveLength(4)
    expect(ROOM3_QUESTIONS.map((q) => q.correctOptionId)).toEqual(['B', 'A', 'B', 'B'])
    expect(new Set(ROOM3_QUESTIONS.map((q) => q.imageKey)).size).toBe(4)
    for (const question of ROOM3_QUESTIONS) expect(question.options).toHaveLength(4)
  })

  it('tên Bô-rô-bu-đua thống nhất trên giao diện', () => {
    const displayed = [
      ...ROOM3_QUESTIONS.flatMap((q) => [q.buildingName, q.question, ...q.options.map((o) => o.label)]),
      ...ROOM1_ARTIFACTS.map((item) => item.description),
      ...STAGE1_OPTIONS.map((option) => option.label),
    ].join(' | ')
    expect(displayed).not.toContain('Borobudur')
    expect(ROOM3_QUESTIONS[1].buildingName).toContain('Bô-rô-bu-đua')
    expect(ROOM3_QUESTIONS[1].question).toContain('Bô-rô-bu-đua')
  })

  it('khóa đáp án đủ 4 + 4 + 4 mục', () => {
    expect(Object.keys(STAGE3_KEYS.room1)).toHaveLength(4)
    expect(Object.keys(STAGE3_KEYS.room2)).toHaveLength(4)
    expect(Object.keys(STAGE3_KEYS.room3)).toHaveLength(4)
  })
})

describe('nội dung Chặng 4', () => {
  it('4 nhân vật, 3 thẻ chứng cứ, 3 phương án', () => {
    expect(Object.values(STAGE4_ROLE_LABELS)).toEqual([
      'Nhà Sử học',
      'Chuyên gia Bảo tồn',
      'Đại diện Cộng đồng Địa phương',
      'Chuyên gia Du lịch & Kinh tế',
    ])
    expect(STAGE4_EVIDENCE).toHaveLength(3)
    expect(STAGE4_VOTES.map((vote) => vote.id)).toEqual(['A', 'B', 'C'])
  })

  it('phương án không hiển thị số điểm', () => {
    expect(JSON.stringify(STAGE4_VOTES)).not.toMatch(/điểm/)
  })
})

describe('thông báo và lời dẫn', () => {
  it('thông báo Chặng 1-3 có đúng số mốc và mảnh mật mã theo tài liệu', () => {
    expect(Object.keys(STAGE1_RESULTS)).toHaveLength(4)
    expect(Object.keys(STAGE2_RESULTS)).toHaveLength(3)
    expect(Object.keys(STAGE3_RESULTS)).toHaveLength(3)
    expect(STAGE1_RESULTS.persevering.reward).toBe('Nhận mảnh mật mã đầu tiên “DI”')
    expect(STAGE1_RESULTS.none.reward).toBeNull()
    expect(STAGE2_RESULTS.partial.reward).toBe('Nhận mảnh mật mã thứ hai “SẢN”')
    expect(STAGE2_RESULTS.low.reward).toBeNull()
    expect(STAGE3_RESULTS.good.reward).toBe('Nhận mảnh mật mã thứ ba “KẾT NỐI”')
    expect(STAGE3_RESULTS.low.reward).toBeNull()
    expect(STAGE4_RESULT.message).toContain('“Chuyên gia Di sản Số”')
    expect(STAGE4_RESULT.message).toContain('“TƯƠNG LAI”')
  })

  it('lời dẫn Chặng 3 đã sửa dấu cách thừa và có dấu chấm cuối (J.I3)', () => {
    expect(STAGE_INTROS[3]).toContain('hiện vật/tư liệu')
    expect(STAGE_INTROS[3]).not.toContain('/ ')
    expect(STAGE_INTROS[3].endsWith('mảnh mật mã thứ ba.')).toBe(true)
  })

  it('lời dẫn Chặng 5 giữ toàn văn tài liệu (J.I1)', () => {
    expect(STAGE_INTROS[5]).toContain('chính thức ghi danh vào Bảng Vàng Hội đồng Di sản!')
  })

  it('mọi ảnh được dùng đều đã khai báo trong cấu hình ảnh', () => {
    const declared = new Set(IMAGE_ASSETS.map((image) => image.key as string))
    const keys = [
      ...STAGE1_IMAGES.map((image) => image.imageKey),
      ...ROOM1_ARTIFACTS.map((item) => item.imageKey),
      ...ROOM3_QUESTIONS.map((q) => q.imageKey),
    ]
    for (const key of keys) expect(declared.has(key), key).toBe(true)
  })
})
