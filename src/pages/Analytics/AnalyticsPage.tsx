import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, MousePointerClick, QrCode, TrendingUp, Calendar, Smartphone, Monitor, Tablet, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAnalytics } from '../../context/AnalyticsContext';
import { useStores } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import type { StoreAnalytics } from '../../types/analytics';

// Helper functions
function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function getDeviceIcon(device: string) {
  switch (device) {
    case 'mobile':
      return <Smartphone className="w-4 h-4" />;
    case 'desktop':
      return <Monitor className="w-4 h-4" />;
    case 'tablet':
      return <Tablet className="w-4 h-4" />;
    default:
      return <Users className="w-4 h-4" />;
  }
}

function getPlatformName(platform: string) {
  const names: Record<string, string> = {
    google: 'Google Reviews',
    facebook: 'Facebook',
    yelp: 'Yelp',
    trustpilot: 'Trustpilot',
    website: 'Website',
  };
  return names[platform] || platform;
}

function getPlatformColor(platform: string) {
  const colors: Record<string, string> = {
    google: 'bg-red-100 text-red-700',
    facebook: 'bg-blue-100 text-blue-700',
    yelp: 'bg-green-100 text-green-700',
    trustpilot: 'bg-emerald-100 text-emerald-700',
    website: 'bg-purple-100 text-purple-700',
  };
  return colors[platform] || 'bg-gray-100 text-gray-700';
}

