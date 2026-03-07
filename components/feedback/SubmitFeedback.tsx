'use client';

import { Edit3, ChevronDown } from '@/components/icons';
import { useFeedbackForm } from '@/components/feedback/hooks/useFeedbackForm';
import TypeSelector from './submit/TypeSelector';
import FileUploader from './submit/FileUploader';
import ContactInput from './submit/ContactInput';
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
    title,
    setTitle,
    description,
    setDescription,
    contactEmail,
    setContactEmail,
    showAdvanced,
    setShowAdvanced,
    uploadedFiles,
    setUploadedFiles,
    isSubmitting,
    submitError,
    handleSubmit,
  } = useFeedbackForm({ onSubmitSuccess: onSubmit });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-4">
        <Edit3 className="w-6 h-6 text-xf-primary mr-3" />
        <h2 className="text-xl font-serif text-xf-accent font-bold">
          提交新反馈
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <TypeSelector selectedType={selectedType} onChange={setSelectedType} />

        <div>
          <label htmlFor="feedbackTitle" className="block text-sm font-medium text-xf-dark mb-2">
            反馈标题 <span className="text-xf-error">*</span>
          </label>
          <input
            type="text"
            id="feedbackTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-xf-bg/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-xf-primary/20 focus:border-xf-primary focus:shadow-glow transition-all"
            placeholder="例如：文章编辑器图片上传失败"
            required
          />
        </div>

        <div>
          <label htmlFor="feedbackDescription" className="block text-sm font-medium text-xf-dark mb-2">
            详细描述 <span className="text-xf-error">*</span>
          </label>
          <textarea
            id="feedbackDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-white border border-xf-bg/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-xf-primary/20 focus:border-xf-primary focus:shadow-glow transition-all resize-none"
            placeholder="请详细描述… 包括使用场景、重现步骤等"
            required
          />
        </div>

        <div className="border-t border-xf-bg/40 pt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-xf-primary hover:text-xf-accent text-sm font-medium gap-1"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            />
            高级选项（联系方式、附件）
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              showAdvanced ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
            }`}
          >
            <div className="space-y-5">
              <ContactInput value={contactEmail} onChange={setContactEmail} />
              <FileUploader files={uploadedFiles} onFilesChange={setUploadedFiles} />
            </div>
          </div>
        </div>

        {submitError && (
          <div className="p-3 bg-xf-error/10 border border-xf-error/20 rounded-xl text-xf-error text-sm">
            {submitError}
          </div>
        )}

        <SubmitBtn isSubmitting={isSubmitting} />
      </form>
    </div>
  );
}
