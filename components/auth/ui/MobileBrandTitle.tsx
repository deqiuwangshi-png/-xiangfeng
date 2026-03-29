/**
 * 移动端品牌标题组件
 * 
 * 作用: 在移动端显示品牌标题和副标题
 * 
 * 使用说明:
 *   用于认证页面的移动端品牌标题
 *   仅在移动端显示（lg:hidden）
 */

export function MobileBrandTitle() {
  return (
    <div className="text-center mb-12 lg:hidden">
      <h2 className="font-serif text-3xl text-xf-accent font-bold">相逢</h2>
      <p className="text-xf-primary mt-2 font-medium">开启你的深度之旅</p>
    </div>
  );
}
