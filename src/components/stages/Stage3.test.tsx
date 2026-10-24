import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ROOM1_ARTIFACTS, ROOM1_CABINETS, ROOM2_BLANKS, ROOM3_QUESTIONS } from '../../content/stage3'
import { continueToStage, playStage1, renderApp, startGame, submitStage2, type User } from '../../test/helpers'

async function reachStage3(user: User) {
  await startGame(user)
  await playStage1(user, true)
  await continueToStage(user, 2)
  await submitStage2(user)
  await continueToStage(user, 3)
}

const cabinetLabel = (id: string) => ROOM1_CABINETS.find((cabinet) => cabinet.id === id)!.label

async function placeArtifact(user: User, itemId: string, cabinetId: string) {
  const item = ROOM1_ARTIFACTS.find((artifact) => artifact.id === itemId)!
  await user.click(screen.getByRole('button', { name: item.description }))
  await user.click(screen.getByRole('button', { name: `Đặt hiện vật đã chọn vào tủ ${cabinetLabel(cabinetId)}` }))
}

async function doRoom1(user: User, correct: boolean) {
  for (const [index, item] of ROOM1_ARTIFACTS.entries()) {
    const target = correct ? item.correctCabinetId : ROOM1_ARTIFACTS[(index + 1) % 4].correctCabinetId
    await placeArtifact(user, item.id, target)
  }
  await user.click(screen.getByRole('button', { name: 'Hoàn thành phòng 1' }))
}

async function doRoom2(user: User, wrongCount: number) {
  for (const [index, blank] of ROOM2_BLANKS.entries()) {
    const wrong = index < wrongCount
    const option = blank.options.find((o) => (wrong ? o.id !== blank.correctOptionId : o.id === blank.correctOptionId))!
    const group = screen.getByRole('group', { name: `Lựa chọn điền ${blank.marker}` })
    await user.click(within(group).getByRole('radio', { name: option.label }))
  }
  await user.click(screen.getByRole('button', { name: 'Hoàn thành phòng 2' }))
}

async function doRoom3(user: User, correct: boolean) {
  for (const question of ROOM3_QUESTIONS) {
    const option = question.options.find((o) => (correct ? o.id === question.correctOptionId : o.id !== question.correctOptionId))!
    const group = screen.getByRole('group', { name: question.question })
    await user.click(within(group).getByRole('radio', { name: option.label }))
  }
  await user.click(screen.getByRole('button', { name: 'Hoàn thành phòng 3' }))
}

