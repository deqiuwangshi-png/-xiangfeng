'use client';

/**
 * 选项卡按钮组件
 *
 * @module components/article/rw/TabBtn
 * @description 打赏弹窗中的选项卡切换按钮
 */

import React from 'react';

/**
 * TabBtn Props 接口
 */
interface TabBtnProps {
  /** 是否激活 */
  active: boolean;
  /** 点击回调 */
  onClick: () => void;
  /** 图标 */
  icon: React.ReactNode;
  /** 标签文字 */
  label: string;
}

/**
 * 选项卡按钮组件
 *
 * @param {TabBtnProps} props - 组件属性
 * @returns {JSX.Element} 选项卡按钮
 */
export function TabBtn({ active, onClick, icon, label }: TabBtnProps) {
  return (
    <button
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
        active
          ? 'bg-white text-xf-primary shadow-sm'
          : 'text-xf-medium hover:text-xf-dark'
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}
