import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Plus,
  AlertCircle
} from 'lucide-react';
import { useStores } from '@/context/StoreContext';
import { generateBulkReviews, generateId } from '@/lib/utils';

export function CreateTemplatePage() {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { getStoreById, addBulkTemplates } = useStores();
  
  const [highlights, setHighlights] = useState('');
  const [templateCount, setTemplateCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTemplates, setGeneratedTemplates] = useState<string[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<Set<number>>(new Set());
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const store = storeId ? getStoreById(storeId) : undefined;

  const handleGenerate = async () => {
    if (!highlights.trim()) {
      setError('Please describe your business highlights');
      return;
    }
    
    setError('');
    setIsGenerating(true);
    setGeneratedTemplates([]);
    setSelectedTemplates(new Set());
    setSaved(false);

    try {
      const templates = await generateBulkReviews(highlights, templateCount);
      setGeneratedTemplates(templates);
      // Select all by default
      setSelectedTemplates(new Set(templates.map((_, i) => i)));
    } catch {
      setError('Failed to generate templates. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTemplate = (index: number) => {
    setSelectedTemplates((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedTemplates(new Set(generatedTemplates.map((_, i) => i)));
  };

  const handleSaveToLibrary = () => {
    if (!storeId || selectedTemplates.size === 0) return;

    const templates = Array.from(selectedTemplates).map((index) => ({
      id: generateId(),
      storeId,
      content: generatedTemplates[index],
      status: 'unused' as const,
      createdAt: new Date(),
    }));

    addBulkTemplates(templates);
    setSaved(true);
    
    setTimeout(() => {
      navigate(`/templates/${storeId}`);
    }, 1500);
  };

  if (!store && storeId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h2>
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

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-cyan-50" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-xl border border-pink-100 hover:border-pink-200 hover:shadow-md transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Review Templates</h1>
            {store && <p className="text-gray-500 text-sm">{store.name}</p>}
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 p-6 mb-6 shadow-lg shadow-pink-100/50">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Highlights
          </label>
          <textarea
            value={highlights}
            onChange={(e) => {
              setHighlights(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g., friendly staff, delicious food, cozy atmosphere, great service, clean environment..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all resize-none"
          />
          <p className="text-sm text-gray-400 mt-2">
            Describe what makes your business special
          </p>

          {/* Template Count Slider */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Number of Templates</label>
              <span className="text-sm font-semibold text-pink-600">{templateCount}</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              value={templateCount}
              onChange={(e) => setTemplateCount(parseInt(e.target.value))}
              className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
              <span>1</span>
              <span>10</span>
              <span>20</span>
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
            disabled={isGenerating || !highlights.trim()}
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
                Generate Templates
              </>
            )}
          </button>
        </div>

        {/* Generated Templates */}
        {generatedTemplates.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 p-6 shadow-lg shadow-pink-100/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Generated Templates ({selectedTemplates.size}/{generatedTemplates.length} selected)
              </h2>
              <button
                onClick={selectAll}
                className="text-sm text-pink-600 font-medium hover:text-pink-700 cursor-pointer"
              >
                Select All
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {generatedTemplates.map((template, index) => (
                <div
                  key={index}
                  onClick={() => toggleTemplate(index)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedTemplates.has(index)
                      ? 'bg-pink-50 border-pink-300'
                      : 'bg-gray-50 border-gray-200 hover:border-pink-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-all ${
                        selectedTemplates.has(index)
                          ? 'bg-pink-500 border-pink-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedTemplates.has(index) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed flex-1">{template}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveToLibrary}
              disabled={selectedTemplates.size === 0 || saved}
              className="w-full mt-6 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-200 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {saved ? (
                <>
                  <Check className="w-5 h-5" />
                  Saved to Library!
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Save {selectedTemplates.size} Templates to Library
                </>
              )}
            </button>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 p-4 bg-gradient-to-r from-pink-50 to-cyan-50 rounded-xl border border-pink-100">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-500" />
            Tips for Better Templates
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Focus on unique selling points (e.g., "authentic Italian recipes")</li>
            <li>• Include service qualities (e.g., "attentive staff", "quick service")</li>
            <li>• Mention atmosphere and ambiance</li>
            <li>• Select all templates you want to save</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
