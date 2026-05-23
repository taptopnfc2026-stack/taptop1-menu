import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { StoreProvider } from '@/context/StoreContext';
import { AnalyticsProvider } from '@/context/AnalyticsContext';
import { Layout } from '@/components/layout/Layout';
import { LoginPage } from '@/pages/Login/LoginPage';
import { HomePage } from '@/pages/Home/HomePage';
import { GenerateReviewPage } from '@/pages/GenerateReview/GenerateReviewPage';
import { CreateQRPage } from '@/pages/CreateQR/CreateQRPage';
import { StoreLandingPage } from '@/pages/StoreLanding/StoreLandingPage';
import { TemplateLibraryPage } from '@/pages/TemplateLibrary/TemplateLibraryPage';
import { CreateTemplatePage } from '@/pages/CreateTemplate/CreateTemplatePage';
import { MyQRCodesPage } from '@/pages/MyQRCodes/MyQRCodesPage';
import { ProfilePage } from '@/pages/Profile/ProfilePage';
import AnalyticsPage from '@/pages/Analytics/AnalyticsPage';
import CreateMenuPage from '@/pages/CreateMenu/CreateMenuPage';
import MenuDisplayPage from '@/pages/MenuDisplay/MenuDisplayPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/store/:storeId" element={<StoreLandingPage />} />
      <Route path="/menu/:menuId" element={<MenuDisplayPage />} />
      
      {/* Protected routes with layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/generate-review" element={<GenerateReviewPage />} />
        <Route path="/generate-review/:storeId" element={<GenerateReviewPage />} />
        <Route path="/create-qr" element={<CreateQRPage />} />
        <Route path="/create-menu" element={<CreateMenuPage />} />
        <Route path="/templates/:storeId" element={<TemplateLibraryPage />} />
        <Route path="/create-template/:storeId" element={<CreateTemplatePage />} />
        <Route
          path="/my-qr-codes"
          element={
            <ProtectedRoute>
              <MyQRCodesPage />
            </ProtectedRoute>
          }
        />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <StoreProvider>
          <AnalyticsProvider>
            <AppRoutes />
          </AnalyticsProvider>
        </StoreProvider>
      </AuthProvider>
    </HashRouter>
  );
}
