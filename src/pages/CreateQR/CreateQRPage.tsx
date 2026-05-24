import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  Store, 
  MapPin, 
  Globe, 
  Check, 
  Download, 
  Sparkles, 
  ArrowLeft,
  AlertCircle,
  ExternalLink,
  Copy,
  Plus,
  X,
  Package,
  Star,
  Link2
} from 'lucide-react';
import { useStores } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { generateId } from '@/lib/utils';
import type { Category, Platform, CustomPlatformRedirect } from '@/types';
import { categoryProducts, categoryFeatures } from '@/types';

const categories: Category[] = ['Restaurant', 'Retail', 'Beauty', 'Services', 'Healthcare', 'Other'];

const platforms: { id: Platform; name: string; url: string }[] = [
  { id: 'google', name: 'Google Reviews', url: 'https://g.page/r/~/review' },
  { id: 'facebook', name: 'Facebook Reviews', url: 'https://www.facebook.com/help/1873669317428374' },
  { id: 'yelp', name: 'Yelp Reviews', url: 'https://www.yelp.com/writeareview' },
  { id: 'trustpilot', name: 'Trustpilot', url: 'https://www.trustpilot.com/review' },
];

export function CreateQRPage() {
  const navigate = useNavigate();
  const { addStore } = useStores();
  const { isAuthenticated } = useAuth();
  
  // Check authentication on page load - redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const [storeName, setStoreName] = useState('');
  const [category, setCategory] = useState<Category>('Restaurant');
  const [address, setAddress] = useState('');
  const [products, setProducts] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [customProduct, setCustomProduct] = useState('');
  const [customFeature, setCustomFeature] = useState('');
  const [platformsEnabled, setPlatformsEnabled] = useState<Record<Platform, boolean>>({
    google: false,
    facebook: false,
    yelp: false,
    trustpilot: false,
  });
  const [platformUrls, setPlatformUrls] = useState<Record<Platform, string>>({
    google: '',
    facebook: '',
    yelp: '',
    trustpilot: '',
  });
  const [customRedirects, setCustomRedirects] = useState<CustomPlatformRedirect[]>([]);
  const [newRedirectName, setNewRedirectName] = useState('');
  const [newRedirectUrl, setNewRedirectUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [createdStore, setCreatedStore] = useState<string | null>(null);
  const [storeWebsite, setStoreWebsite] = useState('');
  const [websiteCopied, setWebsiteCopied] = useState(false);

  const togglePlatform = (platform: Platform) => {
    setPlatformsEnabled((prev) => ({ ...prev, [platform]: !prev[platform] }));
    if (platformsEnabled[platform]) {
      setPlatformUrls((prev) => ({ ...prev, [platform]: '' }));
    } else {
      setPlatformUrls((prev) => ({
        ...prev,
        [platform]: platforms.find((p) => p.id === platform)?.url || '',
      }));
    }
  };

  const addProduct = (product: string) => {
    if (product.trim() && !products.includes(product.trim())) {
      setProducts([...products, product.trim()]);
      setCustomProduct('');
    }
  };

  const removeProduct = (product: string) => {
    setProducts(products.filter(p => p !== product));
  };

  const addFeature = (feature: string) => {
    if (feature.trim() && !features.includes(feature.trim())) {
      setFeatures([...features, feature.trim()]);
      setCustomFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFeatures(features.filter(f => f !== feature));
  };

  const addCustomRedirect = () => {
    if (newRedirectName.trim() && newRedirectUrl.trim()) {
      const newRedirect: CustomPlatformRedirect = {
        id: generateId(),
        name: newRedirectName.trim(),
        url: newRedirectUrl.trim(),
      };
      setCustomRedirects([...customRedirects, newRedirect]);
      setNewRedirectName('');
      setNewRedirectUrl('');
    }
  };

  const removeCustomRedirect = (id: string) => {
    setCustomRedirects(customRedirects.filter(r => r.id !== id));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!storeName.trim()) {
      newErrors.storeName = 'Store name is required';
    }
    
    if (!address.trim()) {
      newErrors.address = 'Address is required';
    }

    Object.keys(platformsEnabled).forEach((platform) => {
      if (platformsEnabled[platform as Platform] && !platformUrls[platform as Platform].trim()) {
        newErrors[`platform_${platform}`] = 'URL is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateQR = async () => {
    if (!validateForm()) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsCreating(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const storeId = generateId();
    
    const newStore = {
      id: storeId,
      userId: 'current-user',
      name: storeName,
      category,
      address,
      products: products.length > 0 ? products : undefined,
      features: features.length > 0 ? features : undefined,
      websiteUrl: storeWebsite || undefined,
      googleUrl: platformsEnabled.google ? platformUrls.google : undefined,
      facebookUrl: platformsEnabled.facebook ? platformUrls.facebook : undefined,
      yelpUrl: platformsEnabled.yelp ? platformUrls.yelp : undefined,
      trustpilotUrl: platformsEnabled.trustpilot ? platformUrls.trustpilot : undefined,
      customRedirects: customRedirects.length > 0 ? customRedirects : undefined,
      createdAt: new Date(),
    };

    addStore(newStore);
    setCreatedStore(storeId);
    setIsCreating(false);
  };

  const downloadQR = () => {
    const canvas = document.querySelector('#store-qr canvas') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${storeName.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
      link.href = url;
      link.click();
    }
  };

  const resetForm = () => {
    setStoreName('');
    setCategory('Restaurant');
    setAddress('');
    setProducts([]);
    setFeatures([]);
    setCustomProduct('');
    setCustomFeature('');
    setPlatformsEnabled({ google: false, facebook: false, yelp: false, trustpilot: false });
    setPlatformUrls({ google: '', facebook: '', yelp: '', trustpilot: '' });
    setCustomRedirects([]);
    setCreatedStore(null);
    setStoreWebsite('');
    setWebsiteCopied(false);
    setErrors({});
  };

  const generateWebsiteUrl = () => {
    const slug = storeName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    const url = `https://taptop.ai/store/${slug}`;
    setStoreWebsite(url);
    return url;
  };

  const copyWebsiteUrl = async () => {
    if (!storeWebsite) {
      generateWebsiteUrl();
    }
    try {
      await navigator.clipboard.writeText(storeWebsite);
      setWebsiteCopied(true);
      setTimeout(() => setWebsiteCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (createdStore) {
    const storeLandingUrl = `${window.location.origin}/store/${createdStore}`;
    return (
      <div className="min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-cyan-50" />
        
        <div className="relative max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 p-8 shadow-lg shadow-pink-100/50 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">QR Code Created!</h2>
            <p className="text-gray-500 mb-6">Your store QR code is ready to download</p>
            
            {/* QR Preview */}
            <div className="bg-white p-4 rounded-xl border border-pink-100 mb-6 inline-block">
              <QRCodeCanvas
                id="store-qr"
                value={storeLandingUrl}
                size={200}
                level="H"
                includeMargin
              />
            </div>

            {/* Store Website Link */}
            <div className="mb-6 p-4 bg-gradient-to-r from-cyan-50 to-pink-50 rounded-xl border border-cyan-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Store Website Link
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500" />
                  <input
                    type="text"
                    value={storeLandingUrl}
                    readOnly
                    className="w-full pl-10 pr-4 py-2 border border-cyan-200 rounded-lg bg-white text-sm"
                  />
                </div>
                <button
                  onClick={copyWebsiteUrl}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    websiteCopied
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700'
                  }`}
                >
                  {websiteCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={downloadQR}
                className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download QR
              </button>
              <button
                onClick={resetForm}
                className="flex-1 py-3 bg-white text-pink-600 font-semibold rounded-xl hover:bg-pink-50 transition-all border-2 border-pink-200 cursor-pointer"
              >
                Create Another
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-pink-100">
              <Link
                to={`/store/${createdStore}`}
                className="inline-flex items-center gap-2 text-pink-600 font-medium hover:text-pink-700 cursor-pointer"
              >
                View Store Page
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-cyan-50" />
      
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-xl border border-pink-100 hover:border-pink-200 hover:shadow-md transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create Store QR</h1>
            <p className="text-gray-500 mt-1">Generate a QR code for your store</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 p-6 shadow-lg shadow-pink-100/50">
          {/* Store Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Name
            </label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={storeName}
                onChange={(e) => {
                  setStoreName(e.target.value);
                  if (errors.storeName) setErrors((prev) => ({ ...prev, storeName: '' }));
                }}
                placeholder="Enter your store name"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all ${
                  errors.storeName ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500 focus:border-pink-500'
                }`}
              />
            </div>
            {errors.storeName && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.storeName}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-pink-50 border-pink-300 text-pink-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-pink-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                }}
                placeholder="Enter your store address"
                rows={2}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all resize-none ${
                  errors.address ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500 focus:border-pink-500'
                }`}
              />
            </div>
            {errors.address && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.address}
              </p>
            )}
          </div>

          {/* Products Section */}
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-600" />
              Products / Services
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Add your main products or services (suggestions based on {category})
            </p>
            
            {/* Suggested Products */}
            <div className="flex flex-wrap gap-2 mb-3">
              {categoryProducts[category].slice(0, 6).map((product) => (
                <button
                  key={product}
                  onClick={() => addProduct(product)}
                  disabled={products.includes(product)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer ${
                    products.includes(product)
                      ? 'bg-amber-100 border-amber-300 text-amber-700 cursor-default'
                      : 'bg-white border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300'
                  }`}
                >
                  {products.includes(product) ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {product}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Plus className="w-3 h-3" />
                      {product}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            {/* Custom Product Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customProduct}
                onChange={(e) => setCustomProduct(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addProduct(customProduct))}
                placeholder="Add custom product or service..."
                className="flex-1 px-3 py-2 text-sm border border-amber-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <button
                onClick={() => addProduct(customProduct)}
                className="px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Selected Products */}
            {products.length > 0 && (
              <div className="mt-3 pt-3 border-t border-amber-100">
                <div className="flex flex-wrap gap-2">
                  {products.map((product) => (
                    <span
                      key={product}
                      className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full flex items-center gap-1"
                    >
                      {product}
                      <button
                        onClick={() => removeProduct(product)}
                        className="ml-1 hover:text-amber-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-purple-600" />
              Features / Specialties
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Highlight what makes your business special (suggestions based on {category})
            </p>
            
            {/* Suggested Features */}
            <div className="flex flex-wrap gap-2 mb-3">
              {categoryFeatures[category].slice(0, 6).map((feature) => (
                <button
                  key={feature}
                  onClick={() => addFeature(feature)}
                  disabled={features.includes(feature)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer ${
                    features.includes(feature)
                      ? 'bg-purple-100 border-purple-300 text-purple-700 cursor-default'
                      : 'bg-white border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300'
                  }`}
                >
                  {features.includes(feature) ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {feature}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Plus className="w-3 h-3" />
                      {feature}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            {/* Custom Feature Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customFeature}
                onChange={(e) => setCustomFeature(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature(customFeature))}
                placeholder="Add custom feature or specialty..."
                className="flex-1 px-3 py-2 text-sm border border-purple-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <button
                onClick={() => addFeature(customFeature)}
                className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Selected Features */}
            {features.length > 0 && (
              <div className="mt-3 pt-3 border-t border-purple-100">
                <div className="flex flex-wrap gap-2">
                  {features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full flex items-center gap-1"
                    >
                      {feature}
                      <button
                        onClick={() => removeFeature(feature)}
                        className="ml-1 hover:text-purple-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Platform Redirects */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Platform Redirects
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Enable review links that customers will be redirected to when they scan the QR code
            </p>
            
            <div className="space-y-4">
              {platforms.map((platform) => (
                <div key={platform.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={platformsEnabled[platform.id]}
                        onChange={() => togglePlatform(platform.id)}
                        className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <span className="font-medium text-gray-700">{platform.name}</span>
                    </label>
                  </div>
                  
                  {platformsEnabled[platform.id] && (
                    <div className="mt-2">
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="url"
                          value={platformUrls[platform.id]}
                          onChange={(e) => {
                            setPlatformUrls((prev) => ({ ...prev, [platform.id]: e.target.value }));
                            if (errors[`platform_${platform.id}`]) {
                              setErrors((prev) => ({ ...prev, [`platform_${platform.id}`]: '' }));
                            }
                          }}
                          placeholder={platform.url}
                          className={`w-full pl-10 pr-4 py-2 text-sm border rounded-lg outline-none transition-all ${
                            errors[`platform_${platform.id}`]
                              ? 'border-red-300 focus:ring-red-500'
                              : 'border-gray-200 focus:ring-pink-500 focus:border-pink-500'
                          }`}
                        />
                      </div>
                      {errors[`platform_${platform.id}`] && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors[`platform_${platform.id}`]}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Custom Platform Redirects */}
              <div className="p-4 bg-gradient-to-r from-cyan-50 to-indigo-50 rounded-xl border border-cyan-100">
                <div className="flex items-center gap-2 mb-3">
                  <Link2 className="w-4 h-4 text-cyan-600" />
                  <label className="font-medium text-gray-700">Custom Platform Buttons</label>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Add custom buttons for other review platforms (e.g., TripAdvisor, Custom Review Site, etc.)
                </p>
                
                {/* Add Custom Redirect Form */}
                <div className="space-y-2 mb-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newRedirectName}
                      onChange={(e) => setNewRedirectName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomRedirect())}
                      placeholder="Platform name (e.g., TripAdvisor)"
                      className="flex-1 px-3 py-2 text-sm border border-cyan-200 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                    <button
                      onClick={addCustomRedirect}
                      disabled={!newRedirectName.trim() || !newRedirectUrl.trim()}
                      className="px-3 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="url"
                    value={newRedirectUrl}
                    onChange={(e) => setNewRedirectUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomRedirect())}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-sm border border-cyan-200 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                
                {/* Added Custom Redirects */}
                {customRedirects.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium">Added ({customRedirects.length}):</p>
                    {customRedirects.map((redirect) => (
                      <div
                        key={redirect.id}
                        className="flex items-center justify-between p-2 bg-white rounded-lg border border-cyan-100"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Link2 className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700 truncate">
                            {redirect.name}
                          </span>
                          <span className="text-xs text-gray-400 truncate hidden sm:inline">
                            {redirect.url}
                          </span>
                        </div>
                        <button
                          onClick={() => removeCustomRedirect(redirect.id)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreateQR}
            disabled={isCreating}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg shadow-pink-200 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate QR Code
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
