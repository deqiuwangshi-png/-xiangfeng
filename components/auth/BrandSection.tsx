/**
 * 品牌区域组件
 * 
 * 作用: 显示品牌Logo、标题、副标题和引言
 * 
 * @param className - 可选的额外类名
 * 
 * 使用说明:
 *   用于认证页面的左侧品牌区域（桌面端）
 *   包含背景装饰光晕效果
 */

export function BrandSection({ className = '' }: { className?: string }) {
  return (
    <div className={`hidden lg:flex w-5/12 relative overflow-hidden items-center justify-center p-12 bg-xf-light ${className}`}>
      {/* 背景装饰 */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-xf-soft/20 blur-[120px] opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-xf-primary/20 blur-[100px] opacity-50" />

      {/* 品牌内容 */}
      <div className="relative z-10 text-center fade-in-up">
        <div className="w-16 h-16 mx-auto mb-8 bg-xf-primary rounded-2xl rotate-12 opacity-90 shadow-glow" />
        <h1 className="font-serif text-5xl mb-6 text-xf-accent font-bold tracking-wider">相逢</h1>
        <p className="font-serif text-2xl mb-8 text-xf-primary font-medium">不止相遇，更是改变</p>
        <div className="inline-block border-t border-xf-surface/40 pt-8 mt-4">
          <p className="text-lg text-xf-dark/80 font-light italic">&ldquo;最终的目标不是看到，而是改变。&rdquo;</p>
        </div>
      </div>
    </div>
  );
}
