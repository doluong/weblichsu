import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AmbassadorCard } from './AmbassadorCard'

const student = { name: 'Nguyễn Thị Hương', className: '12A1', school: 'THPT Chuyên Chu Văn An' }
const longAction = Array.from({ length: 50 }, (_, index) => `bảo-tồn${index}`).join(' ')

function renderCard(total: number, avatarUrl: string | null = null, action = longAction) {
  return render(
    <AmbassadorCard student={student} total={total} action={action} avatarUrl={avatarUrl} issuedAt="24/10/2026" />,
  )
}

describe('thẻ Đại sứ', () => {
  it('100/100: lời khen nguyên văn trong tài liệu, tên học sinh được thay vào', () => {
    renderCard(200)
    expect(screen.getByText('ĐIỂM SỐ', { exact: false }).parentElement).toHaveTextContent('ĐIỂM SỐ 100/100')
    expect(screen.getByText(/Cô Thảo cảm ơn Nguyễn Thị Hương đã xuất sắc vượt qua các thử thách/)).toBeInTheDocument()
    expect(screen.getByText(/Con xứng đáng là một Đại sứ Di sản số tài năng!/)).toBeInTheDocument()
    expect(screen.queryByText(/chưa thật sự như ý/)).not.toBeInTheDocument()
  })

  it('dưới 100 (87,5): lời động viên và điểm thập phân dùng dấu phẩy', () => {
    renderCard(175)
    expect(screen.getByText('ĐIỂM SỐ', { exact: false }).parentElement).toHaveTextContent('ĐIỂM SỐ 87,5/100')
    expect(screen.getByText(/Dù kết quả lần này chưa thật sự như ý/)).toBeInTheDocument()
    expect(screen.queryByText(/xuất sắc vượt qua/)).not.toBeInTheDocument()
  })

  it('có ảnh chân dung thì dùng ảnh đó; không có thì dùng ảnh giữ chỗ riêng', () => {
    const { unmount } = renderCard(100, 'blob:avatar')
    expect(screen.getByAltText('Ảnh chân dung')).toHaveAttribute('src', 'blob:avatar')
    unmount()
    renderCard(100, null)
    expect(screen.getByAltText('Ảnh chân dung')).toHaveAttribute('src', expect.stringContaining('portrait-default-placeholder.jpg'))
  })

  it('hiển thị đầy đủ nội dung đóng góp dài (50 từ), không cắt bớt', () => {
    const { container } = renderCard(100)
    expect(container.querySelector('.acard__action')).toHaveTextContent(longAction)
  })

  it('có đủ các phần theo tài liệu', () => {
    renderCard(100)
    for (const text of [
      'THẺ ĐẠI SỨ DI SẢN SỐ',
      'VĂN MINH ĐÔNG NAM Á',
      'Tuyên dương và khen thưởng em:',
      'Đã hoàn thành các chặng thử thách, giải mật mã văn minh Đông Nam Á',
      'DI SẢN KẾT NỐI TƯƠNG LAI',
      'Đóng góp ý tưởng và hành động thiết thực:',
      'GIÁO VIÊN',
      'NGUYỄN THỊ THẢO',
    ]) {
      expect(screen.getByText(text)).toBeInTheDocument()
    }
    expect(screen.getByText('Ngày cấp:', { exact: false }).parentElement).toHaveTextContent('Ngày cấp: 24/10/2026')
  })
})
