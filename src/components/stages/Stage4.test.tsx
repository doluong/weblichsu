import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { STAGE4_EVIDENCE } from '../../content/stage4'
import { continueToStage, playStage1, renderApp, startGame, submitStage2, type User } from '../../test/helpers'

async function reachStage4(user: User) {
  await startGame(user)
  await playStage1(user, true)
  await continueToStage(user, 2)
  await submitStage2(user)
  await continueToStage(user, 3)
  // Chặng 3: đặt đúng Phòng 1, các phòng sau chọn đáp án đầu tiên của mỗi mục.
  for (const [artifact, cabinet] of [
    ['Bức ảnh chạm khắc hình hoa văn sóng nước, thuyền đua, chim Lạc', 'Tín ngưỡng bản địa'],
    ['Tượng đá chạm khắc thần Shiva đang múa', 'Hindu giáo'],
    ['Hình ảnh các bảo tháp (Stupa) hình chuông úp', 'Phật giáo'],
    ['Hình ảnh Thánh đường với mái vòm hành tây, tháp nhọn (Minaret)', 'Hồi giáo'],
  ]) {
    await user.click(screen.getByRole('button', { name: artifact }))
    await user.click(screen.getByRole('button', { name: `Đặt hiện vật đã chọn vào tủ ${cabinet}` }))
  }
  await user.click(screen.getByRole('button', { name: 'Hoàn thành phòng 1' }))
  for (const group of screen.getAllByRole('group')) await user.click(within(group).getAllByRole('radio')[0])
  await user.click(screen.getByRole('button', { name: 'Hoàn thành phòng 2' }))
  for (const group of screen.getAllByRole('group')) await user.click(within(group).getAllByRole('radio')[0])
  await user.click(screen.getByRole('button', { name: 'Hoàn thành phòng 3' }))
  await continueToStage(user, 4)
}

describe('Chặng 4 - giao diện', () => {
  it('có ghi chú tình huống giả định, 4 nhân vật, 3 thẻ chứng cứ đóng và 3 phương án; Hoàn thành bị khóa', async () => {
    const user = renderApp()
    await reachStage4(user)
    expect(screen.getByText('Thánh địa A-ru-na là tình huống di sản giả định.')).toBeInTheDocument()
    const roles = screen.getByRole('group', { name: 'HÃY CHỌN THẺ NHÂN VẬT' })
    expect(within(roles).getAllByRole('radio')).toHaveLength(4)
    expect(screen.getAllByRole('button', { name: /^Mở Thẻ/ })).toHaveLength(3)
    const votes = screen.getByRole('group', { name: 'BỎ PHIẾU PHƯƠNG ÁN HÀNH ĐỘNG' })
    expect(within(votes).getAllByRole('radio')).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Hoàn thành' })).toBeDisabled()
    expect(screen.queryByText(STAGE4_EVIDENCE[0].content)).not.toBeInTheDocument()
  })

  it('phải chọn cả nhân vật và phương án mới hoàn thành được', async () => {
    const user = renderApp()
    await reachStage4(user)
    const submit = screen.getByRole('button', { name: 'Hoàn thành' })
    await user.click(within(screen.getByRole('group', { name: 'HÃY CHỌN THẺ NHÂN VẬT' })).getByRole('radio', { name: 'Nhà Sử học' }))
    expect(submit).toBeDisabled()
    await user.click(within(screen.getByRole('group', { name: 'BỎ PHIẾU PHƯƠNG ÁN HÀNH ĐỘNG' })).getAllByRole('radio')[1])
    expect(submit).toBeEnabled()
  })

  it('tối đa 10/10: nhân vật + mở đủ 3 thẻ + phương án C; huy hiệu và mảnh TƯƠNG LAI', async () => {
    const user = renderApp()
    await reachStage4(user)
    await user.click(within(screen.getByRole('group', { name: 'HÃY CHỌN THẺ NHÂN VẬT' })).getByRole('radio', { name: 'Chuyên gia Bảo tồn' }))
    for (const card of STAGE4_EVIDENCE) {
      await user.click(screen.getByRole('button', { name: `Mở ${card.title}` }))
      expect(screen.getByText(card.content)).toBeInTheDocument()
    }
    await user.click(within(screen.getByRole('group', { name: 'BỎ PHIẾU PHƯƠNG ÁN HÀNH ĐỘNG' })).getAllByRole('radio')[2])
    await user.click(screen.getByRole('button', { name: 'Hoàn thành' }))

    const result = screen.getByRole('region', { name: 'Kết quả Chặng 4' })
    expect(result).toHaveTextContent('Điểm số: 10/10 điểm')
    expect(result).toHaveTextContent('huy hiệu “Chuyên gia Di sản Số”')
    expect(result).toHaveTextContent('Mảnh mật mã thứ tư: “TƯƠNG LAI”')
    expect(within(screen.getByRole('region', { name: 'Mảnh mật mã đã nhận' })).getByText('TƯƠNG LAI')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hoàn thành' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Tiếp tục Chặng 5' })).toBeEnabled()
  })

  it('tối thiểu 4/10 (nhân vật + phương án B, không mở thẻ); thẻ đã mở không mở lại được', async () => {
    const user = renderApp()
    await reachStage4(user)
    await user.click(within(screen.getByRole('group', { name: 'HÃY CHỌN THẺ NHÂN VẬT' })).getAllByRole('radio')[3])
    await user.click(within(screen.getByRole('group', { name: 'BỎ PHIẾU PHƯƠNG ÁN HÀNH ĐỘNG' })).getAllByRole('radio')[1])
    await user.click(screen.getByRole('button', { name: 'Hoàn thành' }))
    const result = screen.getByRole('region', { name: 'Kết quả Chặng 4' })
    expect(result).toHaveTextContent('Điểm số: 4/10 điểm')
    expect(result).toHaveTextContent('Chọn thẻ nhân vật2/2')
    expect(result).toHaveTextContent('Mở thẻ hồ sơ khẩn cấp0/3')
    expect(result).toHaveTextContent('Bỏ phiếu phương án hành động2/5')
  })

  it('Chặng 5 không hiện điểm; tổng điểm toàn hành trình chỉ gồm bốn chặng đầu', async () => {
    const user = renderApp()
    await reachStage4(user)
    await user.click(within(screen.getByRole('group', { name: 'HÃY CHỌN THẺ NHÂN VẬT' })).getAllByRole('radio')[0])
    await user.click(within(screen.getByRole('group', { name: 'BỎ PHIẾU PHƯƠNG ÁN HÀNH ĐỘNG' })).getAllByRole('radio')[2])
    await user.click(screen.getByRole('button', { name: 'Hoàn thành' }))
    // 20 (Chặng 1) + 0 (Chặng 2) + điểm Chặng 3 (đáp án đầu tiên) + 2 + 5 (Chặng 4)
    expect(screen.getByRole('region', { name: 'Kết quả Chặng 4' })).toHaveTextContent(/Tổng điểm hiện tại: [\d,]+\/100/)
    await continueToStage(user, 5)
    expect(screen.getByText('Tạo thẻ', { selector: '.stage__points' })).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Kết quả Chặng 5' })).not.toBeInTheDocument()
  })
})
