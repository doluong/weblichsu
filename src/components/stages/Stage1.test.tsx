import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { inRegion, playStage1, renderApp, startGame } from '../../test/helpers'

describe('Chặng 1 - giao diện', () => {
  it('Hoàn thành chỉ sáng khi mỗi ảnh đã mở ít nhất 1 ô và đã chọn đáp án', async () => {
    const user = renderApp()
    await startGame(user)
    const submit = screen.getByRole('button', { name: 'Hoàn thành' })
    expect(submit).toBeDisabled()

    const first = inRegion('Bức ảnh bí ẩn 1')
    const second = inRegion('Bức ảnh bí ẩn 2')
    await user.click(first.getByRole('radio', { name: 'Đền Angkor Wat (Campuchia)' }))
    await user.click(second.getByRole('radio', { name: 'Chùa Bô-rô-bu-đua (Indonesia)' }))
    expect(submit).toBeDisabled()

    await user.click(first.getByRole('button', { name: 'Mở ô 1' }))
    expect(submit).toBeDisabled()
    await user.click(second.getByRole('button', { name: 'Mở ô 4' }))
    expect(submit).toBeEnabled()
    expect(first.getByText('Đã mở 1/4 ô')).toBeInTheDocument()
  })

  it('mỗi ảnh có 4 lựa chọn (nhãn A-D)', async () => {
    const user = renderApp()
    await startGame(user)
    const radios = inRegion('Bức ảnh bí ẩn 1').getAllByRole('radio')
    expect(radios).toHaveLength(4)
  })

  it('đúng cả hai ảnh: hiện điểm 20/20, thông báo, mảnh DI; khóa câu trả lời; mở Chặng 2', async () => {
    const user = renderApp()
    await startGame(user)
    await playStage1(user, true)

    const result = screen.getByRole('region', { name: 'Kết quả Chặng 1' })
    expect(within(result).getByText('Chúc mừng nhà thám hiểm thiên tài đã hoàn thành thử thách!')).toBeInTheDocument()
    expect(within(result).getByText('Nhận mảnh mật mã đầu tiên “DI”')).toBeInTheDocument()
    expect(result).toHaveTextContent('Điểm số: 20/20 điểm')
    expect(result).toHaveTextContent('Tổng điểm hiện tại: 20/100')

    const cipher = screen.getByRole('region', { name: 'Mảnh mật mã đã nhận' })
    expect(within(cipher).getByText('DI')).toBeInTheDocument()
    expect(within(cipher).getAllByText('Chưa nhận')).toHaveLength(3)

    expect(screen.getByRole('button', { name: 'Hoàn thành' })).toBeDisabled()
    expect(inRegion('Bức ảnh bí ẩn 1').getByRole('button', { name: 'Ô 1 đã mở' })).toBeDisabled()
    expect(inRegion('Bức ảnh bí ẩn 1').getAllByRole('radio')[0]).toBeDisabled()
    expect(screen.getByRole('button', { name: /Dòng thời gian/ })).toBeEnabled()
  })

  it('trả lời sai: 0 điểm, thông báo "Rất tiếc", không có mảnh DI', async () => {
    const user = renderApp()
    await startGame(user)
    await playStage1(user, false)

    const result = screen.getByRole('region', { name: 'Kết quả Chặng 1' })
    expect(result).toHaveTextContent('Điểm số: 0/20 điểm')
    expect(within(result).getByText(/Rất tiếc bạn không nhận được mật mã trong chặng này/)).toBeInTheDocument()
    expect(within(result).queryByText(/Nhận mảnh mật mã/)).not.toBeInTheDocument()
    const cipher = screen.getByRole('region', { name: 'Mảnh mật mã đã nhận' })
    expect(within(cipher).getAllByText('Chưa nhận')).toHaveLength(4)
  })
})
