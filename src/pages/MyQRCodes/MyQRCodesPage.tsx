import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  Plus, 
  QrCode, 
  Trash2, 
  Download,
  ExternalLink,
  AlertCircle,
  Store
} from 'lucide-react';
import { useStores } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/utils';

export function MyQRCodesPage() {
  const navigate = useNavigate();
  const { stores, deleteStore } = useStores();
  const { isAuthenticated } = useAuth();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Check authentication on page load - redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleDelete = (storeId: string) => {
    if (deleteConfirm === storeId) {
      deleteStore(storeId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(storeId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const downloadQR = (storeId: string, storeName: string) => {
    const canvas = document.querySelector(`#qr-${storeId} canvas`) as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${storeName.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-cyan-50" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My QR Codes</h1>
            <p className="text-gray-500 mt-1">{stores.length} store{stores.length !== 1 ? 's' : ''} connected</p>
          </div>
          <Link
            to="/create-qr"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Create QR</span>
          </Link>
        </div>

        {/* QR List */}
        {stores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stores.map((store) => (
              <div
                key={store.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 p-6 shadow-lg shadow-pink-100/50 hover:border-pink-200 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg flex items-center justify-center">
                      <Store className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{store.name}</h3>
                      <p className="text-sm text-gray-500">{store.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => downloadQR(store.id, store.name)}
                      className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors cursor-pointer"
                      title="Download QR"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(store.id)}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        deleteConfirm === store.id
                          ? 'bg-red-100 text-red-600'
                          : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                      }`}
                      title={deleteConfirm === store.id ? 'Click again to confirm' : 'Delete'}
                    >
                      {deleteConfirm === store.id ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white rounded-xl border border-pink-100">
                    <QRCodeCanvas
                      id={`qr-${store.id}`}
                      value={`${window.location.origin}/store/${store.id}`}
                      size={140}
                      level="H"
                      includeMargin
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    {store.address}
                  </p>
                  <p className="text-xs text-gray-400">
                    Created {formatDate(store.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/store/${store.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-pink-50 text-pink-600 font-medium rounded-lg hover:bg-pink-100 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Page
                  </Link>
                  <Link
                    to={`/templates/${store.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-cyan-50 text-cyan-600 font-medium rounded-lg hover:bg-cyan-100 transition-colors cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    Templates
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100 p-12 shadow-lg text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center">
              <QrCode className="w-10 h-10 text-pink-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No QR Codes Yet</h2>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Create your first store QR code to start collecting reviews from your customers.
            </p>
            <Link
              to="/create-qr"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Create Your First QR
            </Link>
          </div>
        )}

        {/* Help Text */}
        {stores.length > 0 && (
          <div className="mt-8 p-4 bg-gradient-to-r from-pink-50 to-cyan-50 rounded-xl border border-pink-100">
            <h3 className="font-semibold text-gray-900 mb-2">How to use</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Download and print your QR codes</li>
              <li>• Place them at checkout or entrance</li>
              <li>• Customers scan to leave reviews directly</li>
              <li>• Track performance in your analytics</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
