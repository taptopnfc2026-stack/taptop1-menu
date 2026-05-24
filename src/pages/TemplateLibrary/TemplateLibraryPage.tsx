import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Plus,
  FileText,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useStores } from '@/context/StoreContext';
import { getStoreRedirectUrl } from '@/lib/utils';
import type { Platform } from '@/types';

export function TemplateLibraryPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { getStoreById, getTemplatesByStoreId, markTemplateUsed, deleteTemplate } = useStores();
  const [activeTab, setActiveTab] = useState<'unused' | 'used'>('unused');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const store = storeId ? getStoreById(storeId) : undefined;
  const allTemplates = storeId ? getTemplatesByStoreId(storeId) : [];
  const filteredTemplates = allTemplates.filter((t) => 
    activeTab === 'unused' ? t.status === 'unused' : t.status === 'used'
  );

  const handleCopy = async (templateId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(templateId);
      markTemplateUsed(templateId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  const handleDelete = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteTemplate(templateId);
    }
  };

  const handlePlatformRedirect = (platform: Platform) => {
    if (!store) return;
    const url = getStoreRedirectUrl(store, platform);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (!store) {
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
      
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-xl border border-pink-100 hover:border-pink-200 hover:shadow-md transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Template Library</h1>
            <p className="text-gray-500 text-sm">{store.name}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('unused')}
            className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'unused'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-600 hover:bg-pink-50'
            }`}
          >
            Unused ({allTemplates.filter((t) => t.status === 'unused').length})
          </button>
          <button
            onClick={() => setActiveTab('used')}
            className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
              activeTab === 'used'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-600 hover:bg-pink-50'
            }`}
          >
            Used ({allTemplates.filter((t) => t.status === 'used').length})
          </button>
        </div>

        {/* Template List */}
        {filteredTemplates.length > 0 ? (
          <div className="space-y-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-pink-100 p-4 shadow-lg shadow-pink-100/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-gray-700 leading-relaxed">{template.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        template.status === 'unused' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {template.status === 'unused' ? 'Unused' : 'Used'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleCopy(template.id, template.content)}
                      className={`p-2 rounded-lg transition-all cursor-pointer ${
                        copiedId === template.id
                          ? 'bg-green-100 text-green-600'
                          : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                      }`}
                      title="Copy to clipboard"
                    >
                      {copiedId === template.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all cursor-pointer"
                      title="Delete template"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Platform Buttons */}
                {template.status === 'unused' && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-pink-100">
                    <button
                      onClick={() => handlePlatformRedirect('google')}
                      className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      Google
                    </button>
                    <button
                      onClick={() => handlePlatformRedirect('facebook')}
                      className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      Facebook
                    </button>
                    <button
                      onClick={() => handlePlatformRedirect('yelp')}
                      className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      Yelp
                    </button>
                    <button
                      onClick={() => handlePlatformRedirect('trustpilot')}
                      className="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                    >
                      Trustpilot
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-pink-100 p-8 shadow-lg text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-pink-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab === 'unused' ? 'No unused templates' : 'No used templates'}
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'unused' 
                ? 'Create templates to build your library' 
                : 'Copy templates to use them'}
            </p>
            <Link
              to={storeId ? `/create-template/${storeId}` : '/'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Create Templates
            </Link>
          </div>
        )}

        {/* Footer */}
        {allTemplates.length > 0 && (
          <div className="mt-8 pt-6 border-t border-pink-100 text-center">
            <Link
              to={storeId ? `/create-template/${storeId}` : '/'}
              className="inline-flex items-center gap-2 text-pink-600 font-medium hover:text-pink-700 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create More Templates
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
