import { fireEvent, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { VALID_ACTION } from '../../test/actions'
import { renderApp, type User } from '../../test/helpers'

const CODE = 'DI SẢN KẾT NỐI TƯƠNG LAI'

async function jumpToStage5(user: User) {
  const dev = screen.getByLabelText('Xem khung chặng (chế độ phát triển)')
  await user.click(within(dev).getByRole('button', { name: 'Chặng 5' }))
}

async function fillStep1(user: User) {
  await user.type(screen.getByLabelText('Họ và tên'), 'Nguyễn Thị Hương')
  await user.type(screen.getByLabelText('Lớp'), '12A1')
  await user.type(screen.getByLabelText('Trường'), 'THPT Chuyên Chu Văn An')
  await user.click(screen.getByRole('button', { name: 'Tiếp tục' }))
}

// Dùng fireEvent-like nhập nhanh cho văn bản dài để test không chậm.
async function setText(user: User, label: string, value: string) {
  const field = screen.getByLabelText(label)
  await user.click(field)
  await user.paste(value)
}

async function toStep2(user: User) {
  await jumpToStage5(user)
  await fillStep1(user)
}

const CODE_LABEL = 'Mật mã (in hoa có dấu)'
const ACTION_LABEL = /Hành động bảo tồn/
const ACTION_FULL = 'Hành động bảo tồn (đề xuất giải pháp thực tế của bản thân, 10-30 từ)'

describe('Chặng 5 - Bước 1', () => {
  it('thiếu thông tin: hiện thông báo tại từng trường, không sang Bước 2', async () => {
    const user = renderApp()
    await jumpToStage5(user)
    await user.type(screen.getByLabelText('Họ và tên'), 'An')
    await user.click(screen.getByRole('button', { name: 'Tiếp tục' }))
    const alerts = screen.getAllByRole('alert')
    expect(alerts).toHaveLength(2)
    for (const alert of alerts) expect(alert).toHaveTextContent('Vui lòng nhập đầy đủ họ và tên, lớp, trường.')
    expect(screen.getByLabelText('Họ và tên')).toHaveValue('An')
    expect(screen.queryByLabelText(CODE_LABEL)).not.toBeInTheDocument()
  })

  it('cho sửa họ tên, lớp, trường; tên mới hiện ở đầu trang', async () => {
    const user = renderApp()
    await toStep2(user)
    expect(screen.getByRole('heading', { name: 'Bước 2: Mật mã và hành động bảo tồn' })).toBeInTheDocument()
    expect(screen.getByText('Nguyễn Thị Hương', { selector: '.site-header__student' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Quay lại' }))
    const name = screen.getByLabelText('Họ và tên')
    await user.clear(name)
    await user.type(name, 'Trần Văn B')
    await user.click(screen.getByRole('button', { name: 'Tiếp tục' }))
    expect(screen.getByText('Trần Văn B', { selector: '.site-header__student' })).toBeInTheDocument()
  })

  it('ảnh chân dung tùy chọn: chỉ nhận ảnh JPG/PNG/WebP, thu hồi URL khi xóa', async () => {
    const created: string[] = []
    const revoked: string[] = []
    vi.stubGlobal('URL', {
      createObjectURL: () => {
        const url = `blob:test-${created.length}`
        created.push(url)
        return url
      },
      revokeObjectURL: (url: string) => revoked.push(url),
    })
    try {
      const user = renderApp()
      await jumpToStage5(user)
      const input = screen.getByLabelText('Ảnh chân dung (tùy chọn)')

      await user.upload(input, new File(['abc'], 'a.png', { type: 'image/png' }))
      expect(screen.getByAltText('Ảnh chân dung đã chọn')).toHaveAttribute('src', 'blob:test-0')
      await user.upload(input, new File(['abc'], 'b.jpg', { type: 'image/jpeg' }))
      expect(revoked).toEqual(['blob:test-0'])
      await user.click(screen.getByRole('button', { name: 'Xóa ảnh' }))
      expect(revoked).toEqual(['blob:test-0', 'blob:test-1'])
      expect(screen.queryByAltText('Ảnh chân dung đã chọn')).not.toBeInTheDocument()

      // userEvent.upload lọc theo thuộc tính accept; dùng fireEvent để mô phỏng người dùng chọn "Tất cả tệp".
      fireEvent.change(input, { target: { files: [new File(['x'], 'ghi-chu.txt', { type: 'text/plain' })] } })
      expect(screen.getByRole('alert')).toHaveTextContent('Vui lòng chọn tệp ảnh (JPG, PNG hoặc WebP) nhỏ hơn 5 MB.')
      expect(created).toHaveLength(2)
    } finally {
      vi.unstubAllGlobals()
    }
  })
})

describe('Chặng 5 - Bước 2 và kiểm tra hợp lệ', () => {
  it('để trống: hiện lỗi mật mã, lỗi hành động và thông báo chung', async () => {
    const user = renderApp()
    await toStep2(user)
    await user.click(screen.getByRole('button', { name: 'Hoàn thành' }))
    const text = screen.getAllByRole('alert').map((alert) => alert.textContent)
    expect(text).toContain('Vui lòng nhập mật mã.')
    expect(text).toContain('Đóng góp bảo tồn cần có từ 10 đến 30 từ.')
    expect(text).toContain('Vui lòng kiểm tra lại thông tin trước khi tạo thẻ.')
  })

  it('gợi ý chỉ để tham khảo: không tự điền vào ô nhập', async () => {
    const user = renderApp()
    await toStep2(user)
    expect(screen.getByText('Sáng tạo nội dung số quảng bá di sản')).toBeInTheDocument()
    expect(screen.getByText('Tuyên truyền không xả rác tại khu di tích')).toBeInTheDocument()
    expect(screen.getByText('Tham gia các chiến dịch tình nguyện bảo tồn')).toBeInTheDocument()
    expect(screen.getByLabelText(ACTION_LABEL)).toHaveValue('')
    expect(screen.getByLabelText(CODE_LABEL)).toHaveValue('')
  })

  it('đếm từ trực tiếp; 9 từ bị từ chối và dữ liệu đã nhập được giữ nguyên', async () => {
    const user = renderApp()
    await toStep2(user)
    const nine = Array.from({ length: 9 }, (_, i) => `a${i}`).join(' ')
    await setText(user, ACTION_FULL, nine)
    await setText(user, CODE_LABEL, CODE)
    expect(screen.getByText('Đã nhập 9 từ (cần từ 10 đến 30 từ).')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Hoàn thành' }))
    expect(screen.getAllByRole('alert').map((a) => a.textContent)).toContain('Đóng góp bảo tồn cần có từ 10 đến 30 từ.')
    expect(screen.getByLabelText(ACTION_LABEL)).toHaveValue(nine)
    expect(screen.getByLabelText(CODE_LABEL)).toHaveValue(CODE)
  })

  it('31 từ bị từ chối, 10 và 30 từ được chấp nhận', async () => {
    const user = renderApp()
    await toStep2(user)
    await setText(user, CODE_LABEL, CODE)
    await setText(user, ACTION_FULL, Array.from({ length: 31 }, (_, i) => `a${i}`).join(' '))
    await user.click(screen.getByRole('button', { name: 'Hoàn thành' }))
    expect(screen.getAllByRole('alert').map((a) => a.textContent)).toContain('Đóng góp bảo tồn cần có từ 10 đến 30 từ.')
    await user.clear(screen.getByLabelText(ACTION_LABEL))
    await setText(user, ACTION_FULL, Array.from({ length: 30 }, (_, i) => `a${i}`).join(' '))
    await user.click(screen.getByRole('button', { name: 'Hoàn thành' }))
    expect(screen.getByRole('status')).toHaveTextContent('Chúc mừng em đã hoàn thành thử thách đại sứ di sản số')
  })
})

describe('Chặng 5 - sai mật mã', () => {
  it('không tạo thẻ, hiện tổng điểm và lời động viên, chỉ có nút Tái khởi động hành trình', async () => {
    const user = renderApp()
    await toStep2(user)
    await setText(user, CODE_LABEL, 'DI SAN KET NOI TUONG LAI')
    await setText(user, ACTION_FULL, VALID_ACTION)
    await user.click(screen.getByRole('button', { name: 'Hoàn thành' }))

    expect(screen.getByText(/Cảm ơn Nguyễn Thị Hương đã dấn thân vào chuyến thám hiểm lịch sử cùng cô Thảo!/)).toBeInTheDocument()
    expect(screen.getByText(/Đừng nản lòng nhé/)).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Điểm số các chặng' })).toHaveTextContent('Tổng điểm')
    expect(screen.queryByText('THẺ ĐẠI SỨ DI SẢN SỐ', { selector: '.acard__title' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Hoàn thành' })).not.toBeInTheDocument()
    expect(screen.queryByLabelText(CODE_LABEL)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Xuất thẻ' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Tái khởi động hành trình' }).length).toBeGreaterThanOrEqual(1)
  })

  it('tái khởi động từ màn hình thất bại hỏi xác nhận rồi về màn hình đầu', async () => {
    const user = renderApp()
    await toStep2(user)
    await setText(user, CODE_LABEL, 'SAI')
    await setText(user, ACTION_FULL, VALID_ACTION)
    await user.click(screen.getByRole('button', { name: 'Hoàn thành' }))
    const main = screen.getByRole('main')
    await user.click(within(main).getByRole('button', { name: 'Tái khởi động hành trình' }))
    await user.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Bắt đầu lại' }))
    expect(screen.getByRole('heading', { level: 1, name: 'MẬT MÃ VĂN MINH ĐÔNG NAM Á' })).toBeInTheDocument()
  })
})

describe('Chặng 5 - đúng mật mã', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 24, 10, 0, 0))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('tạo thẻ: lời chúc, điểm các chặng, thẻ đủ nội dung, ngày cấp theo ngày thực tế', async () => {
    const user = renderApp()
    await toStep2(user)
    await setText(user, CODE_LABEL, '  di sản  kết nối tương lai ')
    await setText(user, ACTION_FULL, VALID_ACTION)
    await user.click(screen.getByRole('button', { name: 'Hoàn thành' }))

    expect(screen.getByRole('status')).toHaveTextContent('Chúc mừng em đã hoàn thành thử thách đại sứ di sản số')
    expect(screen.getByRole('region', { name: 'Điểm số các chặng' })).toBeInTheDocument()
    const card = document.querySelector('.acard') as HTMLElement
    expect(card).not.toBeNull()
    const inCard = within(card)
    expect(inCard.getByText('THẺ ĐẠI SỨ DI SẢN SỐ')).toBeInTheDocument()
    expect(inCard.getByText('VĂN MINH ĐÔNG NAM Á')).toBeInTheDocument()
    expect(inCard.getByText('Tuyên dương và khen thưởng em:')).toBeInTheDocument()
    expect(inCard.getByText('Nguyễn Thị Hương', { selector: '.acard__name' })).toBeInTheDocument()
    expect(card).toHaveTextContent('Lớp: 12A1')
    expect(card).toHaveTextContent('Trường: THPT Chuyên Chu Văn An')
    expect(inCard.getByText(CODE)).toBeInTheDocument()
    expect(card).toHaveTextContent(VALID_ACTION)
    expect(card).toHaveTextContent('ĐIỂM SỐ 0/100')
    expect(card).toHaveTextContent('Dù kết quả lần này chưa thật sự như ý')
    expect(card).toHaveTextContent('Ngày cấp: 24/10/2026')
    expect(card).toHaveTextContent('GIÁO VIÊN')
    expect(card).toHaveTextContent('NGUYỄN THỊ THẢO')
    expect(inCard.getByAltText('Ảnh chân dung')).toHaveAttribute('src', expect.stringContaining('portrait-default-placeholder.jpg'))
  })

  it('chỉ cần một nút Xuất thẻ: có ngay ở Bước 3, không còn nút "Tiếp tục để xuất thẻ"', async () => {
    const user = renderApp()
    await toStep2(user)
    await setText(user, CODE_LABEL, CODE)
    await setText(user, ACTION_FULL, VALID_ACTION)
    await user.click(screen.getByRole('button', { name: 'Hoàn thành' }))
    expect(screen.queryByRole('button', { name: 'Tiếp tục để xuất thẻ' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Xuất thẻ' })).toBeEnabled()
    expect(document.querySelector('.acard')).not.toBeNull()
    expect(within(screen.getByRole('main')).getByRole('button', { name: 'Tái khởi động hành trình' })).toBeInTheDocument()
  })
})
