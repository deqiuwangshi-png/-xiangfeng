/**
 * 精简导航栏组件
 * 包含返回首页、字体调整、主题切换功能
 */

import { Home, Type, Moon, X } from 'lucide-react';

interface NavMinimalProps {
  onToggleFontSize: () => void;
  onToggleDarkMode: () => void;
  onClose: () => void;
}

export function NavMinimal({ onToggleFontSize, onToggleDarkMode, onClose }: NavMinimalProps) {
  return (
    <nav className="nav-minimal">
      <div className="nav-content">
        <div className="flex items-center space-x-3">
          <a href="/home" className="flex items-center space-x-2 no-underline">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-xf-primary to-xf-accent flex items-center justify-center text-white font-bold">相</div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">相逢</span>
          </a>
          
          {/* 返回首页按钮 */}
          <button className="nav-home-btn" onClick={() => window.location.href = '/home'}>
            <Home className="w-4 h-4" />
            <span>返回首页</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button onClick={onToggleFontSize} className="p-2 rounded-lg hover:bg-gray-100 transition" title="调整字体">
            <Type className="w-4 h-4 text-gray-700" />
          </button>
          <button onClick={onToggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 transition" title="切换主题">
            <Moon className="w-4 h-4 text-gray-700" />
          </button>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition" title="返回首页">
            <X className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>
    </nav>
  );
}
