import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Building, 
  Save,
  LogOut,
  Check,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser, logout, isAuthenticated } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Check authentication on page load - redirect to login if not authenticated
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

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-cyan-50" />
      
      <div className="relative max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-pink-200">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-500 mt-1">Manage your account settings</p>
        </div>

        {/* Profile Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 p-6 shadow-lg shadow-pink-100/50">
          {/* Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
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

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Business Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name
            </label>
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

          {/* Save Button */}
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
                Saved!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 p-4 shadow-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
          <div className="space-y-2">
            <a
              href="/generate-review"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer group"
            >
              <span className="text-gray-700">Generate Review</span>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
            </a>
            <a
              href="/create-qr"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer group"
            >
              <span className="text-gray-700">Create QR Code</span>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
            </a>
            <a
              href="/my-qr-codes"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer group"
            >
              <span className="text-gray-700">My QR Codes</span>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
            </a>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 py-4 bg-white text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all border-2 border-red-100 cursor-pointer flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>

        {/* Version */}
        <p className="text-center text-sm text-gray-400 mt-8">
          Taptop Menu v1.0.0
        </p>
      </div>
    </div>
  );
}
