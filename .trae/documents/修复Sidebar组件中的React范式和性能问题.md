## 修复Sidebar组件中的React范式和性能问题

### 问题分析
1. **DOM操作不符合React范式**：使用了`document.querySelector`和直接DOM事件监听
2. **事件监听器清理不完整**：虽然清理了resize事件，但点击外部关闭菜单的实现不够优化
3. **窗口大小检测性能**：每次resize都会触发，没有使用防抖
4. **路由跳转方式**：使用`window.location.href`破坏了SPA体验

### 修复方案

#### 1. 使用React refs替代直接DOM操作
- 将`document.querySelector('.relative.cursor-pointer')`替换为React ref
- 使用useRef钩子创建引用，在组件中安全地访问DOM元素

#### 2. 优化事件监听器实现
- 使用命名函数确保事件监听器可以正确清理
- 优化点击外部关闭菜单的逻辑，避免直接DOM查询

#### 3. 添加防抖功能优化窗口大小检测
- 实现防抖函数，限制resize事件的触发频率
- 建议使用50-100ms的防抖延迟

#### 4. 使用Next.js的useRouter或Link组件
- 使用`next/navigation`的`useRouter`钩子进行客户端路由跳转
- 或者使用`next/link`的`<Link>`组件
- 保持SPA体验，避免页面完全刷新

### 具体修复步骤

1. **导入必要的依赖**：
   - 从`next/navigation`导入`useRouter`
   - 从`next/link`导入`Link`

2. **修复resize事件处理**：
   ```javascript
   // 添加防抖函数
   const debounce = (func, delay) => {
     let timeoutId;
     return (...args) => {
       clearTimeout(timeoutId);
       timeoutId = setTimeout(() => func.apply(null, args), delay);
     };
   };

   // 使用防抖包装resize处理函数
   const debouncedHandleResize = debounce(() => {
     setIsMobile(window.innerWidth < 1280);
   }, 100);
   ```

3. **使用React ref替代DOM查询**：
   ```javascript
   const profileRef = useRef<HTMLDivElement>(null);
   
   // 点击外部关闭菜单
   useEffect(() => {
     const handleClickOutside = (event: MouseEvent) => {
       if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
         closeProfileMenu();
       }
     };
     
     document.addEventListener('mousedown', handleClickOutside);
     return () => {
       document.removeEventListener('mousedown', handleClickOutside);
     };
   }, []);
   ```

4. **使用useRouter进行路由跳转**：
   ```javascript
   const router = useRouter();
   
   // 切换标签
   const switchTab = (tabName: 'home' | 'explore' | 'publish') => {
     if (onTabChange) {
       onTabChange(tabName);
     }
     closeProfileMenu();
   };
   
   // 导航链接使用useRouter
   <a
     key={item.id}
     href={item.href}
     onClick={(e) => {
       e.preventDefault();
       router.push(item.href); // 使用客户端路由
       switchTab(item.tab);
     }}
     // ... 其他属性
   >
   ```

### 修复后的代码优势
- 符合React范式，避免水合错误
- 事件监听器可以正确清理，避免内存泄漏
- 窗口大小检测性能优化，减少不必要的重渲染
- 保持SPA体验，提高导航流畅度
- 代码更具可维护性和扩展性

### 预计修复时间
约15-20分钟，主要涉及代码重构和依赖导入