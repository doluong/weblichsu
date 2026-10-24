type ImageDef = {
  key: string
  file: string
  location: string
  replaceWith: string
  ratio: string
}

// Mỗi vị trí ảnh có đúng một file giữ chỗ riêng. Thay ảnh thật bằng file CÙNG TÊN
// trong public/images/placeholders/ thì không cần sửa mã. Xem docs/IMAGE_ASSETS.md.
const defs = [
  {
    key: 'mysteryAngkorWat',
    file: 'mystery-angkor-wat-placeholder.jpg',
    location: 'Chặng 1 - ảnh bí ẩn 1',
    replaceWith: 'Angkor Wat (Campuchia)',
    ratio: '4 / 3',
  },
  {
    key: 'mysteryBorobudur',
    file: 'mystery-borobudur-placeholder.jpg',
    location: 'Chặng 1 - ảnh bí ẩn 2',
    replaceWith: 'Bô-rô-bu-đua (Indonesia)',
    ratio: '4 / 3',
  },
  {
    key: 'artifactIndigenousBeliefs',
    file: 'artifact-indigenous-beliefs-placeholder.jpg',
    location: 'Chặng 3 - Phòng 1 - hiện vật 1',
    replaceWith: 'Chạm khắc hoa văn sóng nước, thuyền đua, chim Lạc',
    ratio: '1 / 1',
  },
  {
    key: 'artifactShiva',
    file: 'artifact-shiva-placeholder.jpg',
    location: 'Chặng 3 - Phòng 1 - hiện vật 2',
    replaceWith: 'Tượng đá thần Shiva đang múa',
    ratio: '1 / 1',
  },
  {
    key: 'artifactBuddhistStupa',
    file: 'artifact-buddhist-stupa-placeholder.jpg',
    location: 'Chặng 3 - Phòng 1 - hiện vật 3',
    replaceWith: 'Bảo tháp (Stupa) hình chuông úp',
    ratio: '1 / 1',
  },
  {
    key: 'artifactIslamicMosque',
    file: 'artifact-islamic-mosque-placeholder.jpg',
    location: 'Chặng 3 - Phòng 1 - hiện vật 4',
    replaceWith: 'Thánh đường mái vòm hành tây, tháp nhọn Minaret',
    ratio: '1 / 1',
  },
  {
    key: 'architectureAngkorWat',
    file: 'architecture-angkor-wat-placeholder.jpg',
    location: 'Chặng 3 - Phòng 3 - công trình 1',
    replaceWith: 'Đền Angkor Wat (Campuchia)',
    ratio: '16 / 9',
  },
  {
    key: 'architectureBorobudur',
    file: 'architecture-borobudur-placeholder.jpg',
    location: 'Chặng 3 - Phòng 3 - công trình 2',
    replaceWith: 'Quần thể Bô-rô-bu-đua (Indonesia)',
    ratio: '16 / 9',
  },
  {
    key: 'architectureAyutthaya',
    file: 'architecture-ayutthaya-placeholder.jpg',
    location: 'Chặng 3 - Phòng 3 - công trình 3',
    replaceWith: 'Cố đô Ayutthaya (Thái Lan): đầu tượng Phật trong rễ cây hoặc tháp Prang',
    ratio: '16 / 9',
  },
  {
    key: 'architectureMySon',
    file: 'architecture-my-son-placeholder.jpg',
    location: 'Chặng 3 - Phòng 3 - công trình 4',
    replaceWith: 'Thánh địa Mỹ Sơn (Việt Nam)',
    ratio: '16 / 9',
  },
  {
    key: 'portraitDefault',
    file: 'portrait-default-placeholder.jpg',
    location: 'Chặng 5 - ảnh chân dung mặc định trên thẻ',
    replaceWith: 'Ảnh chân dung mặc định (không bắt buộc thay)',
    ratio: '3 / 4',
  },
  {
    key: 'museumRoomBackground',
    file: 'museum-room-background-placeholder.jpg',
    location: 'Chặng 3 - Phòng 1 - ảnh nền (tùy chọn)',
    replaceWith: 'Ảnh một góc bảo tàng (không bắt buộc)',
    ratio: '16 / 9',
  },
] as const satisfies readonly ImageDef[]

export type ImageKey = (typeof defs)[number]['key']

export const IMAGE_ASSETS: readonly ImageDef[] = defs

export const IMAGE_DIR_PATH = 'images/placeholders/'

function findImage(key: ImageKey): ImageDef {
  const found = IMAGE_ASSETS.find((image) => image.key === key)
  if (!found) throw new Error(`Unknown image key: ${key}`)
  return found
}

// Dùng BASE_URL của Vite để đường dẫn đúng khi triển khai ở /weblichsu/.
export function imageUrl(key: ImageKey): string {
  return `${import.meta.env.BASE_URL}${IMAGE_DIR_PATH}${findImage(key).file}`
}

export function imageRatio(key: ImageKey): string {
  return findImage(key).ratio
}

export function imageFile(key: ImageKey): string {
  return findImage(key).file
}
