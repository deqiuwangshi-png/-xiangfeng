'use client';

import { useRef } from 'react';
import { toast } from 'sonner';
import { UploadCloud, AlertCircle } from '@/components/icons';
import FileList from './FileList';
import type { UploadedFile } from '@/types/feedback';

interface FileUploaderProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[] | ((prevFiles: UploadedFile[]) => UploadedFile[])) => void;
}

/**
 * 支持的文件扩展名
 */
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.md', '.pdf'];

/**
 * 最大附件数量
 */
const MAX_FILE_COUNT = 5;

/**
 * 验证文件类型
 *
 * @param file 待验证文件
 * @returns 是否通过验证
 */
const validateFileType = (file: File): boolean => {
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  return ALLOWED_EXTENSIONS.includes(fileExtension);
};

/**
 * 生成唯一ID
 *
 * @returns 唯一标识符
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

/**
 * 文件上传组件
 * 处理文件选择、验证，文件仅在提交时才上传至飞书
 * 支持卡片式展示待上传文件，可取消选择
 *
 * @param files 当前文件列表
 * @param onFilesChange 文件列表变化回调
 */
export default function FileUploader({ files, onFilesChange }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 验证文件大小
   *
   * @param file 待验证文件
   * @returns 是否通过验证
   */
  const validateFileSize = (file: File): boolean => {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    return file.size <= MAX_SIZE;
  };

  /**
   * 显示错误提示
   * 使用 sonner toast 统一提示样式
   *
   * @param message 错误消息
   */
  const showErrorToast = (message: string) => {
    toast.error(message, {
      icon: <AlertCircle className="w-4 h-4 text-xf-error" />,
      duration: 4000,
    });
  };

  /**
   * 处理文件选择事件
   * 仅验证文件并添加到列表，不上传
   * 验证错误使用 toast 提示，不添加到文件列表
   *
   * @param e 文件选择事件
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // 检查是否超过数量限制
    if (files.length + selectedFiles.length > MAX_FILE_COUNT) {
      showErrorToast(`最多只能上传 ${MAX_FILE_COUNT} 个附件，当前已有 ${files.length} 个`);
      // 清空input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    selectedFiles.forEach((file) => {
      // 验证文件类型
      if (!validateFileType(file)) {
        showErrorToast(`「${file.name}」格式不支持，仅接受图片(PNG/JPG/JPEG/GIF/WEBP)和文档(MD/PDF)`);
        return;
      }

      // 验证文件大小
      if (!validateFileSize(file)) {
        showErrorToast(`「${file.name}」大小超过10MB限制`);
        return;
      }

      // 添加到列表，状态为待上传
      const newFile: UploadedFile = {
        id: generateId(),
        file,
        status: 'pending',
      };
      onFilesChange((prevFiles: UploadedFile[]) => [...prevFiles, newFile]);
    });

    // 清空input以便重复选择相同文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * 移除指定索引的文件
   *
   * @param index 文件索引
   */
  const handleRemoveFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-xf-dark mb-2">
        附件上传（可选）
        <span className="text-xs text-xf-primary ml-2">
          {files.length}/{MAX_FILE_COUNT}
        </span>
      </label>
      <div className="upload-area border-2 border-dashed border-xf-surface bg-xf-light/50 rounded-xl p-6 transition-all">
        {files.length === 0 ? (
          <div
            className="text-center cursor-pointer hover:border-xf-primary hover:bg-xf-primary/5 transition-all -m-6 p-6"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="w-8 h-8 text-xf-primary mx-auto mb-2" />
            <p className="text-sm font-medium text-xf-dark">点击或拖拽上传</p>
            <p className="text-xs text-xf-primary">支持 PNG, JPG, JPEG, GIF, WEBP, MD, PDF 格式，最大10MB</p>
          </div>
        ) : (
          <div className="space-y-4">
            <FileList files={files} onRemove={handleRemoveFile} />
            {files.length < MAX_FILE_COUNT && (
              <div
                className="text-center cursor-pointer py-4 border-t border-dashed border-xf-surface hover:bg-xf-primary/5 transition-all rounded-lg"
                onClick={() => fileInputRef.current?.click()}
              >
                <p className="text-sm text-xf-primary">+ 继续添加文件</p>
              </div>
            )}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept=".png,.jpg,.jpeg,.gif,.webp,.md,.pdf"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
}
