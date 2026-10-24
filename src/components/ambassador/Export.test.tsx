import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { VALID_ACTION } from '../../test/actions'
import { renderApp, type User } from '../../test/helpers'

const { renderCardPng, downloadDataUrl } = vi.hoisted(() => ({
  renderCardPng: vi.fn(),
  downloadDataUrl: vi.fn(),
}))

vi.mock('./exportCard', () => ({ renderCardPng, downloadDataUrl }))

async function reachExportStep(user: User) {
  await user.click(within(screen.getByLabelText('Xem khung chặng (chế độ phát triển)')).getByRole('button', { name: 'Chặng 5' }))
  await user.type(screen.getByLabelText('Họ và tên'), 'Nguyễn Thị Đào')
  await user.type(screen.getByLabelText('Lớp'), '12A1')
  await user.type(screen.getByLabelText('Trường'), 'THPT Chuyên')
  await user.click(screen.getByRole('button', { name: 'Tiếp tục' }))
  await user.click(screen.getByLabelText('Mật mã (in hoa có dấu)'))
  await user.paste('DI SẢN KẾT NỐI TƯƠNG LAI')
  await user.click(screen.getByLabelText(/Hành động bảo tồn/))
  await user.paste(VALID_ACTION)
  await user.click(screen.getByRole('button', { name: 'Hoàn thành' }))
}

describe('Chặng 5 - xuất thẻ PNG (một nút)', () => {
  beforeEach(() => {
    renderCardPng.mockReset()
    downloadDataUrl.mockReset()
  })

  it('chưa có nút Xuất thẻ khi chưa tạo thẻ (Bước 1)', async () => {
    const user = renderApp()
    await user.click(within(screen.getByLabelText('Xem khung chặng (chế độ phát triển)')).getByRole('button', { name: 'Chặng 5' }))
    expect(screen.queryByRole('button', { name: 'Xuất thẻ' })).not.toBeInTheDocument()
  })

  it('xuất ngay bằng một lần bấm; thanh bước chuyển sang bước 4 sau khi xuất', async () => {
    renderCardPng.mockResolvedValue('data:image/png;base64,AAAA')
    const user = renderApp()
    await reachExportStep(user)
    const steps = screen.getByRole('list', { name: '4 bước tạo thẻ' })
    expect(within(steps).getByText('Xem trước thẻ').closest('li')).toHaveAttribute('aria-current', 'step')

    await user.click(screen.getByRole('button', { name: 'Xuất thẻ' }))

    expect(downloadDataUrl).toHaveBeenCalledTimes(1)
    expect(within(steps).getByText('Xuất thẻ').closest('li')).toHaveAttribute('aria-current', 'step')
    expect(screen.getByRole('button', { name: 'Xuất thẻ' })).toBeEnabled()
  })

  it('xuất đúng phần tử thẻ (không chứa nút bấm), tải về file PNG tên không dấu', async () => {
    renderCardPng.mockResolvedValue('data:image/png;base64,AAAA')
    const user = renderApp()
    await reachExportStep(user)
    await user.click(screen.getByRole('button', { name: 'Xuất thẻ' }))

    expect(renderCardPng).toHaveBeenCalledTimes(1)
    const node = renderCardPng.mock.calls[0][0] as HTMLElement
    expect(node.classList.contains('acard')).toBe(true)
    expect(node.querySelector('button, input, textarea, nav')).toBeNull()
    expect(node).toHaveTextContent('Nguyễn Thị Đào')
    expect(downloadDataUrl).toHaveBeenCalledWith('data:image/png;base64,AAAA', 'the-dai-su-di-san-so-nguyen-thi-dao.png')
  })

  it('hiện thông báo lỗi khi không xuất được và cho thử lại', async () => {
    renderCardPng.mockRejectedValueOnce(new Error('fail')).mockResolvedValueOnce('data:image/png;base64,BBBB')
    const user = renderApp()
    await reachExportStep(user)
    await user.click(screen.getByRole('button', { name: 'Xuất thẻ' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Không thể xuất thẻ. Vui lòng thử lại.')
    expect(downloadDataUrl).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Xuất thẻ' }))
    expect(downloadDataUrl).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('đang xuất thì nút bị khóa, không xuất hai lần', async () => {
    let resolve: (value: string) => void = () => {}
    renderCardPng.mockImplementation(() => new Promise<string>((done) => (resolve = done)))
    const user = renderApp()
    await reachExportStep(user)
    await user.click(screen.getByRole('button', { name: 'Xuất thẻ' }))
    const busy = screen.getByRole('button', { name: 'Đang tạo ảnh...' })
    expect(busy).toBeDisabled()
    await user.click(busy)
    expect(renderCardPng).toHaveBeenCalledTimes(1)
    resolve('data:image/png;base64,CCCC')
    expect(await screen.findByRole('button', { name: 'Xuất thẻ' })).toBeEnabled()
  })
})