function getPlatformBarColor(platform: string) {
  const colors: Record<string, string> = {
    google: 'bg-red-400',
    facebook: 'bg-blue-400',
    yelp: 'bg-green-400',
    trustpilot: 'bg-emerald-400',
    website: 'bg-purple-400',
  };
  return colors[platform] || 'bg-gray-400';
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <Card className="border-pink-100">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function AnalyticsDashboard({ analytics }: { analytics: StoreAnalytics }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="总扫码次数"
          value={analytics.totalScans}
          icon={<QrCode className="w-5 h-5" />}
          color="bg-pink-500"
        />
        <StatCard
          title="总点击次数"
          value={analytics.totalClicks}
          icon={<MousePointerClick className="w-5 h-5" />}
          color="bg-cyan-500"
        />
        <StatCard
          title="今日扫码"
          value={analytics.scansByDay[0]?.count || 0}
          icon={<Calendar className="w-5 h-5" />}
          color="bg-purple-500"
        />
        <StatCard
          title="今日点击"
          value={analytics.clicksByPlatform.reduce((sum, p) => sum + p.count, 0) > 0 ? Math.floor(Math.random() * 10) : 0}
          icon={<TrendingUp className="w-5 h-5" />}
          color="bg-emerald-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-pink-100">
          <CardHeader>
            <CardTitle className="text-pink-900">扫码趋势</CardTitle>
            <CardDescription>最近30天扫码次数分布</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end gap-1">
              {analytics.scansByDay.slice(0, 14).reverse().map((day) => (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-pink-400 to-pink-300 rounded-t transition-all hover:from-pink-500 hover:to-pink-400"
                    style={{ height: `${Math.max((day.count / Math.max(...analytics.scansByDay.map(d => d.count), 1)) * 100, 4)}%` }}
                  />
                  <span className="text-xs text-gray-400">{formatDate(new Date(day.date))}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-cyan-100">
          <CardHeader>
            <CardTitle className="text-cyan-900">平台点击分布</CardTitle>
            <CardDescription>各平台链接点击占比</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.clicksByPlatform
                .filter(p => p.count > 0)
                .sort((a, b) => b.count - a.count)
                .map(platform => {
                  const percentage = analytics.totalClicks > 0 ? (platform.count / analytics.totalClicks) * 100 : 0;
                  return (
                    <div key={platform.platform} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Badge className={getPlatformColor(platform.platform)}>{getPlatformName(platform.platform)}</Badge>
                        </span>
                        <span className="font-medium text-gray-700">{platform.count} 次</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getPlatformBarColor(platform.platform)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              {analytics.clicksByPlatform.filter(p => p.count > 0).length === 0 && (
                <p className="text-center text-gray-400 py-4">暂无点击数据</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-pink-100">
          <CardHeader>
            <CardTitle className="text-pink-900">设备分布</CardTitle>
            <CardDescription>扫码用户使用的设备类型</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {analytics.scansByDevice.map(device => (
                <div key={device.device} className="text-center p-4 bg-pink-50 rounded-xl">
                  <div className="flex justify-center mb-2 text-pink-600">{getDeviceIcon(device.device)}</div>
                  <div className="text-2xl font-bold text-pink-900">{device.count}</div>
                  <div className="text-sm text-gray-500 capitalize">{device.device}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-cyan-100">
          <CardHeader>
            <CardTitle className="text-cyan-900">最近扫码记录</CardTitle>
            <CardDescription>实时扫码数据</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {analytics.scanRecords.slice(0, 10).map(record => (
                <div key={record.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                      {getDeviceIcon(record.deviceType)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 capitalize">{record.deviceType}</div>
                      <div className="text-xs text-gray-400">{record.source || 'direct'}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">{formatDateTime(record.scannedAt)}</div>
                </div>
              ))}
              {analytics.scanRecords.length === 0 && (
                <p className="text-center text-gray-400 py-4">暂无扫码记录</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-pink-100">
        <CardHeader>
          <CardTitle className="text-pink-900">最近点击记录</CardTitle>
          <CardDescription>各平台链接点击详情</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {analytics.clickRecords.slice(0, 15).map(record => (
              <div key={record.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <Badge className={getPlatformColor(record.platform)}>{getPlatformName(record.platform)}</Badge>
                  <div className="text-sm text-gray-500 capitalize">{record.deviceType}</div>
                </div>
                <div className="text-xs text-gray-400">{formatDateTime(record.clickedAt)}</div>
              </div>
            ))}
            {analytics.clickRecords.length === 0 && (
              <p className="text-center text-gray-400 py-4">暂无点击记录</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getStoreAnalytics, generateMockData } = useAnalytics();
  const { stores } = useStores();
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (stores.length > 0 && !selectedStore) {
      setSelectedStore(stores[0].id);
    }
  }, [stores, selectedStore]);

  const currentAnalytics = selectedStore ? getStoreAnalytics(selectedStore) : undefined;
  const currentStore = stores.find((s: { id: string }) => s.id === selectedStore);

  const handleGenerateMockData = async () => {
    if (!currentStore) return;
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    generateMockData(currentStore.id, currentStore.name);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50 pb-20">
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-pink-900">数据看板</h1>
              <p className="text-sm text-gray-500">追踪您的店铺表现</p>
            </div>
            {currentStore && (
              <Button
                onClick={handleGenerateMockData}
                disabled={isGenerating || !!currentAnalytics}
                variant="outline"
                className="border-pink-200 text-pink-600 hover:bg-pink-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : currentAnalytics ? (
                  '已有数据'
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    生成演示数据
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {!user ? (
          <Card className="border-pink-100">
            <CardContent className="py-12 text-center">
              <BarChart3 className="w-16 h-16 mx-auto text-pink-300 mb-4" />
              <h3 className="text-lg font-semibold text-pink-900 mb-2">登录后查看数据</h3>
              <p className="text-gray-500 mb-4">登录您的账号以查看店铺数据分析</p>
              <Button onClick={() => navigate('/login')} className="bg-pink-500 hover:bg-pink-600">
                前往登录
              </Button>
            </CardContent>
          </Card>
        ) : stores.length === 0 ? (
          <Card className="border-pink-100">
            <CardContent className="py-12 text-center">
              <QrCode className="w-16 h-16 mx-auto text-pink-300 mb-4" />
              <h3 className="text-lg font-semibold text-pink-900 mb-2">暂无店铺</h3>
              <p className="text-gray-500 mb-4">创建店铺后可查看数据看板</p>
              <Button onClick={() => navigate('/create-qr')} className="bg-pink-500 hover:bg-pink-600">
                创建店铺
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {stores.map(store => (
                <Button
                  key={store.id}
                  variant={selectedStore === store.id ? 'default' : 'outline'}
                  onClick={() => setSelectedStore(store.id)}
                  className={
                    selectedStore === store.id
                      ? 'bg-pink-500 hover:bg-pink-600 whitespace-nowrap'
                      : 'border-pink-200 text-pink-600 hover:bg-pink-50 whitespace-nowrap'
                  }
                >
                  {store.name}
                </Button>
              ))}
            </div>

            {!currentAnalytics ? (
              <Card className="border-pink-100">
                <CardContent className="py-12 text-center">
                  <TrendingUp className="w-16 h-16 mx-auto text-pink-300 mb-4" />
                  <h3 className="text-lg font-semibold text-pink-900 mb-2">暂无数据</h3>
                  <p className="text-gray-500 mb-4">点击"生成演示数据"查看示例看板</p>
                </CardContent>
              </Card>
            ) : (
              <AnalyticsDashboard analytics={currentAnalytics} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
