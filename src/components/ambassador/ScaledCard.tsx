import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CARD_DESIGN_WIDTH } from './AmbassadorCard'

// Thu nhỏ thẻ (chỉ bằng CSS transform) để vừa màn hình hẹp khi xem trước. Phần tử thẻ bên trong vẫn có
// kích thước thật, nên ảnh xuất ra không phụ thuộc kích thước màn hình.
export function ScaledCard({ children }: { children: ReactNode }) {
  const viewport = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [height, setHeight] = useState<number | undefined>(undefined)

  useEffect(() => {
    const viewportEl = viewport.current
    const innerEl = inner.current
    if (!viewportEl || !innerEl || typeof ResizeObserver === 'undefined') return
    const update = () => {
      const next = Math.min(1, viewportEl.clientWidth / CARD_DESIGN_WIDTH)
      setScale(next)
      setHeight(innerEl.offsetHeight * next)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(viewportEl)
    observer.observe(innerEl)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={viewport} className="scaled-card" style={height === undefined ? undefined : { height }}>
      <div ref={inner} className="scaled-card__inner" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  )
}
