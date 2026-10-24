import type { Stage4EvidenceId, Stage4RoleId, Stage4VoteId } from '../game/scoring/stage4'

export const STAGE4_ROLE_LABELS: Readonly<Record<Stage4RoleId, string>> = {
  historian: 'Nhà Sử học',
  conservator: 'Chuyên gia Bảo tồn',
  community: 'Đại diện Cộng đồng Địa phương',
  tourism: 'Chuyên gia Du lịch & Kinh tế',
}

export const STAGE4_EVIDENCE: readonly { id: Stage4EvidenceId; title: string; content: string }[] = [
  {
    id: 'technical',
    title: 'Thẻ 1 - Báo cáo Kỹ thuật',
    content: 'Mức độ sạt lở 45%, kết cấu gạch/đá bị phong hóa nghiêm trọng.',
  },
  {
    id: 'economy',
    title: 'Thẻ 2 - Báo cáo Kinh tế & Du lịch',
    content: 'Lượng khách tăng 200%/năm, mang lại 60% thu nhập cho cư dân địa phương.',
  },
  {
    id: 'community',
    title: 'Thẻ 3 - Khảo sát Cộng đồng',
    content: '80% người dân địa phương coi đây là không gian tâm linh thiêng liêng không thể chia cắt.',
  },
]

// Chỉ hiển thị nội dung dự thảo; số điểm của từng phương án không được tiết lộ.
export const STAGE4_VOTES: readonly { id: Stage4VoteId; title: string; description: string }[] = [
  {
    id: 'A',
    title: 'Phương án A (Bảo tồn nguyên trạng)',
    description: 'Đóng cửa di tích với du khách, chỉ cho phép các nhà khoa học vào nghiên cứu.',
  },
  {
    id: 'B',
    title: 'Phương án B (Phục dựng toàn diện & Hiện đại hóa)',
    description: 'Dùng vật liệu mới xây dựng lại các phần đã sụp đổ để đón tối đa du khách.',
  },
  {
    id: 'C',
    title: 'Phương án C (Bảo tồn thích ứng & Du lịch có kiểm soát)',
    description:
      'Gia cố các khu vực nguy hiểm, giới hạn lượt khách theo giờ, trích 30% doanh thu du lịch để trùng tu và chia sẻ lợi ích với cộng đồng.',
  },
]
