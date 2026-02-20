import { ThumbsUp } from 'lucide-react';

export default function Statistics() {
  return (
    <div className="p-2">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-xf-light/70 p-3 rounded-xl">
          <div className="text-2xl font-bold text-xf-accent">8</div>
          <div className="text-xs text-xf-primary">总反馈</div>
          <div className="mini-chart-bar mt-2 w-full h-1 bg-xf-surface rounded-full overflow-hidden">
            <div className="mini-chart-fill h-full bg-xf-primary" style={{ width: '70%' }}></div>
          </div>
        </div>
        <div className="bg-xf-light/70 p-3 rounded-xl">
          <div className="text-2xl font-bold text-xf-success">5</div>
          <div className="text-xs text-xf-primary">已解决</div>
          <div className="mini-chart-bar mt-2 w-full h-1 bg-xf-surface rounded-full overflow-hidden">
            <div className="mini-chart-fill h-full bg-xf-success" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-xf-primary border-t border-xf-bg/40 pt-3">
        <ThumbsUp className="w-4 h-4 text-xf-success" />
        <span>
          你的 <strong className="text-xf-accent">3 条</strong> 建议已被采纳
        </span>
      </div>
    </div>
  );
}
