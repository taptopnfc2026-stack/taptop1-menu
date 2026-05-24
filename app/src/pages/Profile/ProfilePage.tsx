import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Building,
  Save,
  LogOut,
  Check,
  ArrowRight,
  Download,
  Trash2,
  Shield,
  AlertTriangle,
  Cookie,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCookieConsent } from '@/context/CookieConsentContext';
import { exportAllUserData, deleteAllUserData } from '@/services/dataService';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser, logout, isAuthenticated } = useAuth();
  const { resetConsent } = useCookieConsent();
  const [name, setName] = useState(user?.name || '');
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [email] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // GDPR states
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    updateUser({ name, businessName, email });
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // GDPR: Export data
  const handleExportData = async () => {
    if (!user) return;
    setIsExporting(true);
    try {
      const data = await exportAllUserData(user.id);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `taptopmenu-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // GDPR: Delete data
  const handleDeleteData = async () => {
    if (!user || deleteConfirmation !== user.email) return;
    setIsDeleting(true);
    try {
      await deleteAllUserData(user.id);
      setDeleted(true);
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Deletion failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (deleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-cyan-50">
        <div className="text-center p-8">
          <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Deleted / 数据已删除</h2>
          <p className="text-gray-500">All your data has been permanently deleted. Redirecting...</p>
          <p className="text-gray-400 text-sm mt-2">所有数据已永久删除，正在跳转...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-cyan-50" />

      <div className="relative max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-pink-200">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Profile / 个人资料</h1>
          <p className="text-gray-500 mt-1">Manage your account settings / 管理账户设置</p>
        </div>

        {/* Profile Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 p-6 shadow-lg shadow-pink-100/50">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name / 姓名</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email / 邮箱</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                readOnly
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Name / 商家名称</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your business name"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg shadow-pink-200 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : saved ? (
              <>
                <Check className="w-5 h-5" />
                Saved! / 已保存
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes / 保存更改
              </>
            )}
          </button>
        </div>

        {/* GDPR Data Management */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Data & Privacy / 数据与隐私</h3>
              <p className="text-xs text-gray-500">GDPR Data Subject Rights</p>
            </div>
          </div>

          {/* Export */}
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-violet-100 bg-violet-50/50 hover:bg-violet-100 transition-colors cursor-pointer disabled:opacity-50 mb-3"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-violet-600" />
              <div className="text-left">
                <span className="text-sm font-semibold text-violet-900 block">Export My Data</span>
                <span className="text-xs text-violet-500">导出我的数据 (Art. 20 GDPR)</span>
              </div>
            </div>
            {isExporting ? (
              <div className="w-5 h-5 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5 text-violet-400" />
            )}
          </button>

          {/* Delete */}
          {showDeleteConfirm ? (
            <div className="border-2 border-red-200 rounded-xl p-4 bg-red-50 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-start gap-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-700">
                    This action is irreversible / 此操作不可撤销
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    All your stores, templates, menus, analytics data, and account information will be permanently deleted. This complies with Art. 17 GDPR (Right to Erasure).
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    您的所有店铺、模板、菜单、分析数据和账户信息将被永久删除。此操作符合 GDPR 第 17 条（被遗忘权）。
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-2">Type your email to confirm / 输入邮箱确认: <strong>{user?.email}</strong></p>
              <input
                type="email"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder={user?.email || ''}
                className="w-full px-3 py-2 border border-red-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmation(''); }}
                  className="flex-1 py-2 bg-white text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium cursor-pointer"
                >
                  Cancel / 取消
                </button>
                <button
                  onClick={handleDeleteData}
                  disabled={isDeleting || deleteConfirmation !== user?.email}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium cursor-pointer flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Everything / 删除全部
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-red-100 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-red-500" />
                <div className="text-left">
                  <span className="text-sm font-semibold text-red-700 block">Delete All My Data</span>
                  <span className="text-xs text-red-400">删除我的全部数据 (Art. 17 GDPR)</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-red-400" />
            </button>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 p-4 shadow-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Links / 快捷链接</h3>
          <div className="space-y-2">
            {[
              { to: '/create-menu', label: 'Create Menu / 创建菜单' },
              { to: '/create-qr', label: 'Create QR Code / 创建二维码' },
              { to: '/analytics', label: 'Analytics / 分析' },
              { to: '/privacy', label: 'Privacy Policy / 隐私政策' },
              { to: '/imprint', label: 'Imprint / 公司信息' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer group"
              >
                <span className="text-gray-700">{link.label}</span>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Cookie Settings */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 p-4 shadow-lg">
          <button
            onClick={resetConsent}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Cookie className="w-5 h-5 text-amber-500" />
              <span className="text-sm text-gray-700">Cookie Settings / Cookie 设置</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 py-4 bg-white text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all border-2 border-red-100 cursor-pointer flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Sign Out / 登出
        </button>

        {/* Footer */}
        <div className="flex items-center justify-center gap-3 mt-6 text-xs text-gray-400">
          <Link to="/privacy" className="hover:text-gray-600">Privacy / 隐私</Link>
          <span>·</span>
          <Link to="/imprint" className="hover:text-gray-600">Imprint / 公司</Link>
          <span>·</span>
          <span>Taptop Menu v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
