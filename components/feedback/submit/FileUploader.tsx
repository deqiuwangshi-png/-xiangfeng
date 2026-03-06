'use client';

import { useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { uploadFeedbackAttachment } from '@/lib/feedback/feedbackActions';
import FileList from './FileList';

interface UploadedFile {
  file: File;
  url?: string;
  isUploading: boolean;
  error?: string;
}

interface FileUploaderProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
}

/**
 * 文件上传组件
 * 处理文件选择、验证、上传到Supabase Storage
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
   * 添加文件到列表（标记为上传中）
   *
   * @param file 文件对象
   */
  const addFileToList = (file: File) => {
    const newFile: UploadedFile = { file, isUploading: true };
    onFilesChange([...files, newFile]);
    return newFile;
  };

  /**
   * 更新文件状态
   *
   * @param targetFile 目标文件
   * @param updates 更新的属性
   */
  const updateFileStatus = (
    targetFile: File,
    updates: Partial<UploadedFile>
  ) => {
    onFilesChange(
      files.map((item) =>
        item.file === targetFile ? { ...item, ...updates } : item
      )
    );
  };

  /**
   * 上传单个文件到Supabase Storage
   *
   * @param file 文件对象
   */
  const uploadSingleFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadFeedbackAttachment(formData);

      if (result.success && result.url) {
        updateFileStatus(file, { url: result.url, isUploading: false });
      } else {
        updateFileStatus(file, {
          isUploading: false,
          error: result.error || '上传失败',
        });
      }
    } catch {
      updateFileStatus(file, { isUploading: false, error: '上传失败' });
    }
  };

  /**
   * 处理文件选择事件
   * 验证并上传选中的文件
   *
   * @param e 文件选择事件
   */
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    for (const file of selectedFiles) {
      if (!validateFileSize(file)) {
        const oversizedFile: UploadedFile = {
          file,
          isUploading: false,
          error: '文件大小超过10MB限制',
        };
        onFilesChange([...files, oversizedFile]);
        continue;
      }

      addFileToList(file);
      await uploadSingleFile(file);
    }

    {/* 清空input以便重复选择相同文件 */}
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
      </label>
      <div
        className="upload-area border-2 border-dashed border-xf-surface bg-xf-light/50 rounded-xl p-6 text-center cursor-pointer hover:border-xf-primary hover:bg-xf-primary/5 transition-all"
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud className="w-8 h-8 text-xf-primary mx-auto mb-2" />
        <p className="text-sm font-medium text-xf-dark">点击或拖拽上传</p>
        <p className="text-xs text-xf-primary">图片/文档，最大10MB</p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
        />
      </div>

      <FileList files={files} onRemove={handleRemoveFile} />
    </div>
  );
}
