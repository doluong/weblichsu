import { fireEvent, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { STAGE2_CARD_TEXT, STAGE2_CARDS, STAGE2_PERIODS } from '../../content/stage2'
import { continueToStage, playStage1, renderApp, startGame, type User } from '../../test/helpers'

async function reachStage2(user: User) {
  await startGame(user)
  await playStage1(user, true)
  await continueToStage(user, 2)
}

function zoneOf(periodId: string): HTMLElement {
  const label = STAGE2_PERIODS.find((period) => period.id === periodId)!.label
  return screen.getByRole('heading', { name: label }).closest('li')!
}

function bank(): HTMLElement {
  return screen.getByRole('region', { name: 'Ngân hàng thẻ' })
}

async function placeCard(user: User, cardId: string, periodId: string) {
  await user.click(screen.getByRole('button', { name: STAGE2_CARD_TEXT[cardId] }))
  await user.click(within(zoneOf(periodId)).getByRole('button', { name: /Đặt thẻ đã chọn vào giai đoạn/ }))
}

async function placeAllCorrect(user: User, count = STAGE2_CARDS.length) {
  for (const card of STAGE2_CARDS.slice(0, count)) await placeCard(user, card.id, card.period)
}

describe('Chặng 2 - giao diện', () => {
  it('hiển thị 15 thẻ trong ngân hàng và 3 giai đoạn; có thể hoàn thành khi chưa đặt hết', async () => {
    const user = renderApp()
    await reachStage2(user)
    expect(within(bank()).getAllByRole('button', { pressed: false })).toHaveLength(15)
    expect(screen.getByText('Đã đặt 0/15 thẻ.')).toBeInTheDocument()
    for (const period of STAGE2_PERIODS) {
      expect(screen.getByRole('heading', { name: period.label })).toBeInTheDocument()
    }
    expect(screen.getByRole('button', { name: 'Hoàn thành thử thách' })).toBeEnabled()
  })

  it('chọn thẻ rồi chọn giai đoạn để đặt; có thể trả về ngân hàng', async () => {
    const user = renderApp()
    await reachStage2(user)
    const place = within(zoneOf('p1')).getByRole('button', { name: /Đặt thẻ đã chọn vào giai đoạn/ })
    expect(place).toBeDisabled()

    await placeCard(user, 'c03', 'p1')
    expect(within(zoneOf('p1')).getByRole('button', { name: 'Phù Nam' })).toBeInTheDocument()
    expect(within(bank()).getAllByRole('button', { pressed: false })).toHaveLength(14)
    expect(screen.getByText('Đã đặt 1/15 thẻ.')).toBeInTheDocument()

    await user.click(within(zoneOf('p1')).getByRole('button', { name: 'Phù Nam' }))
    await user.click(screen.getByRole('button', { name: 'Trả thẻ đã chọn về ngân hàng' }))
    expect(within(bank()).getByRole('button', { name: 'Phù Nam' })).toBeInTheDocument()
    expect(screen.getByText('Đã đặt 0/15 thẻ.')).toBeInTheDocument()
  })

  it('hỗ trợ kéo thả thẻ vào giai đoạn', async () => {
    const user = renderApp()
    await reachStage2(user)
    fireEvent.drop(zoneOf('p2'), { dataTransfer: { getData: () => 'c08' } })
    expect(within(zoneOf('p2')).getByRole('button', { name: 'Đại Việt' })).toBeInTheDocument()
    expect(user).toBeDefined()
  })

  it('xếp đúng 15 thẻ: 30/30, thông báo hoàn hảo, nhận mảnh SẢN, khóa các thẻ', async () => {
    const user = renderApp()
    await reachStage2(user)
    await placeAllCorrect(user)
    await user.click(screen.getByRole('button', { name: 'Hoàn thành thử thách' }))

    const result = screen.getByRole('region', { name: 'Kết quả Chặng 2' })
    expect(result).toHaveTextContent('Điểm số: 30/30 điểm')
    expect(result).toHaveTextContent('Nhận mảnh mật mã thứ hai “SẢN”')
    expect(result).toHaveTextContent('Tổng điểm hiện tại: 50/100')
    expect(within(screen.getByRole('region', { name: 'Mảnh mật mã đã nhận' })).getByText('SẢN')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hoàn thành thử thách' })).toBeDisabled()
    expect(within(zoneOf('p1')).getByRole('button', { name: 'Phù Nam' })).toBeDisabled()
  })

  it('không đặt thẻ nào: 0/30, thông báo khuyến khích, không có mảnh SẢN', async () => {
    const user = renderApp()
    await reachStage2(user)
    await user.click(screen.getByRole('button', { name: 'Hoàn thành thử thách' }))

    const result = screen.getByRole('region', { name: 'Kết quả Chặng 2' })
    expect(result).toHaveTextContent('Điểm số: 0/30 điểm')
    expect(result).toHaveTextContent('Mật mã thời gian chưa thể giải mã trọn vẹn')
    expect(result).not.toHaveTextContent('Nhận mảnh mật mã')
    expect(result).toHaveTextContent('Tổng điểm hiện tại: 20/100')
  })

  it('đúng 7 thẻ = 14 điểm: thông báo khuyến khích và không nhận mảnh SẢN', async () => {
    const user = renderApp()
    await reachStage2(user)
    await placeAllCorrect(user, 7)
    await user.click(screen.getByRole('button', { name: 'Hoàn thành thử thách' }))
    const result = screen.getByRole('region', { name: 'Kết quả Chặng 2' })
    expect(result).toHaveTextContent('Điểm số: 14/30 điểm')
    expect(result).not.toHaveTextContent('Nhận mảnh mật mã')
  })

  it('bấm hoàn thành liên tục chỉ tính một lần', async () => {
    const user = renderApp()
    await reachStage2(user)
    await placeAllCorrect(user, 8)
    const submit = screen.getByRole('button', { name: 'Hoàn thành thử thách' })
    await user.dblClick(submit)
    await user.click(submit)
    const result = screen.getByRole('region', { name: 'Kết quả Chặng 2' })
    expect(result).toHaveTextContent('Điểm số: 16/30 điểm')
    expect(result).toHaveTextContent('Tổng điểm hiện tại: 36/100')
  })
})
