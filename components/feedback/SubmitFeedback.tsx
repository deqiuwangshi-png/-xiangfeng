'use client';

import { Edit3 } from '@/components/icons';
import { useFeedbackForm } from '@/components/feedback/hooks/useFeedbackForm';
import TypeSelector from './submit/TypeSelector';
import FileUploader from './submit/FileUploader';
import SubmitBtn from './submit/SubmitBtn';

interface SubmitFeedbackProps {
  onSubmit: (trackingId: string) => void;
}

/**
 * 提交反馈组件
 * 纯视图组件，逻辑由useFeedbackForm Hook管理
 *
 * @param onSubmit 提交成功回调，接收追踪ID
 */
export default function SubmitFeedback({ onSubmit }: SubmitFeedbackProps) {
  const {
    selectedType,
    setSelectedType,
    description,
    setDescription,
    uploadedFiles,
    setUploadedFiles,
    isSubmitting,
    submitError,
    handleSubmit,
  } = useFeedbackForm({ onSubmitSuccess: onSubmit });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-3">
        <Edit3 className="w-5 h-5 text-xf-primary mr-2" />
        <h2 className="text-lg font-serif text-xf-accent font-bold">
          提交新反馈
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TypeSelector selectedType={selectedType} onChange={setSelectedType} />

        <div>
          <label htmlFor="feedbackDescription" className="block text-sm font-medium text-xf-dark mb-1.5">
            详细描述 <span className="text-xf-error">*</span>
          </label>
          <textarea
            id="feedbackDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            maxLength={5000}
            className="w-full px-3 py-2.5 bg-white border border-xf-bg/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-xf-primary/20 focus:border-xf-primary transition-all resize-none text-sm"
            placeholder="请详细描述… 包括使用场景、重现步骤等"
            required
          />
        </div>

        <div className="border-t border-xf-bg/40 pt-4">
          <FileUploader files={uploadedFiles} onFilesChange={setUploadedFiles} />
        </div>

        {submitError && (
          <div className="p-2.5 bg-xf-error/10 border border-xf-error/20 rounded-lg text-xf-error text-sm">
            {submitError}
          </div>
        )}

        <SubmitBtn isSubmitting={isSubmitting} />
      </form>
    </div>
  );
}
