import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { StoreProvider } from '@/context/StoreContext';
import { AnalyticsProvider } from '@/context/AnalyticsContext';
import { CookieConsentProvider } from '@/context/CookieConsentContext';
import { CookieBanner } from '@/components/gdpr/CookieBanner';
import { Layout } from '@/components/layout/Layout';

// Lazy-loaded pages — each page loads only when navigated to
const PrivacyPolicyPage = lazy(() => import('@/pages/Privacy/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const ImprintPage = lazy(() => import('@/pages/Privacy/ImprintPage').then(m => ({ default: m.ImprintPage })));
const LoginPage = lazy(() => import('@/pages/Login/LoginPage').then(m => ({ default: m.LoginPage })));
const HomePage = lazy(() => import('@/pages/Home/HomePage').then(m => ({ default: m.HomePage })));
const GenerateReviewPage = lazy(() => import('@/pages/GenerateReview/GenerateReviewPage').then(m => ({ default: m.GenerateReviewPage })));
const CreateQRPage = lazy(() => import('@/pages/CreateQR/CreateQRPage').then(m => ({ default: m.CreateQRPage })));
const StoreLandingPage = lazy(() => import('@/pages/StoreLanding/StoreLandingPage').then(m => ({ default: m.StoreLandingPage })));
const TemplateLibraryPage = lazy(() => import('@/pages/TemplateLibrary/TemplateLibraryPage').then(m => ({ default: m.TemplateLibraryPage })));
const CreateTemplatePage = lazy(() => import('@/pages/CreateTemplate/CreateTemplatePage').then(m => ({ default: m.CreateTemplatePage })));
const MyQRCodesPage = lazy(() => import('@/pages/MyQRCodes/MyQRCodesPage').then(m => ({ default: m.MyQRCodesPage })));
const ProfilePage = lazy(() => import('@/pages/Profile/ProfilePage').then(m => ({ default: m.ProfilePage })));
const AnalyticsPage = lazy(() => import('@/pages/Analytics/AnalyticsPage'));
const CreateMenuPage = lazy(() => import('@/pages/CreateMenu/CreateMenuPage'));
const MenuDisplayPage = lazy(() => import('@/pages/MenuDisplay/MenuDisplayPage'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-500 rounded-full animate-spin" />
    </div>
  );
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <SuspenseWrapper>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/store/:storeId" element={<StoreLandingPage />} />
        <Route path="/menu/:menuId" element={<MenuDisplayPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/imprint" element={<ImprintPage />} />
        
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
    </SuspenseWrapper>
  );
}

export default function App() {
  return (
    <HashRouter>
      <CookieConsentProvider>
        <AuthProvider>
          <StoreProvider>
            <AnalyticsProvider>
              <AppRoutes />
              <CookieBanner />
            </AnalyticsProvider>
          </StoreProvider>
        </AuthProvider>
      </CookieConsentProvider>
    </HashRouter>
  );
}
