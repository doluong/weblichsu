import { imageFile, imageRatio, imageUrl, type ImageKey } from '../../config/assets'

interface ImageSlotProps {
  imageKey: ImageKey
  alt: string
  className?: string
}

// Vị trí ảnh dùng file giữ chỗ riêng. Chú thích tên file chỉ hiện ở chế độ phát triển.
export function ImageSlot({ imageKey, alt, className = '' }: ImageSlotProps) {
  return (
    <figure className={`image-slot ${className}`.trim()} style={{ aspectRatio: imageRatio(imageKey) }}>
      <img src={imageUrl(imageKey)} alt={alt} loading="lazy" decoding="async" />
      {import.meta.env.DEV && (
        <figcaption className="image-slot__dev">Ảnh giữ chỗ: {imageFile(imageKey)}</figcaption>
      )}
    </figure>
  )
}
