import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticleReportsForAdmin, reviewArticleReportStatus, type ReportReviewStatus } from '@/lib/admin/reportActions'

interface ReportPageProps {
  searchParams: Promise<{
    status?: string
  }>
}

const STATUS_OPTIONS: ReportReviewStatus[] = ['pending', 'processing', 'resolved', 'dismissed']

const STATUS_LABEL: Record<ReportReviewStatus, string> = {
  pending: '待处理',
  processing: '处理中',
  resolved: '已确认',
  dismissed: '已驳回',
}

export default async function AdminReportsPage({ searchParams }: ReportPageProps) {
  const params = await searchParams
  const currentStatus = STATUS_OPTIONS.includes(params.status as ReportReviewStatus)
    ? (params.status as ReportReviewStatus)
    : undefined

  const result = await getArticleReportsForAdmin(currentStatus)

  async function submitReviewAction(formData: FormData) {
    'use server'
    const reportId = String(formData.get('reportId') || '')
    const nextStatus = String(formData.get('status') || '') as ReportReviewStatus
    await reviewArticleReportStatus(reportId, nextStatus)
  }

  if (!result.success) {
    notFound()
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-xf-dark">举报管理</h1>
        <div className="flex items-center gap-2 text-sm">
          <Link href="/admin/reports" className={`px-3 py-1.5 rounded-md border ${!currentStatus ? 'bg-xf-primary text-white border-xf-primary' : 'border-xf-bg/70 text-xf-medium'}`}>全部</Link>
          <Link href="/admin/reports?status=pending" className={`px-3 py-1.5 rounded-md border ${currentStatus === 'pending' ? 'bg-xf-primary text-white border-xf-primary' : 'border-xf-bg/70 text-xf-medium'}`}>待处理</Link>
          <Link href="/admin/reports?status=processing" className={`px-3 py-1.5 rounded-md border ${currentStatus === 'processing' ? 'bg-xf-primary text-white border-xf-primary' : 'border-xf-bg/70 text-xf-medium'}`}>处理中</Link>
          <Link href="/admin/reports?status=resolved" className={`px-3 py-1.5 rounded-md border ${currentStatus === 'resolved' ? 'bg-xf-primary text-white border-xf-primary' : 'border-xf-bg/70 text-xf-medium'}`}>已确认</Link>
          <Link href="/admin/reports?status=dismissed" className={`px-3 py-1.5 rounded-md border ${currentStatus === 'dismissed' ? 'bg-xf-primary text-white border-xf-primary' : 'border-xf-bg/70 text-xf-medium'}`}>已驳回</Link>
        </div>
      </div>

      {result.data && result.data.length > 0 ? (
        <div className="space-y-3">
          {result.data.map((item) => (
            <article key={item.id} className="rounded-xl border border-xf-bg/60 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="text-sm text-xf-medium">
                  举报人：<span className="text-xf-dark font-medium">{item.reporterName}</span>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-xf-bg/50 text-xf-medium">
                  {STATUS_LABEL[item.status]}
                </span>
              </div>

              <h2 className="text-base font-semibold text-xf-dark mb-1">{item.articleTitle}</h2>
              <p className="text-sm text-xf-medium mb-1">类型：{item.type}</p>
              <p className="text-sm text-xf-medium mb-3">
                说明：{item.reason?.trim() || '（无补充说明）'}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-xf-medium">
                  举报时间：{new Date(item.createdAt).toLocaleString('zh-CN')}
                </div>
                <form action={submitReviewAction} className="flex items-center gap-2">
                  <input type="hidden" name="reportId" value={item.id} />
                  <select
                    name="status"
                    defaultValue={item.status}
                    className="h-9 px-2 rounded-md border border-xf-bg/70 text-sm"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABEL[status]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="h-9 px-3 rounded-md bg-xf-primary text-white text-sm hover:opacity-90"
                  >
                    更新状态
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-xf-bg/60 bg-white p-8 text-center text-xf-medium">
          暂无举报数据
        </div>
      )}
    </main>
  )
}

