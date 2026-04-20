'use server';

import { withAuth } from '@/lib/auth/server';
import { createClient } from '@/lib/supabase/server';
import { isValidUUID } from '../helpers/utils';
import { sanitizePlainText } from '@/lib/utils/purify';
import { COMMENT_INTERACTION_MESSAGES, COMMON_ERRORS } from '@/lib/messages';

const VALID_REPORT_TYPES = ['plagiarism', 'illegal', 'fake', 'infringement', 'other'] as const;

type ReportType = (typeof VALID_REPORT_TYPES)[number];

export interface SubmitArticleReportResult {
  success: boolean;
  error?: string;
}

function isValidReportType(type: string): type is ReportType {
  return VALID_REPORT_TYPES.includes(type as ReportType);
}

export const submitArticleReport = withAuth(
  async (
    user,
    articleId: string,
    authorId: string,
    type: string,
    reason?: string
  ): Promise<SubmitArticleReportResult> => {
    if (!isValidUUID(articleId) || !isValidUUID(authorId)) {
      return { success: false, error: '举报参数无效' };
    }

    if (!isValidReportType(type)) {
      return { success: false, error: '举报类型无效' };
    }

    if (user.id === authorId) {
      return { success: false, error: '不能举报自己的文章' };
    }

    const supabase = await createClient();

    try {
      // 双重校验：防止前端 authorId 被篡改
      const { data: article, error: articleError } = await supabase
        .from('articles')
        .select('author_id')
        .eq('id', articleId)
        .single();

      if (articleError || !article) {
        return { success: false, error: '文章不存在或已被删除' };
      }

      if (article.author_id !== authorId || article.author_id === user.id) {
        return { success: false, error: '举报条件不满足' };
      }

      const cleanedReason = reason?.trim() ? sanitizePlainText(reason.trim()).slice(0, 500) : null;

      const { error } = await supabase.from('article_reports').insert({
        article_id: articleId,
        reporter_id: user.id,
        type,
        reason: cleanedReason,
      });

      if (error) {
        // unique(article_id, reporter_id, status) 命中时提示已提交
        if (error.code === '23505') {
          return { success: false, error: '你已提交过该文章举报，请勿重复提交' };
        }
        return { success: false, error: COMMENT_INTERACTION_MESSAGES.REPORT_ERROR };
      }

      return { success: true };
    } catch (error) {
      console.error('[submitArticleReport] 举报提交失败:', error);
      return { success: false, error: COMMON_ERRORS.UNKNOWN_ERROR };
    }
  }
);

