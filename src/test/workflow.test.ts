import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'
import { describe, expect, it } from 'vitest'

interface Step {
  uses?: string
  run?: string
  with?: Record<string, unknown>
}
interface Job {
  needs?: string
  steps: Step[]
}
interface Workflow {
  on: { push: { branches: string[] }; workflow_dispatch: unknown }
  permissions: Record<string, string>
  jobs: Record<string, Job>
}

const workflow = parse(readFileSync(join(process.cwd(), '.github', 'workflows', 'deploy.yml'), 'utf8')) as Workflow

describe('workflow triển khai GitHub Pages', () => {
  it('chạy khi push lên master/main và cho chạy thủ công', () => {
    expect(workflow.on.push.branches).toEqual(expect.arrayContaining(['master', 'main']))
    expect(workflow.on).toHaveProperty('workflow_dispatch')
  })

  it('có quyền tối thiểu cho Pages', () => {
    expect(workflow.permissions).toEqual({ contents: 'read', pages: 'write', 'id-token': 'write' })
  })

  it('job build: cài bằng npm ci, kiểm tra kiểu, test, build, tải thư mục dist', () => {
    const steps = workflow.jobs.build.steps
    const runs = steps.map((step) => step.run).filter(Boolean)
    expect(runs).toEqual(['npm ci', 'npm run typecheck', 'npm test', 'npm run build'])
    const upload = steps.find((step) => step.uses?.startsWith('actions/upload-pages-artifact'))
    expect(upload?.with?.path).toBe('dist')
  })

  it('job deploy phụ thuộc build và dùng actions/deploy-pages', () => {
    expect(workflow.jobs.deploy.needs).toBe('build')
    expect(workflow.jobs.deploy.steps.some((step) => step.uses?.startsWith('actions/deploy-pages'))).toBe(true)
  })

  it('không dùng khóa bí mật hay dịch vụ trả phí', () => {
    const text = readFileSync(join(process.cwd(), '.github', 'workflows', 'deploy.yml'), 'utf8')
    expect(text).not.toMatch(/secrets\./)
  })
})
