/**
 * 着陆页布局文件
 * 为所有着陆页提供统一的布局结构
 */

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {children}
    </div>
  );
}