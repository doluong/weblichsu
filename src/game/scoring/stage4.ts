import { toHalf, type HalfPoints } from './points'

export const STAGE4_ROLE_IDS = ['historian', 'conservator', 'community', 'tourism'] as const
export const STAGE4_EVIDENCE_IDS = ['technical', 'economy', 'community'] as const
export const STAGE4_VOTE_IDS = ['A', 'B', 'C'] as const

export type Stage4RoleId = (typeof STAGE4_ROLE_IDS)[number]
export type Stage4EvidenceId = (typeof STAGE4_EVIDENCE_IDS)[number]
export type Stage4VoteId = (typeof STAGE4_VOTE_IDS)[number]

export const STAGE4_ROLE_POINTS = 2
export const STAGE4_EVIDENCE_POINTS_EACH = 1
export const STAGE4_VOTE_POINTS: Readonly<Record<Stage4VoteId, number>> = { A: 3, B: 2, C: 5 }

export interface Stage4Input {
  roleId: string | null
  openedEvidenceIds: readonly string[]
  voteId: string | null
}

export interface Stage4Score {
  role: HalfPoints
  evidence: HalfPoints
  vote: HalfPoints
  total: HalfPoints
}

function isRole(id: string | null): id is Stage4RoleId {
  return id !== null && (STAGE4_ROLE_IDS as readonly string[]).includes(id)
}

function isVote(id: string | null): id is Stage4VoteId {
  return id !== null && (STAGE4_VOTE_IDS as readonly string[]).includes(id)
}

// Chọn nhân vật: 2 điểm (nhân vật nào cũng như nhau). Mỗi thẻ chứng cứ được mở: 1 điểm, không cộng lặp.
// Bỏ phiếu: A = 3, B = 2, C = 5. Tối đa 2 + 3 + 5 = 10.
export function scoreStage4(input: Stage4Input): Stage4Score {
  const role = isRole(input.roleId) ? toHalf(STAGE4_ROLE_POINTS) : 0
  const uniqueEvidence = new Set(input.openedEvidenceIds.filter((id) => (STAGE4_EVIDENCE_IDS as readonly string[]).includes(id)))
  const evidence = uniqueEvidence.size * toHalf(STAGE4_EVIDENCE_POINTS_EACH)
  const vote = isVote(input.voteId) ? toHalf(STAGE4_VOTE_POINTS[input.voteId]) : 0
  return { role, evidence, vote, total: role + evidence + vote }
}

// B17: phải chọn nhân vật và phương án bỏ phiếu mới hoàn tất được chặng.
export function canCompleteStage4(roleId: string | null, voteId: string | null): boolean {
  return isRole(roleId) && isVote(voteId)
}
