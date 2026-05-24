import { useState, useCallback } from 'react';
import { X, Cookie, Settings2, Check, Shield, BarChart3, Bell, Palette } from 'lucide-react';
import { useCookieConsent, type ConsentCategory } from '@/context/CookieConsentContext';

const categoryInfo: { id: ConsentCategory; icon: typeof Cookie; label: string; labelZh: string; description: string; descriptionZh: string; alwaysOn?: boolean }[] = [
  {
    id: 'necessary',
    icon: Shield,
    label: 'Necessary',
    labelZh: '必要',
    description: 'Essential for the website to function properly. Cannot be disabled.',
    descriptionZh: '网站正常运行所必需，无法禁用。',
    alwaysOn: true,
  },
  {
    id: 'analytics',
    icon: BarChart3,
    label: 'Analytics',
    labelZh: '分析',
    description: 'Help us understand how visitors interact with the website.',
    descriptionZh: '帮助我们了解访客与网站的互动方式。',
  },
  {
    id: 'marketing',
    icon: Bell,
    label: 'Marketing',
    labelZh: '营销',
    description: 'Used to deliver relevant advertisements and marketing campaigns.',
    descriptionZh: '用于投放相关广告和营销活动。',
  },
  {
    id: 'preferences',
    icon: Palette,
    label: 'Preferences',
    labelZh: '偏好',
    description: 'Remember your settings and preferences for a better experience.',
    descriptionZh: '记住您的设置和偏好，提供更好的体验。',
  },
];

export function CookieBanner() {
  const { consent, showBanner, acceptAll, rejectAll, acceptSelected } = useCookieConsent();
  const [showSettings, setShowSettings] = useState(false);
  const [tempConsent, setTempConsent] = useState(consent);

  const handleOpenSettings = useCallback(() => {
    setTempConsent({ ...consent });
    setShowSettings(true);
  }, [consent]);

  const handleSave = useCallback(() => {
    acceptSelected(tempConsent);
    setShowSettings(false);
  }, [tempConsent, acceptSelected]);

  const handleToggle = useCallback((cat: ConsentCategory) => {
    setTempConsent(prev => ({ ...prev, [cat]: !prev[cat] }));
  }, []);

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={() => {}} />

      {/* Main Banner */}
      {!showSettings ? (
        <div className="relative w-full max-w-2xl mx-4 mb-4 pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900">Cookie Consent / Cookie 同意</h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of all cookies. You can manage your preferences by clicking &quot;Settings&quot;.
                </p>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  我们使用 Cookie 来提升您的浏览体验、提供个性化内容并分析流量。点击「全部接受」即表示您同意使用所有 Cookie。您可以通过点击「设置」来管理偏好。
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <a href="#/privacy" className="text-xs text-violet-600 hover:text-violet-700 underline">Privacy Policy / 隐私政策</a>
                  <span className="text-gray-300">·</span>
                  <a href="#/imprint" className="text-xs text-violet-600 hover:text-violet-700 underline">Imprint / 公司信息</a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button
                onClick={acceptAll}
                className="px-6 py-2.5 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Accept All / 全部接受
              </button>
              <button
                onClick={rejectAll}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Reject All / 全部拒绝
              </button>
              <button
                onClick={handleOpenSettings}
                className="px-6 py-2.5 bg-white text-violet-600 font-medium rounded-xl border border-violet-200 hover:bg-violet-50 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Settings2 className="w-4 h-4" />
                Settings / 设置
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Settings Panel */
        <div className="relative w-full max-w-2xl mx-4 mb-4 pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                  <Settings2 className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Cookie Settings / Cookie 设置</h3>
                  <p className="text-sm text-gray-500">Manage your cookie preferences</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {categoryInfo.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-violet-100 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <cat.icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {cat.label} <span className="text-gray-400 font-normal">/ {cat.labelZh}</span>
                      </h4>
                      {cat.alwaysOn && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-md font-medium">
                          Always On
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{cat.description}</p>
                  </div>
                  {cat.alwaysOn ? (
                    <div className="w-11 h-6 rounded-full bg-violet-200 flex items-center justify-end px-0.5">
                      <div className="w-5 h-5 rounded-full bg-violet-600" />
                    </div>
                  ) : (
                    <button
                      onClick={() => handleToggle(cat.id)}
                      className={`w-11 h-6 rounded-full transition-colors flex items-center cursor-pointer ${
                        tempConsent[cat.id] ? 'bg-violet-600 justify-end' : 'bg-gray-300 justify-start'
                      } px-0.5`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-sm transition-transform" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Save Preferences / 保存设置
              </button>
              <button
                onClick={acceptAll}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Accept All / 全部接受
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CookieSettingsButton() {
  const { resetConsent } = useCookieConsent();

  return (
    <button
      onClick={resetConsent}
      className="text-sm text-violet-600 hover:text-violet-700 underline cursor-pointer flex items-center gap-1"
    >
      <Cookie className="w-4 h-4" />
      Cookie Settings / Cookie 设置
    </button>
  );
}
