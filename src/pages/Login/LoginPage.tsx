import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight, Star, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { authService, isAuthConfigured } from '@/services/authService';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let user;
      if (isSignUp) {
        user = await authService.signUp(email, password, name);
      } else {
        user = await authService.login(email, password);
      }
      login(user);
      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      if (message.includes('auth/invalid-credential') || message.includes('auth/user-not-found') || message.includes('auth/wrong-password')) {
        setError('Invalid email or password / 邮箱或密码错误');
      } else if (message.includes('auth/email-already-in-use')) {
        setError('Email already registered / 邮箱已注册');
      } else if (message.includes('auth/weak-password')) {
        setError('Password should be at least 6 characters / 密码至少6个字符');
      } else if (message.includes('auth/invalid-email')) {
        setError('Invalid email address / 邮箱格式不正确');
      } else if (message.includes('auth/too-many-requests')) {
        setError('Too many attempts. Please try again later / 尝试次数过多，请稍后再试');
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const user = await authService.googleLogin();
      login(user);
      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google login failed';
      if (message.includes('auth/popup-closed-by-user')) {
        setError('Login cancelled / 登录已取消');
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authService.resetPassword(resetEmail);
      setResetSent(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('auth/user-not-found')) {
        setError('No account found with this email / 未找到此邮箱的账户');
      } else {
        setError('Failed to send reset email / 发送重置邮件失败');
      }
    } finally {
      setIsLoading(false);
      setResetEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-cyan-100 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="block text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 shadow-lg shadow-purple-200 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            Taptop Menu
          </h1>
          <p className="text-gray-500 mt-2">Multi-Language Menu Platform / 多语言智能菜单</p>
        </Link>

        {/* Form Card */}
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-xl shadow-pink-100/50 border border-white/50 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {showResetPassword ? 'Reset Password' : isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>

          {!showResetPassword ? (
            <>
              {/* Error display */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl mb-4">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors mb-6 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="font-medium text-gray-700">Continue with Google</span>
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name / 姓名</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email / 邮箱</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password / 密码</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {!isSignUp && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(true)}
                      className="text-sm text-violet-600 hover:text-violet-700 cursor-pointer"
                    >
                      Forgot password? / 忘记密码？
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-200 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {isSignUp ? 'Create Account / 注册' : 'Sign In / 登录'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"} /{' '}
                {isSignUp ? '已有账户？' : '没有账户？'}{' '}
                <button
                  onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                  className="text-violet-600 font-semibold hover:text-violet-700 cursor-pointer"
                >
                  {isSignUp ? 'Sign In / 登录' : 'Sign Up / 注册'}
                </button>
              </p>

              {!isAuthConfigured && (
                <p className="text-center text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg p-3 mt-4">
                  Demo mode — any email/password works. Set up Firebase for production.
                </p>
              )}
            </>
          ) : (
            /* Reset Password Form */
            <>
              {resetSent ? (
                <div className="text-center py-4">
                  <KeyRound className="w-12 h-12 text-violet-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your Email / 检查邮箱</h3>
                  <p className="text-sm text-gray-500 mb-4">If an account exists, a password reset link has been sent.</p>
                  <button
                    onClick={() => { setShowResetPassword(false); setResetSent(false); }}
                    className="text-violet-600 hover:text-violet-700 font-medium cursor-pointer"
                  >
                    Back to Login / 返回登录
                  </button>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl mb-4">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <p className="text-sm text-gray-500 mb-4">
                    Enter your email to receive a password reset link / 输入邮箱获取密码重置链接
                  </p>
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-200 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Send Reset Link / 发送重置链接'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowResetPassword(false); setError(''); }}
                      className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      Back to Login / 返回登录
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>EU GDPR Compliant</span>
          </div>
          <Link to="/privacy" className="hover:text-gray-600">Privacy / 隐私</Link>
          <Link to="/imprint" className="hover:text-gray-600">Imprint / 公司</Link>
        </div>
      </div>
    </div>
  );
}
