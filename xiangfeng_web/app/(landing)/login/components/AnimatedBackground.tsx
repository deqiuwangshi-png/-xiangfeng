/**
 * 动态背景组件
 * 基于登录注册页.html设计
 * 实现浮动的渐变圆形背景效果
 */

export function AnimatedBackground() {
  return (
    <>
      {/* 左上角浮动背景 */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-xf-soft to-xf-surface blur-[120px] opacity-60 animate-pulse-subtle"></div>
      
      {/* 右下角浮动背景 */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tl from-xf-primary/30 to-xf-accent/20 blur-[100px] opacity-50 animate-float"></div>
    </>
  );
}