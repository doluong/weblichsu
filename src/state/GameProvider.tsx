import { useMemo, useReducer, type ReactNode } from 'react'
import { createInitialState, gameReducer } from '../game/reducer'
import { GameContext } from './gameContext'

// Trạng thái trò chơi chỉ nằm trong React state (bộ nhớ), không lưu qua lần tải trang.
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState)
  const value = useMemo(() => ({ state, dispatch }), [state])
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
