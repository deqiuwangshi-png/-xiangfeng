'use client';

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-xf-primary/20 via-xf-secondary/20 to-xf-accent/20" />
      
      {/* 动态形状 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-xf-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-xf-secondary/10 rounded-full blur-3xl animate-pulse animation-delay-1000" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-xf-accent/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      
      {/* 装饰性粒子 */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-xf-primary/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}