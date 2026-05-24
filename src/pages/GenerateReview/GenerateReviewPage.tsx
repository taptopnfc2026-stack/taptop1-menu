import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { QrCode, Sparkles, Copy, Check, RefreshCw, AlertCircle, ExternalLink, Store, Plus, X, Package, ChevronDown, Sparkle, Link2 } from 'lucide-react';
import { simulateAIGeneration } from '@/lib/utils';
import { useStores } from '@/context/StoreContext';
import type { Store as StoreType, CustomPlatformRedirect } from '@/types';

interface PlatformButton {
  id: string;
  name: string;
  url: string;
  color: string;
  icon?: string;
}

export function GenerateReviewPage() {
  const { stores, getStoreById } = useStores();
  const { storeId } = useParams<{ storeId?: string }>();
  
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [customProduct, setCustomProduct] = useState('');
  const [experience, setExperience] = useState('');
  const [wordCount, setWordCount] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReview, setGeneratedReview] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');

  // Auto-select store if storeId is provided in URL
  useEffect(() => {
    if (storeId && stores.length > 0) {
      const store = getStoreById(storeId);
      if (store) {
        setSelectedStore(store);
        setShowStoreDropdown(false);
      }
    }
  }, [storeId, stores, getStoreById]);

  const handleSelectStore = (store: StoreType) => {
    setSelectedStore(store);
    setSelectedProducts([]);
    setGeneratedReview('');
    setShowStoreDropdown(false);
  };

  const toggleProduct = (product: string) => {
    if (selectedProducts.includes(product)) {
      setSelectedProducts(selectedProducts.filter(p => p !== product));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const addCustomProduct = () => {
    if (customProduct.trim() && !selectedProducts.includes(customProduct.trim())) {
      setSelectedProducts([...selectedProducts, customProduct.trim()]);
      setCustomProduct('');
    }
  };

  const handleGenerate = async () => {
    if (selectedProducts.length === 0) {
      setError('Please select at least one product or service');
      return;
    }
    setError('');
    setIsGenerating(true);
    setGeneratedReview('');

    try {
      const productContext = selectedProducts.join(', ');
      let enhancedInput = productContext;
      
      // Only add experience if provided
      if (experience.trim()) {
        enhancedInput = `${productContext}. ${experience}`;
      }
      
      const review = await simulateAIGeneration(enhancedInput, wordCount);
      setGeneratedReview(review);
    } catch {
      setError('Failed to generate review. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedReview) return;
    try {
      await navigator.clipboard.writeText(generatedReview);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setError('Failed to copy to clipboard');
    }
  };

  // Get all platform buttons for the selected store
  const getPlatformButtons = (): PlatformButton[] => {
    if (!selectedStore) return [];
    
    const buttons: PlatformButton[] = [];
    
    // Add configured standard platforms
    if (selectedStore.googleUrl) {
      buttons.push({
        id: 'google',
        name: 'Google Reviews',
        url: selectedStore.googleUrl,
        color: 'from-blue-500 to-blue-600'
      });
    }
    
    if (selectedStore.facebookUrl) {
      buttons.push({
        id: 'facebook',
        name: 'Facebook',
        url: selectedStore.facebookUrl,
        color: 'from-blue-600 to-blue-700'
      });
    }
    
    if (selectedStore.yelpUrl) {
      buttons.push({
        id: 'yelp',
        name: 'Yelp',
        url: selectedStore.yelpUrl,
        color: 'from-red-500 to-red-600'
      });
    }
    
    if (selectedStore.trustpilotUrl) {
      buttons.push({
        id: 'trustpilot',
        name: 'Trustpilot',
        url: selectedStore.trustpilotUrl,
        color: 'from-green-500 to-green-600'
      });
    }
    
    // Add custom redirects
    if (selectedStore.customRedirects && selectedStore.customRedirects.length > 0) {
      const customColors = [
        'from-purple-500 to-purple-600',
        'from-indigo-500 to-indigo-600',
        'from-teal-500 to-teal-600',
        'from-orange-500 to-orange-600',
        'from-pink-500 to-pink-600',
        'from-cyan-500 to-cyan-600'
      ];
      
      selectedStore.customRedirects.forEach((redirect: CustomPlatformRedirect, index: number) => {
        buttons.push({
          id: redirect.id,
          name: redirect.name,
          url: redirect.url,
          color: customColors[index % customColors.length],
          icon: redirect.icon
        });
      });
    }
    
    return buttons;
  };

  const allProducts = selectedStore?.products || [];
  const allFeatures = selectedStore?.features || [];
  const availableItems = [...allProducts, ...allFeatures];
  const platformButtons = getPlatformButtons();

  // If no stores available, show warning
  if (stores.length === 0 && !selectedStore) {
    return (
      <div className="min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-cyan-50" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 p-8 shadow-lg shadow-pink-100/50 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
              <Store className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Stores Available</h2>
            <p className="text-gray-500 mb-6">
              Please create a store first to generate reviews.
            </p>
            <Link
              to="/create-qr"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Create Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-cyan-50" />
      
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Generate AI Review</h1>
            <p className="text-gray-500 mt-1">
              {selectedStore ? `Review for ${selectedStore.name}` : 'Create authentic reviews'}
            </p>
          </div>
          <Link
            to="/create-qr"
            className="p-3 bg-white rounded-xl border border-pink-100 hover:border-pink-200 hover:shadow-md transition-all cursor-pointer"
          >
            <QrCode className="w-5 h-5 text-pink-600" />
          </Link>
        </div>

        {/* Store Selection - Only show if not pre-selected from URL */}
        {!storeId && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 p-6 mb-6 shadow-lg shadow-pink-100/50">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Store
            </label>
            <div className="relative">
              <button
                onClick={() => setShowStoreDropdown(!showStoreDropdown)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-left flex items-center justify-between hover:border-pink-200 transition-all cursor-pointer"
              >
                {selectedStore ? (
                  <span className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-cyan-400 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                      {selectedStore.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{selectedStore.name}</span>
                      <span className="text-gray-400 text-sm ml-2">({selectedStore.category})</span>
                    </div>
                  </span>
                ) : (
                  <span className="text-gray-400">Select a store to get started...</span>
                )}
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showStoreDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showStoreDropdown && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                  {stores.map((store) => (
                    <button
                      key={store.id}
                      onClick={() => handleSelectStore(store)}
                      className="w-full px-4 py-3 text-left hover:bg-pink-50 flex items-center gap-3 transition-colors cursor-pointer border-b border-gray-50 last:border-b-0"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-cyan-400 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                        {store.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{store.name}</span>
                        <span className="text-gray-400 text-sm ml-2">({store.category})</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selected Store Info (when pre-selected) */}
        {storeId && selectedStore && (
          <div className="bg-gradient-to-r from-pink-50 to-cyan-50 rounded-2xl border border-pink-100 p-4 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {selectedStore.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{selectedStore.name}</h3>
              <p className="text-sm text-gray-500">{selectedStore.category} • {selectedStore.address}</p>
            </div>
          </div>
        )}

        {/* Products/Services Selection */}
        {selectedStore && (
          <>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 p-6 mb-6 shadow-lg shadow-pink-100/50">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-500" />
                Select Products or Services
              </label>
              <p className="text-xs text-gray-500 mb-4">
                Choose what you experienced at {selectedStore.name}
              </p>
              
              {/* Available Items */}
              {availableItems.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {availableItems.map((item) => (
                    <button
                      key={item}
                      onClick={() => toggleProduct(item)}
                      className={`px-4 py-2 text-sm rounded-full border transition-all cursor-pointer ${
                        selectedProducts.includes(item)
                          ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white border-pink-500'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300 hover:bg-pink-50'
                      }`}
                    >
                      {selectedProducts.includes(item) ? (
                        <span className="flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          {item}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Plus className="w-3 h-3" />
                          {item}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 mb-4 italic">
                  This store hasn't added products or services yet.
                </p>
              )}
              
              {/* Custom Product Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customProduct}
                  onChange={(e) => setCustomProduct(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomProduct())}
                  placeholder="Add custom product or service..."
                  className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
                <button
                  onClick={addCustomProduct}
                  className="px-4 py-2 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              {/* Selected Items Display */}
              {selectedProducts.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">
                    Selected ({selectedProducts.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProducts.map((product) => (
                      <span
                        key={product}
                        className="px-3 py-1 bg-pink-100 text-pink-700 text-xs rounded-full flex items-center gap-1"
                      >
                        {product}
                        <button
                          onClick={() => toggleProduct(product)}
                          className="ml-1 hover:text-pink-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Experience Input - Now Optional */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 p-6 mb-6 shadow-lg shadow-pink-100/50">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Sparkle className="w-4 h-4 text-cyan-500" />
                Describe your experience
                <span className="text-xs text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea
                value={experience}
                onChange={(e) => {
                  setExperience(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Share your personal experience... or leave empty and we'll create based on selected products/services."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all resize-none"
              />
              <p className="text-sm text-gray-400 mt-2 flex items-center gap-2">
                <Sparkle className="w-3 h-3" />
                {experience.length > 0 ? `${experience.length} characters` : 'AI will generate content based on your selections'}
              </p>

              {/* Word Count Slider */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Review Length</label>
                  <span className="text-sm font-semibold text-pink-600">{wordCount} words</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={100}
                  step={5}
                  value={wordCount}
                  onChange={(e) => setWordCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                  <span>Short (30)</span>
                  <span>Medium (65)</span>
                  <span>Long (100)</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || selectedProducts.length === 0}
                className="w-full mt-6 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg shadow-pink-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Review
                  </>
                )}
              </button>
            </div>

            {/* Result Card */}
            {generatedReview && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 p-6 shadow-lg shadow-pink-100/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Generated Review</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleGenerate}
                      className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors cursor-pointer"
                      title="Regenerate"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors cursor-pointer"
                    >
                      {isCopied ? (
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
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {generatedReview}
                  </p>
                </div>
                
                {/* Selected Products Used */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedProducts.map((p) => (
                    <span key={p} className="px-2 py-1 bg-amber-50 text-amber-600 text-xs rounded-full">
                      {p}
                    </span>
                  ))}
                </div>
                
                <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  AI-generated content for reference only
                </p>

                {/* Platform Redirect Buttons */}
                {platformButtons.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-pink-100">
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-pink-500" />
                      Submit Your Review
                      <span className="text-xs text-gray-400 font-normal ml-2">
                        ({platformButtons.length} platform{platformButtons.length > 1 ? 's' : ''} available)
                      </span>
                    </h3>
                    
                    {/* Platform Buttons Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {platformButtons.map((platform) => (
                        <a
                          key={platform.id}
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-center gap-3 py-3 px-4 bg-gradient-to-r ${platform.color} text-white font-medium rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-md hover:shadow-lg`}
                        >
                          {platform.icon ? (
                            <span className="text-lg">{platform.icon}</span>
                          ) : (
                            <Link2 className="w-4 h-4" />
                          )}
                          <span className="truncate">{platform.name}</span>
                          <ExternalLink className="w-4 h-4 flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                    
                    <p className="text-xs text-gray-400 mt-3 text-center">
                      Click any button to open the platform and share your review
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tips */}
            <div className="mt-8 p-4 bg-gradient-to-r from-pink-50 to-cyan-50 rounded-xl border border-pink-100">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-500" />
                Tips for Better Results
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Select specific products or services you experienced</li>
                <li>• Add personal experience details for more authentic reviews</li>
                <li>• Adjust length based on platform requirements</li>
              </ul>
            </div>
          </>
        )}

        {/* Switch to QR */}
        <div className="mt-6 text-center">
          <Link
            to="/create-qr"
            className="inline-flex items-center gap-2 text-pink-600 font-medium hover:text-pink-700 cursor-pointer"
          >
            Create a Store QR Code
          </Link>
        </div>
      </div>
    </div>
  );
}
