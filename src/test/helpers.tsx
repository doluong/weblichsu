import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { GameProvider } from '../state/GameProvider'

export type User = ReturnType<typeof userEvent.setup>

export function renderApp(): User {
  const user = userEvent.setup()
  render(
    <GameProvider>
      <App />
    </GameProvider>,
  )
  return user
}

export async function startGame(user: User): Promise<void> {
  await user.click(screen.getByRole('button', { name: 'Bắt đầu hành trình' }))
  await user.type(screen.getByLabelText('Họ và tên'), 'Nguyễn Văn A')
  await user.type(screen.getByLabelText('Lớp'), '12A1')
  await user.type(screen.getByLabelText('Trường'), 'THPT Chuyên')
  await user.click(screen.getByRole('button', { name: 'Bắt đầu Chặng 1' }))
}

export function region(name: string): HTMLElement {
  return screen.getByRole('region', { name })
}

export function inRegion(name: string) {
  return within(region(name))
}

// Làm Chặng 1: mở 1 ô mỗi ảnh và chọn đáp án đúng hoặc sai (Shwedagon).
export async function playStage1(user: User, correct: boolean): Promise<void> {
  const answers = correct
    ? ['Đền Angkor Wat (Campuchia)', 'Chùa Bô-rô-bu-đua (Indonesia)']
    : ['Chùa Shwedagon (Myanmar)', 'Chùa Shwedagon (Myanmar)']
  const images = ['Bức ảnh bí ẩn 1', 'Bức ảnh bí ẩn 2']
  for (let index = 0; index < 2; index += 1) {
    const scope = inRegion(images[index])
    await user.click(scope.getByRole('button', { name: 'Mở ô 1' }))
    await user.click(scope.getByRole('radio', { name: answers[index] }))
  }
  await user.click(screen.getByRole('button', { name: 'Hoàn thành' }))
}

export async function continueToStage(user: User, stage: number): Promise<void> {
  await user.click(screen.getByRole('button', { name: `Tiếp tục Chặng ${stage}` }))
}