describe('Chặng 3 - giao diện', () => {
  it('phải hoàn thành đúng thứ tự phòng và đặt đủ hiện vật mới hoàn thành phòng', async () => {
    const user = renderApp()
    await reachStage3(user)

    const nav = screen.getByRole('navigation', { name: 'Các phòng trưng bày' })
    const [room1, room2, room3] = within(nav).getAllByRole('button')
    expect(room1).toBeEnabled()
    expect(room2).toBeDisabled()
    expect(room3).toBeDisabled()

    const complete = screen.getByRole('button', { name: 'Hoàn thành phòng 1' })
    expect(complete).toBeDisabled()
    await placeArtifact(user, 'artifact-shiva', 'hindu')
    expect(complete).toBeDisabled()
  })

  it('Phòng 1 có banner trang trí bằng ảnh nền bảo tàng (không phải nội dung câu hỏi)', async () => {
    const user = renderApp()
    await reachStage3(user)
    const banner = document.querySelector('.room__banner img') as HTMLImageElement
    expect(banner).not.toBeNull()
    expect(banner.getAttribute('src')).toContain('museum-room-background-placeholder.jpg')
    expect(banner.getAttribute('alt')).toBe('')
  })

  it('hoán đổi khi đặt hiện vật vào tủ đã có', async () => {
    const user = renderApp()
    await reachStage3(user)
    await placeArtifact(user, 'artifact-shiva', 'indigenous')
    await placeArtifact(user, 'artifact-stupa', 'indigenous')

    const pool = screen.getByRole('region', { name: 'Danh sách hiện vật' })
    expect(within(pool).getByRole('button', { name: ROOM1_ARTIFACTS[1].description })).toBeInTheDocument()
    const cabinet = screen.getByRole('heading', { name: 'Tín ngưỡng bản địa' }).closest('li')!
    expect(within(cabinet).getByRole('button', { name: ROOM1_ARTIFACTS[2].description })).toBeInTheDocument()
  })

  it('làm đúng cả ba phòng: 40/40, mảnh KẾT NỐI, điểm từng phòng chỉ hiện ở tổng kết', async () => {
    const user = renderApp()
    await reachStage3(user)
    await doRoom1(user, true)
    expect(screen.queryByText(/Điểm số/)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /PHÒNG 2/ })).toBeInTheDocument()
    await doRoom2(user, 0)
    expect(screen.queryByText(/Điểm số/)).not.toBeInTheDocument()
    await doRoom3(user, true)

    const result = screen.getByRole('region', { name: 'Kết quả Chặng 3' })
    expect(result).toHaveTextContent('Điểm số: 40/40 điểm')
    expect(result).toHaveTextContent('Nhận mảnh mật mã thứ ba “KẾT NỐI”')
    expect(result).toHaveTextContent('Phòng 1: Tín ngưỡng & Tôn giáo10/10')
    expect(result).toHaveTextContent('Phòng 2: Chữ viết & Văn học10/10')
    expect(result).toHaveTextContent('Phòng 3: Kiến trúc & Điêu khắc20/20')
    expect(result).toHaveTextContent('Tổng điểm hiện tại: 60/100')
    expect(within(screen.getByRole('region', { name: 'Mảnh mật mã đã nhận' })).getByText('KẾT NỐI')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hoàn thành phòng 3' })).toBeDisabled()
  })

  it('nhãn A-D gán theo vị trí hiển thị; chấm theo mã lựa chọn nên vẫn đúng khi đã xáo', async () => {
    const user = renderApp()
    await reachStage3(user)
    await doRoom1(user, true)
    const group = screen.getByRole('group', { name: 'Lựa chọn điền [..1..]' })
    const letters = [...group.querySelectorAll('.option__letter')].map((node) => node.textContent)
    expect(letters).toEqual(['A', 'B', 'C', 'D'])
    await doRoom2(user, 0)
    await doRoom3(user, true)
    expect(screen.getByRole('region', { name: 'Kết quả Chặng 3' })).toHaveTextContent('Điểm số: 40/40 điểm')
  })

  it('điểm thập phân hiển thị dấu phẩy: 37,5/40 (Phòng 2 đúng 3 câu)', async () => {
    const user = renderApp()
    await reachStage3(user)
    await doRoom1(user, true)
    await doRoom2(user, 1)
    await doRoom3(user, true)
    const result = screen.getByRole('region', { name: 'Kết quả Chặng 3' })
    expect(result).toHaveTextContent('Điểm số: 37,5/40 điểm')
    expect(result).toHaveTextContent('Chúc mừng em đã vượt qua các phòng trưng bày')
    expect(result).toHaveTextContent('Tổng điểm hiện tại: 57,5/100')
  })

  it('sai hết: 0/40, không có mảnh KẾT NỐI', async () => {
    const user = renderApp()
    await reachStage3(user)
    await doRoom1(user, false)
    await doRoom2(user, 4)
    await doRoom3(user, false)
    const result = screen.getByRole('region', { name: 'Kết quả Chặng 3' })
    expect(result).toHaveTextContent('Điểm số: 0/40 điểm')
    expect(result).toHaveTextContent('Không gian bảo tàng vẫn còn nhiều ẩn số')
    expect(result).not.toHaveTextContent('Nhận mảnh mật mã')
  })
})
