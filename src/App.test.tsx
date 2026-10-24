import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import { GameProvider } from './state/GameProvider'

function setup() {
  const user = userEvent.setup()
  render(
    <GameProvider>
      <App />
    </GameProvider>,
  )
  return user
}

async function fillAndStart(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Bắt đầu hành trình' }))
  await user.type(screen.getByLabelText('Họ và tên'), 'Nguyễn Văn A')
  await user.type(screen.getByLabelText('Lớp'), '12A1')
  await user.type(screen.getByLabelText('Trường'), 'THPT Chuyên')
  await user.click(screen.getByRole('button', { name: 'Bắt đầu Chặng 1' }))
}

describe('khung giao diện', () => {
  it('màn hình giới thiệu có tiêu đề, lời dẫn và 5 chặng', () => {
    setup()
    expect(screen.getByRole('heading', { level: 1, name: 'MẬT MÃ VĂN MINH ĐÔNG NAM Á' })).toBeInTheDocument()
    expect(screen.getByText(/Những mật mã tri thức về các nền văn minh Đông Nam Á/)).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').filter((li) => li.classList.contains('journey__card'))).toHaveLength(5)
    expect(screen.queryByRole('button', { name: 'Tái khởi động hành trình' })).not.toBeInTheDocument()
  })

  it('biểu mẫu thiếu thông tin hiện thông báo tại trường và không xóa dữ liệu đã nhập', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Bắt đầu hành trình' }))
    await user.type(screen.getByLabelText('Họ và tên'), 'Nguyễn Văn A')
    await user.click(screen.getByRole('button', { name: 'Bắt đầu Chặng 1' }))

    const alerts = screen.getAllByRole('alert')
    expect(alerts).toHaveLength(2)
    for (const alert of alerts) {
      expect(alert).toHaveTextContent('Vui lòng nhập đầy đủ họ và tên, lớp, trường.')
    }
    expect(screen.getByLabelText('Họ và tên')).toHaveValue('Nguyễn Văn A')
    expect(screen.queryByText('Chặng 1', { selector: '.stage__eyebrow' })).not.toBeInTheDocument()
  })

  it('đủ thông tin thì vào Chặng 1; các chặng sau bị khóa; bốn ô mảnh mật mã đều trống', async () => {
    const user = setup()
    await fillAndStart(user)

    expect(screen.getByRole('heading', { level: 1, name: 'BÍ ẨN LỊCH SỬ' })).toBeInTheDocument()
    const progress = screen.getByRole('navigation', { name: 'Tiến trình 5 chặng' })
    const steps = within(progress).getAllByRole('button')
    expect(steps).toHaveLength(5)
    expect(steps[0]).toBeEnabled()
    for (const step of steps.slice(1)) expect(step).toBeDisabled()

    const cipher = screen.getByRole('region', { name: 'Mảnh mật mã đã nhận' })
    expect(within(cipher).getAllByText('Chưa nhận')).toHaveLength(4)
    expect(screen.getByRole('button', { name: 'Hoàn thành' })).toBeDisabled()
  })

  it('tái khởi động hỏi xác nhận; hủy giữ nguyên, đồng ý đưa về màn hình giới thiệu', async () => {
    const user = setup()
    await fillAndStart(user)

    await user.click(screen.getByRole('button', { name: 'Tái khởi động hành trình' }))
    const dialog = screen.getByRole('alertdialog')
    expect(dialog).toHaveTextContent('Toàn bộ tiến trình hiện tại sẽ bị xóa.')

    await user.click(within(dialog).getByRole('button', { name: 'Hủy' }))
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'BÍ ẨN LỊCH SỬ' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Tái khởi động hành trình' }))
    await user.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Bắt đầu lại' }))
    expect(screen.getByRole('heading', { level: 1, name: 'MẬT MÃ VĂN MINH ĐÔNG NAM Á' })).toBeInTheDocument()
  })

  it('chế độ phát triển cho xem khung từng chặng, Chặng 5 không hiện điểm', async () => {
    const user = setup()
    const dev = screen.getByLabelText('Xem khung chặng (chế độ phát triển)')
    await user.click(within(dev).getByRole('button', { name: 'Chặng 5' }))
    expect(screen.getByRole('heading', { level: 1, name: 'ĐẠI SỨ DI SẢN SỐ' })).toBeInTheDocument()
    expect(screen.getByText('Không tính điểm')).toBeInTheDocument()
    expect(screen.getByText('THẺ ĐẠI SỨ DI SẢN SỐ')).toBeInTheDocument()
    expect(screen.getByText(/Sứ mệnh khôi phục bản đồ văn minh/)).toBeInTheDocument()
    expect(screen.getByText(/Bảng Vàng Hội đồng Di sản/)).toBeInTheDocument()
  })
})
