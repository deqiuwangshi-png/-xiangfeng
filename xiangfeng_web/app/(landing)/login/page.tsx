export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-xf-bg via-xf-surface to-xf-soft flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-xf-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-2xl font-bold">向</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-xf-dark">登录您的账户</h2>
          <p className="mt-2 text-sm text-xf-medium">
            或者{' '}
            <a href="/register" className="font-medium text-xf-primary hover:text-xf-primary/80">
            创建新账户
            </a>
          </p>
        </div>
        
        <form className="mt-8 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-xf-soft p-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-xf-dark mb-1">
                邮箱地址
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 border border-xf-border rounded-lg focus:outline-none focus:ring-2 focus:ring-xf-primary focus:border-transparent"
                placeholder="请输入您的邮箱"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-xf-dark mb-1">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-3 py-2 border border-xf-border rounded-lg focus:outline-none focus:ring-2 focus:ring-xf-primary focus:border-transparent"
                placeholder="请输入您的密码"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-xf-primary focus:ring-xf-primary border-xf-border rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-xf-medium">
                  记住我
                </label>
              </div>
              
              <div className="text-sm">
                <a href="/forgot-password" className="font-medium text-xf-primary hover:text-xf-primary/80">
                  忘记密码？
                </a>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full bg-xf-primary text-white py-2 px-4 rounded-lg hover:bg-xf-primary/90 focus:outline-none focus:ring-2 focus:ring-xf-primary focus:ring-offset-2"
              >
                登录
              </button>
            </div>
          </div>
          
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-xf-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-xf-bg text-xf-medium">或者使用</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-xf-border rounded-lg shadow-sm bg-white text-sm font-medium text-xf-medium hover:bg-xf-light"
              >
                <span className="mr-2">📱</span>
                微信登录
              </button>
              
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-xf-border rounded-lg shadow-sm bg-white text-sm font-medium text-xf-medium hover:bg-xf-light"
              >
                <span className="mr-2">🔵</span>
                QQ登录
              </button>
            </div>
          </div>
        </form>
        
        <div className="text-center text-xs text-xf-medium">
          <p>
            登录即表示您同意我们的{' '}
            <a href="/terms" className="text-xf-primary hover:text-xf-primary/80">服务条款</a>
            {' '}和{' '}
            <a href="/privacy" className="text-xf-primary hover:text-xf-primary/80">隐私政策</a>
          </p>
        </div>
      </div>
    </div>
  );
}