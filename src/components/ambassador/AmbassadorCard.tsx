import type { Ref } from 'react'
import { imageUrl } from '../../config/assets'
import { CARD_TEXT } from '../../content/stage5'
import { CIPHER_CODE } from '../../game/cipher'
import { getCardMessage } from '../../game/ambassador'
import { formatPoints, type HalfPoints } from '../../game/scoring/points'
import { MAX_TOTAL_POINTS } from '../../game/scoring/total'
import type { StudentInfo } from '../../game/types'
import { normalizeWhitespace } from '../../game/wordCount'

export const CARD_DESIGN_WIDTH = 820

interface AmbassadorCardProps {
  student: StudentInfo
  total: HalfPoints
  action: string
  avatarUrl: string | null
  issuedAt: string
  cardRef?: Ref<HTMLDivElement>
}

// Thẻ Đại sứ Di sản số: bố cục theo tài liệu nguồn. Rộng cố định (CARD_DESIGN_WIDTH) để xuất file giống hệt
// trên mọi kích thước màn hình; chiều cao tự giãn theo nội dung nên không cắt chữ.
export function AmbassadorCard({ student, total, action, avatarUrl, issuedAt, cardRef }: AmbassadorCardProps) {
  return (
    <div ref={cardRef} className="acard" style={{ width: CARD_DESIGN_WIDTH }}>
      <div className="acard__frame">
        <p className="acard__title">{CARD_TEXT.title}</p>
        <p className="acard__subtitle">{CARD_TEXT.subtitle}</p>
        <p className="acard__awarded">{CARD_TEXT.awardedTo}</p>

        <div className="acard__who">
          <div className="acard__portrait">
            <img src={avatarUrl ?? imageUrl('portraitDefault')} alt="Ảnh chân dung" />
          </div>
          <div className="acard__identity">
            <p className="acard__name">{student.name}</p>
            <p className="acard__line">
              <span className="acard__label">{CARD_TEXT.classLabel}</span> {student.className}
            </p>
            <p className="acard__line">
              <span className="acard__label">{CARD_TEXT.schoolLabel}</span> {student.school}
            </p>
          </div>
        </div>

        <p className="acard__completed">{CARD_TEXT.completed}</p>
        <p className="acard__code">{CIPHER_CODE}</p>

        <div className="acard__contribution">
          <p className="acard__label">{CARD_TEXT.contribution}</p>
          <p className="acard__action">{normalizeWhitespace(action)}</p>
        </div>

        <p className="acard__score">
          {CARD_TEXT.score}{' '}
          <strong>
            {formatPoints(total)}/{MAX_TOTAL_POINTS}
          </strong>
        </p>
        <p className="acard__message">{getCardMessage(total, student.name)}</p>

        <div className="acard__footer">
          <p className="acard__date">
            <span className="acard__label">{CARD_TEXT.issuedDate}:</span> {issuedAt}
          </p>
          <div className="acard__teacher">
            <p className="acard__label">{CARD_TEXT.teacherLabel}</p>
            <p className="acard__teacher-name">{CARD_TEXT.teacherName}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
