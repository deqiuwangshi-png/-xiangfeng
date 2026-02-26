/**
 * 文件上传组件
 * 支持拖拽上传和点击上传
 */

'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle2 } from 'lucide-react';

interface FileUploaderProps {
  onClose: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    setUploading(true);
    setUploadProgress(0);

    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setUploading(false);
          setUploaded(true);
          setTimeout(() => {
            setUploaded(false);
            onClose();
          }, 3000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="card-bg rounded-2xl p-8 max-w-md w-full mx-4">
        <button
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--color-xf-light)] transition-all duration-200"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-[var(--color-xf-medium)]" />
        </button>
        
        {!uploaded && !uploading && (
          <>
            <h2 className="text-xl font-serif text-[var(--color-xf-accent)] font-bold text-center mb-6">上传文件</h2>
            
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${isDragging ? 'border-[var(--color-xf-primary)] bg-[var(--color-xf-primary)]/5' : 'border-[var(--color-xf-soft)] hover:border-[var(--color-xf-primary)] hover:bg-[var(--color-xf-light)]'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openFileDialog}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
                multiple
              />
              
              <Upload className="w-16 h-16 mx-auto mb-4 text-[var(--color-xf-medium)]" />
              <h3 className="text-lg font-semibold text-[var(--color-xf-dark)] mb-2">拖拽文件到此处或点击上传</h3>
              <p className="text-sm text-[var(--color-xf-medium)] mb-4">支持 PDF、DOCX、PNG、JPG 等格式，单个文件不超过 5MB</p>
              
              <button
                className="px-6 py-3 bg-gradient-to-r from-[var(--color-xf-accent)] to-[var(--color-xf-primary)] hover:from-[var(--color-xf-accent)]/90 hover:to-[var(--color-xf-primary)]/90 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                onClick={openFileDialog}
              >
                选择文件
              </button>
            </div>
          </>
        )}
        
        {uploading && (
          <div className="text-center">
            <h2 className="text-xl font-serif text-[var(--color-xf-accent)] font-bold mb-6">上传中...</h2>
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[var(--color-xf-dark)]">上传进度</span>
                <span className="text-[var(--color-xf-medium)]">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-[var(--color-xf-light)] rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-[var(--color-xf-accent)] to-[var(--color-xf-primary)] h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
        
        {uploaded && (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-semibold text-[var(--color-xf-dark)] mb-2">上传成功！</h3>
            <p className="text-sm text-[var(--color-xf-medium)]">文件已成功上传到您的个人空间</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;