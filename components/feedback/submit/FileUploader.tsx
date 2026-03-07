'use client';

import { useRef, useEffect } from 'react';
import { UploadCloud } from 'lucide-react';
import { uploadFeedbackAttachment } from '@/lib/feedback/actions';
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
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 文件上传组件
 * 处理文件选择、验证、上传到飞书多维表格
 * 文件将保存到飞书 Drive
 *
 * @param files 当前文件列表
 * @param onFilesChange 文件列表变化回调
 */
export default function FileUploader({ files, onFilesChange }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

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
   * 使用函数式更新避免闭包陷阱
   *
   * @param file 文件对象
   * @returns 文件项的唯一ID
   */
  const addFileToList = (file: File): string => {
    const id = generateId();
    const newFile: UploadedFile = { id, file, isUploading: true };
    onFilesChange((prevFiles: UploadedFile[]) => [...prevFiles, newFile]);
    return id;
  };

  /**
   * 更新文件状态
   * 使用函数式更新避免闭包陷阱
   *
   * @param fileId 文件项唯一ID
   * @param updates 更新的属性
   */
  const updateFileStatus = (fileId: string, updates: Partial<UploadedFile>) => {
    onFilesChange((prevFiles: UploadedFile[]) =>
      prevFiles.map((item) => (item.id === fileId ? { ...item, ...updates } : item))
    );
  };

  /**
   * 上传单个文件到飞书
   * 使用 fileId 跟踪文件状态，避免闭包陷阱
   *
   * @param file 文件对象
   * @param fileId 文件项唯一ID
   */
  const uploadSingleFile = async (file: File, fileId: string) => {
    {/* 创建新的 AbortController 用于取消上传 */}
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const formData = new FormData();
      formData.append('file', file);

      {/* 如果请求被取消，直接返回 */}
      if (controller.signal.aborted) {
        return;
      }

      const result = await uploadFeedbackAttachment(formData);

      {/* 如果请求被取消，不更新状态 */}
      if (controller.signal.aborted) {
        return;
      }

      if (result.success && result.fileToken) {
        updateFileStatus(fileId, { fileToken: result.fileToken, isUploading: false });
      } else {
        updateFileStatus(fileId, {
          isUploading: false,
          error: result.error || '上传失败',
        });
      }
    } catch {
      {/* 如果请求被取消，不更新状态 */}
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      updateFileStatus(fileId, { isUploading: false, error: '上传失败' });
    } finally {
      {/* 清理引用 */}
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  };

  /**
   * 处理文件选择事件
   * 验证并上传选中的文件
   * 使用 Promise.all 实现并行上传，避免顺序等待
   *
   * @param e 文件选择事件
   */
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // 收集所有上传任务
    const uploadTasks = selectedFiles.map(async (file) => {
      // 验证文件类型
      if (!validateFileType(file)) {
        const invalidTypeFile: UploadedFile = {
          id: generateId(),
          file,
          isUploading: false,
          error: '仅支持图片(PNG/JPG/JPEG/GIF/WEBP)和文档(MD/PDF)格式',
        };
        onFilesChange((prevFiles: UploadedFile[]) => [...prevFiles, invalidTypeFile]);
        return;
      }

      // 验证文件大小
      if (!validateFileSize(file)) {
        const oversizedFile: UploadedFile = {
          id: generateId(),
          file,
          isUploading: false,
          error: '文件大小超过10MB限制',
        };
        onFilesChange((prevFiles: UploadedFile[]) => [...prevFiles, oversizedFile]);
        return;
      }

      // 添加到列表并获取唯一ID，然后上传
      const fileId = addFileToList(file);
      await uploadSingleFile(file, fileId);
    });

    // 等待所有上传任务完成
    await Promise.all(uploadTasks);

    {/* 清空input以便重复选择相同文件 */}
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * 移除指定索引的文件
   * 仅从本地列表移除，飞书文件保留
   *
   * @param index 文件索引
   */
  const handleRemoveFile = async (index: number) => {
    // 从列表中移除
    onFilesChange(files.filter((_, i) => i !== index));
  };

  /**
   * 组件卸载时取消正在进行的文件上传
   */
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
        <p className="text-xs text-xf-primary">支持 PNG, JPG, JPEG, GIF, WEBP, MD, PDF 格式，最大10MB</p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept=".png,.jpg,.jpeg,.gif,.webp,.md,.pdf"
          onChange={handleFileSelect}
        />
      </div>

      <FileList files={files} onRemove={handleRemoveFile} />
    </div>
  );
}
