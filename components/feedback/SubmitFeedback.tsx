'use client';

import { useState } from 'react';
import { Bug, Lightbulb, Palette, HelpCircle, Send, Lock, UploadCloud, File, X, ChevronDown, Edit3 } from 'lucide-react';
import { submitFeedback } from '@/lib/feedback/feedbackActions';

type FeedbackType = 'bug' | 'suggestion' | 'ui' | 'other';

interface SubmitFeedbackProps {
  onSubmit: (trackingId: string) => void;
}

const feedbackTypes = [
  { id: 'bug' as FeedbackType, icon: Bug, label: '问题反馈', desc: '功能异常/错误', color: 'text-xf-error' },
  { id: 'suggestion' as FeedbackType, icon: Lightbulb, label: '功能建议', desc: '新功能/改进', color: 'text-xf-warning' },
  { id: 'ui' as FeedbackType, icon: Palette, label: '界面优化', desc: '视觉/交互', color: 'text-xf-info' },
  { id: 'other' as FeedbackType, icon: HelpCircle, label: '其他反馈', desc: '其他问题', color: 'text-xf-primary' },
];

export default function SubmitFeedback({ onSubmit }: SubmitFeedbackProps) {
  const [selectedType, setSelectedType] = useState<FeedbackType>('bug');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await submitFeedback({
        type: selectedType,
        title,
        description,
        contactEmail: contactEmail || undefined,
      });

      if (result.success && result.trackingId) {
        onSubmit(result.trackingId);
        setTitle('');
        setDescription('');
        setContactEmail('');
        setUploadedFiles([]);
      }
    } catch (error) {
      console.error('提交反馈失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-4">
        <Edit3 className="w-6 h-6 text-xf-primary mr-3" />
        <h2 className="text-xl font-serif text-xf-accent font-bold">
          提交新反馈
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-xf-dark mb-3">
            反馈类型 <span className="text-xf-error">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {feedbackTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`feedback-type-option flex flex-col items-center text-center cursor-pointer transition-all border-2 rounded-xl p-4 pb-2 ${
                    selectedType === type.id
                      ? 'border-xf-accent bg-linear-to-br from-xf-accent/10 to-xf-primary/10 shadow-elevated'
                      : 'border-xf-surface/50 bg-xf-light/50 hover:border-xf-primary hover:bg-xf-primary/5 hover:-translate-y-0.5'
                  }`}
              >
                <type.icon className={`w-6 h-6 mb-2 ${type.color}`} />
                <div className="font-medium text-sm">{type.label}</div>
                <div className="text-[11px] text-xf-primary mt-1 leading-tight">
                  {type.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

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
          <div className="text-right text-xs text-xf-primary mt-1">
            支持 Markdown 语法
          </div>
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
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-xf-dark mb-2">
                  联系方式（可选）
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-xf-bg/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-xf-primary/20 focus:border-xf-primary focus:shadow-glow transition-all"
                  placeholder="邮箱 / 手机号"
                />
                <p className="text-xs text-xf-primary mt-2 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  仅用于跟进反馈
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-xf-dark mb-2">
                  附件上传（可选）
                </label>
                <div className="upload-area border-2 border-dashed border-xf-surface bg-xf-light/50 rounded-xl p-6 text-center cursor-pointer hover:border-xf-primary hover:bg-xf-primary/5 transition-all">
                  <UploadCloud className="w-8 h-8 text-xf-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-xf-dark">点击或拖拽</p>
                  <p className="text-xs text-xf-primary">图片/文档，最大10MB</p>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                  />
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white border border-xf-bg/60 rounded-xl"
                      >
                        <div className="flex items-center">
                          <File className="w-5 h-5 text-xf-primary mr-3" />
                          <div>
                            <div className="font-medium text-sm">{file.name}</div>
                            <div className="text-xs text-xf-primary">
                              {(file.size / 1024).toFixed(1)} KB
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-xf-primary hover:text-xf-error"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-xf-accent text-white font-medium rounded-xl transition-all duration-300 shadow-soft hover:shadow-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? '提交中...' : '提交反馈'}
          </button>
        </div>
      </form>
    </div>
  );
}
