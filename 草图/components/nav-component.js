// 导航栏组件交互功能

// 初始化导航栏
function initNavComponent() {
    // 设置当前活动导航项
    setActiveNavItem();
    
    // 添加事件监听器
    addEventListeners();
}

// 设置当前活动导航项
function setActiveNavItem() {
    const pathname = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (pathname.includes(href)) {
            item.classList.add('active', 'text-xf-accent');
            item.classList.remove('text-xf-primary');
        } else {
            item.classList.remove('active', 'text-xf-accent');
            item.classList.add('text-xf-primary');
        }
    });
}

// 添加事件监听器
function addEventListeners() {
    // 导航项点击事件
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // 移除所有激活状态
            document.querySelectorAll('.nav-item').forEach(nav => {
                nav.classList.remove('active', 'text-xf-accent');
                nav.classList.add('text-xf-primary');
            });
            
            // 激活当前项
            this.classList.add('active', 'text-xf-accent');
            this.classList.remove('text-xf-primary');
            
            // 关闭移动端侧边栏
            closeMobileSidebar();
        });
    });
    
    // 点击外部关闭下拉菜单
    document.addEventListener('click', function(e) {
        const profileGroup = document.querySelector('.relative.cursor-pointer');
        const menu = document.getElementById('profile-dropdown');
        if (profileGroup && !profileGroup.contains(e.target)) {
            menu.classList.add('hidden');
        }
    });
}

// 切换个人下拉菜单
function toggleProfileMenu() {
    const menu = document.getElementById('profile-dropdown');
    menu.classList.toggle('hidden');
}

// 切换侧边栏（移动端）
function toggleSidebar() {
    const sidebar = document.getElementById('nav-sidebar');
    const overlay = document.getElementById('nav-overlay');
    
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    
    // 禁止/允许页面滚动
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : 'auto';
}

// 关闭移动端侧边栏
function closeMobileSidebar() {
    const sidebar = document.getElementById('nav-sidebar');
    const overlay = document.getElementById('nav-overlay');
    
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// 页面加载后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavComponent);
} else {
    initNavComponent();
}

// 导出函数供外部使用
window.initNavComponent = initNavComponent;
window.toggleProfileMenu = toggleProfileMenu;
window.toggleSidebar = toggleSidebar;
window.closeMobileSidebar = closeMobileSidebar;