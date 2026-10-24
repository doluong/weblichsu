import type { ImageKey } from '../config/assets'

export interface ChoiceOption {
  id: string
  label: string
}

// ---------- Phòng 1: Tín ngưỡng & Tôn giáo ----------
// Dùng "Hindu giáo" thống nhất (B14).
export const ROOM1_CABINETS: readonly { id: string; label: string }[] = [
  { id: 'indigenous', label: 'Tín ngưỡng bản địa' },
  { id: 'hindu', label: 'Hindu giáo' },
  { id: 'buddhist', label: 'Phật giáo' },
  { id: 'islamic', label: 'Hồi giáo' },
]

export interface Room1Artifact {
  id: string
  imageKey: ImageKey
  // Mô tả hiện vật nguyên văn từ tài liệu. Hiển thị cùng ảnh (xem OPEN_QUESTIONS K1).
  description: string
  correctCabinetId: string
}

export const ROOM1_ARTIFACTS: readonly Room1Artifact[] = [
  {
    id: 'artifact-indigenous',
    imageKey: 'artifactIndigenousBeliefs',
    description: 'Bức ảnh chạm khắc hình hoa văn sóng nước, thuyền đua, chim Lạc',
    correctCabinetId: 'indigenous',
  },
  {
    id: 'artifact-shiva',
    imageKey: 'artifactShiva',
    description: 'Tượng đá chạm khắc thần Shiva đang múa',
    correctCabinetId: 'hindu',
  },
  {
    id: 'artifact-stupa',
    imageKey: 'artifactBuddhistStupa',
    description: 'Hình ảnh các bảo tháp (Stupa) hình chuông úp',
    correctCabinetId: 'buddhist',
  },
  {
    id: 'artifact-mosque',
    imageKey: 'artifactIslamicMosque',
    description: 'Hình ảnh Thánh đường với mái vòm hành tây, tháp nhọn (Minaret)',
    correctCabinetId: 'islamic',
  },
]

// ---------- Phòng 2: Chữ viết & Văn học ----------
export interface Room2Blank {
  id: string
  marker: string
  options: readonly ChoiceOption[]
  correctOptionId: string
}

