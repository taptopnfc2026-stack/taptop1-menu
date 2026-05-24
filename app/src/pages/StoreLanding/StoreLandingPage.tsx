import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Sparkles, 
  FileText, 
  ExternalLink,
  Star,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useStores } from '@/context/StoreContext';
import { getStoreRedirectUrl } from '@/lib/utils';
import type { Platform, CustomPlatformRedirect } from '@/types';

const platformConfig: Record<Platform, { name: string; color: string; gradient: string }> = {
  google: { 
    name: 'Google', 
    color: 'text-blue-600', 
    gradient: 'from-blue-500 to-blue-600' 
  },
  facebook: { 
    name: 'Facebook', 
    color: 'text-blue-600', 
    gradient: 'from-blue-600 to-blue-700' 
  },
  yelp: { 
    name: 'Yelp', 
    color: 'text-red-600', 
    gradient: 'from-red-500 to-red-600' 
  },
  trustpilot: { 
    name: 'Trustpilot', 
    color: 'text-green-600', 
    gradient: 'from-green-500 to-green-600' 
  },
};

// Custom platform colors for StoreLandingPage
const customPlatformColors = [
  'from-purple-500 to-purple-600',
  'from-indigo-500 to-indigo-600',
  'from-teal-500 to-teal-600',
  'from-orange-500 to-orange-600',
  'from-pink-500 to-pink-600',
  'from-cyan-500 to-cyan-600',
];

export function StoreLandingPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const { getStoreById } = useStores();
  
  const store = storeId ? getStoreById(storeId) : undefined;

  if (!store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h2>
          <p className="text-gray-500 mb-6">This QR code may have expired or is invalid.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // Get standard platforms (google, facebook, yelp, trustpilot)
  const standardPlatforms = (['google', 'facebook', 'yelp', 'trustpilot'] as Platform[])
    .filter((platform) => getStoreRedirectUrl(store, platform));

  // Get custom platforms
  const customPlatforms: CustomPlatformRedirect[] = store.customRedirects || [];

  // Combined platforms for display
  const allPlatforms = [
    ...standardPlatforms.map(platform => ({
      id: platform,
      name: platformConfig[platform].name,
      url: getStoreRedirectUrl(store, platform)!,
      gradient: platformConfig[platform].gradient,
      isCustom: false,
    })),
    ...customPlatforms.map((redirect, index) => ({
      id: redirect.id,
      name: redirect.name,
      url: redirect.url,
      gradient: customPlatformColors[index % customPlatformColors.length],
      isCustom: true,
    })),
  ];

  const handlePlatformRedirect = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-cyan-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 py-8 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <QRCodeCanvas value={window.location.href} size={48} level="L" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{store.name}</h1>
          <p className="text-pink-100 flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4" />
            {store.address}
          </p>
          <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm text-white">
            {store.category}
          </span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Quick Actions - Direct to Review Creation */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to={`/generate-review/${store.id}`}
            className="p-4 bg-white rounded-xl border border-pink-100 hover:border-pink-200 hover:shadow-lg transition-all text-center cursor-pointer"
          >
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Generate Review</h3>
            <p className="text-sm text-gray-500 mt-1">Create an AI review</p>
          </Link>
          
          <Link
            to={`/templates/${store.id}`}
            className="p-4 bg-white rounded-xl border border-pink-100 hover:border-pink-200 hover:shadow-lg transition-all text-center cursor-pointer"
          >
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Use Template</h3>
            <p className="text-sm text-gray-500 mt-1">Choose from library</p>
          </Link>
        </div>

        {/* Products & Features Preview */}
        {(store.products || store.features) && (
          <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-lg shadow-pink-100/50">
            <h3 className="font-semibold text-gray-900 mb-3">What we offer:</h3>
            <div className="flex flex-wrap gap-2">
              {(store.products || []).map((product) => (
                <span key={product} className="px-3 py-1 bg-amber-50 text-amber-700 text-sm rounded-full">
                  {product}
                </span>
              ))}
              {(store.features || []).map((feature) => (
                <span key={feature} className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Rate Us Section */}
        <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-lg shadow-pink-100/50">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 text-yellow-400 fill-yellow-400 cursor-pointer hover:scale-110 transition-transform"
                />
              ))}
            </div>
            <h2 className="text-xl font-bold text-gray-900">How was your experience?</h2>
            <p className="text-gray-500 text-sm mt-1">Tap to rate and share your feedback</p>
          </div>

          {allPlatforms.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 text-center">Share your review on:</p>
              {allPlatforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => handlePlatformRedirect(platform.url)}
                  className={`w-full py-3 bg-gradient-to-r ${platform.gradient} text-white font-semibold rounded-xl hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2`}
                >
                  <span>Post to {platform.name}</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Review links not configured yet.</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-center gap-4 text-sm">
          <Link
            to="/create-qr"
            className="text-pink-600 font-medium hover:text-pink-700 cursor-pointer"
          >
            Create QR
          </Link>
          <span className="text-gray-300">|</span>
          <Link
            to="/"
            className="text-pink-600 font-medium hover:text-pink-700 cursor-pointer"
          >
            Home
          </Link>
        </div>

        {/* Branding */}
        <div className="text-center pt-4">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            Powered by
            <span className="font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Taptop Menu
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
