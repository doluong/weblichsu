import { imageFile, imageRatio, imageUrl, type ImageKey } from '../../config/assets'

interface ImageSlotProps {
  imageKey: ImageKey
  alt: string
  className?: string
  // Dùng 'div' khi ảnh nằm trong nút (không hợp lệ đặt figure trong button).
  as?: 'figure' | 'div'
}

// Vị trí ảnh dùng file giữ chỗ riêng. Chú thích tên file chỉ hiện ở chế độ phát triển.
export function ImageSlot({ imageKey, alt, className = '', as = 'figure' }: ImageSlotProps) {
  const Wrapper = as
  const Caption = as === 'figure' ? 'figcaption' : 'span'
  return (
    <Wrapper className={`image-slot ${className}`.trim()} style={{ aspectRatio: imageRatio(imageKey) }}>
      <img src={imageUrl(imageKey)} alt={alt} loading="lazy" decoding="async" />
      {import.meta.env.DEV && (
        <Caption className="image-slot__dev" aria-hidden="true">
          Tệp ảnh: {imageFile(imageKey)}
        </Caption>
      )}
    </Wrapper>
  )
}