export const ROOM2_BLANKS: readonly Room2Blank[] = [
  {
    id: 'blank-1',
    marker: '[..1..]',
    options: [
      { id: 'A', label: 'Trung Quốc' },
      { id: 'B', label: 'Ấn Độ' },
      { id: 'C', label: 'Ả Rập' },
      { id: 'D', label: 'Ai Cập' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'blank-2',
    marker: '[..2..]',
    options: [
      { id: 'A', label: 'Khơ me' },
      { id: 'B', label: 'Hán' },
      { id: 'C', label: 'La-tông' },
      { id: 'D', label: 'Ả Rập' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'blank-3',
    marker: '[..3..]',
    options: [
      { id: 'A', label: 'Sử thi Mahabharata' },
      { id: 'B', label: 'Sử thi Ramayana' },
      { id: 'C', label: 'Thần thoại Hy Lạp' },
      { id: 'D', label: 'Kinh Vệ-đà' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'blank-4',
    marker: '[..4..]',
    options: [
      { id: 'A', label: 'Bình Ngô đại cáo (Nguyễn Trãi)' },
      { id: 'B', label: 'Truyện Kiều (Nguyễn Du)' },
      { id: 'C', label: 'Truyền kỳ mạn lục (Nguyễn Dữ)' },
      { id: 'D', label: 'Hịch tướng sĩ (Trần Quốc Tuấn)' },
    ],
    correctOptionId: 'B',
  },
]

export type PassageSegment = { type: 'text'; value: string } | { type: 'blank'; blankId: string }

// Hai tư liệu nguyên văn; chỗ trống đánh dấu bằng blankId.
export const ROOM2_PASSAGES: readonly { id: string; title: string; segments: readonly PassageSegment[] }[] = [
  {
    id: 'passage-1',
    title: 'Tư liệu 1',
    segments: [
      { type: 'text', value: 'Trên cơ sở tiếp thu hệ thống chữ sáng tạo từ ' },
      { type: 'blank', blankId: 'blank-1' },
      {
        type: 'text',
        value:
          ' (chữ Phạn - Sanskrit), cư dân Đông Nam Á đã cải biến để tạo ra chữ viết riêng cho dân tộc mình. Tiêu biểu là chữ cổ của người ',
      },
      { type: 'blank', blankId: 'blank-2' },
      { type: 'text', value: ' (thế kỷ VI), chữ cổ Chăm (thế kỷ IV), chữ Môn và chữ Thái cổ.' },
    ],
  },
  {
    id: 'passage-2',
    title: 'Tư liệu 2',
    segments: [
      {
        type: 'text',
        value:
          'Trường ca Riêm-ke (Campuchia) và Rama-khiên (Thái Lan) là các tác phẩm văn học dân gian nổi tiếng được phóng tác và phát triển dựa trên bộ sử thi ',
      },
      { type: 'blank', blankId: 'blank-3' },
      { type: 'text', value: ' vĩ đại của Ấn Độ. ' },
      { type: 'blank', blankId: 'blank-4' },
      {
        type: 'text',
        value:
          ' là tác phẩm đánh dấu bước phát triển đỉnh cao của văn học chữ Nôm tại Việt Nam, phản ánh đậm nét tâm hồn và giá trị nhân văn Đông Nam Á',
      },
    ],
  },
]

// ---------- Phòng 3: Kiến trúc & Điêu khắc ----------
export interface Room3Question {
  id: string
  imageKey: ImageKey
  buildingName: string
  question: string
  options: readonly ChoiceOption[]
  correctOptionId: string
}

// Tên "Bô-rô-bu-đua" thống nhất trên giao diện (E1.5), kể cả trong câu hỏi.
export const ROOM3_QUESTIONS: readonly Room3Question[] = [
  {
    id: 'q-angkor',
    imageKey: 'architectureAngkorWat',
    buildingName: 'Đền Angkor Wat (Campuchia)',
    question:
      'Quan sát kiến trúc đền Angkor Wat, đặc điểm nổi bật thể hiện sự kết hợp giữa kiến trúc Hindu giáo và tài năng chạm khắc của người Khmer cổ là gì?',
    options: [
      { id: 'A', label: 'Các cột đá tròn lớn dựng theo phong cách La Mã cổ đại.' },
      { id: 'B', label: 'Cụm 5 tháp núi Mê-ru và phù điêu vũ nữ Apsara trên tường.' },
      { id: 'C', label: 'Mái vòm tròn khổng lồ không cần hệ cột đá chống đỡ.' },
      { id: 'D', label: 'Toàn bộ khung công trình được dựng bằng gỗ gụ quý hiếm.' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'q-borobudur',
    imageKey: 'architectureBorobudur',
    buildingName: 'Quần thể Bô-rô-bu-đua (Indonesia)',
    question:
      'Ngôi đền Bô-rô-bu-đua ở đảo Java (Indonesia) được xây dựng theo mô hình kiến trúc Phật giáo nào sau đây?',
    options: [
      { id: 'A', label: 'Đồ hình Mandala bằng đá gồm các tầng vuông và tháp úp.' },
      { id: 'B', label: 'Tòa tháp vút cao thuôn nhọn theo phong cách Gô-tích.' },
      { id: 'C', label: 'Cung điện hoàng gia lợp mái bằng gỗ sơn son thếp vàng.' },
      { id: 'D', label: 'Ngôi chùa một cột bằng đá dựng nổi trên mặt hồ sen.' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'q-ayutthaya',
    imageKey: 'architectureAyutthaya',
    buildingName: 'Cố đô Ayutthaya (Thái Lan)',
    question:
      'Quần thể di tích Cố đô Ayutthaya (Thái Lan) mang nét đặc trưng nào của kiến trúc Phật giáo và hoàng gia Xiêm cổ?',
    options: [
      { id: 'A', label: 'Các tháp đá mỏng dẹt đứng độc lập trên đỉnh núi cao.' },
      { id: 'B', label: 'Các ngọn tháp gạch nung Prang hình búp sen vút cao.' },
      { id: 'C', label: 'Các ngôi đền gạch mỏng sơn phủ màu xanh lam rực rỡ.' },
      { id: 'D', label: 'Các khu nhà vòm bằng gỗ dựng nổi hoàn toàn trên biển.' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'q-my-son',
    imageKey: 'architectureMySon',
    buildingName: 'Thánh địa Mỹ Sơn (Việt Nam)',
    question:
      'Nghệ thuật kiến trúc và điêu khắc của Thánh địa Mỹ Sơn (Quảng Nam, Việt Nam) mang đặc trưng nổi bật nào của văn minh Chăm-pa?',
    options: [
      { id: 'A', label: 'Dùng vôi vữa gắn kết các khối đá xanh kích thước lớn.' },
      { id: 'B', label: 'Mài miết gạch nung đỏ xây khít không lộ mạch vữa.' },
      { id: 'C', label: 'Đục đẽo toàn bộ công trình nằm sâu trong hang động.' },
      { id: 'D', label: 'Dùng kết cấu khung gỗ với hệ mái chồng đao cong vút.' },
    ],
    correctOptionId: 'B',
  },
]

// ---------- Đáp án để chấm điểm ----------
export const STAGE3_KEYS = {
  room1: Object.fromEntries(ROOM1_ARTIFACTS.map((item) => [item.id, item.correctCabinetId])) as Record<string, string>,
  room2: Object.fromEntries(ROOM2_BLANKS.map((blank) => [blank.id, blank.correctOptionId])) as Record<string, string>,
  room3: Object.fromEntries(ROOM3_QUESTIONS.map((q) => [q.id, q.correctOptionId])) as Record<string, string>,
}
