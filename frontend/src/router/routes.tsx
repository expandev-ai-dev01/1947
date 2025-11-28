import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { MainLayout } from '@/layouts/MainLayout';
import { useAuthStore } from '@/core/stores/auth';

// Lazy load pages
const HomePage = lazy(() =>
  import('@/pages/Home').then((module) => ({ default: module.HomePage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFound').then((module) => ({ default: module.NotFoundPage }))
);

// Tips Pages
const TipsListPage = lazy(() =>
  import('@/pages/Tips/List').then((module) => ({ default: module.TipsListPage }))
);
const TipDetailPage = lazy(() =>
  import('@/pages/Tips/Detail').then((module) => ({ default: module.TipDetailPage }))
);

// Community Pages
const CommunityListPage = lazy(() =>
  import('@/pages/Community/List').then((module) => ({ default: module.CommunityListPage }))
);
const CommunityDetailPage = lazy(() =>
  import('@/pages/Community/Detail').then((module) => ({ default: module.CommunityDetailPage }))
);

// Admin Pages
const AdminLoginPage = lazy(() =>
  import('@/pages/Admin/Login').then((module) => ({ default: module.AdminLoginPage }))
);
const AdminDashboardPage = lazy(() =>
  import('@/pages/Admin/Dashboard').then((module) => ({ default: module.AdminDashboardPage }))
);
const TipFormPage = lazy(() =>
  import('@/pages/Admin/Tips/Form').then((module) => ({ default: module.TipFormPage }))
);

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense
        fallback={
          <div className="flex h-screen w-screen items-center justify-center">
            <LoadingSpinner />
          </div>
        }
      >
        <MainLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <HomePage /> },

      // Public Routes
      { path: 'tips', element: <TipsListPage /> },
      { path: 'tips/:id', element: <TipDetailPage /> },
      { path: 'community', element: <CommunityListPage /> },
      { path: 'community/:id', element: <CommunityDetailPage /> },

      // Admin Routes
      { path: 'admin/login', element: <AdminLoginPage /> },
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        ),
        children: [
          { path: 'dashboard', element: <AdminDashboardPage /> }, // Alias
        ],
      },
      {
        path: 'admin/tips/new',
        element: (
          <ProtectedRoute>
            <TipFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/tips/:id/edit',
        element: (
          <ProtectedRoute>
            <TipFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/tips/:id',
        element: (
          <ProtectedRoute>
            <TipDetailPage />
          </ProtectedRoute>
        ), // Reuse detail page for admin preview
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export { routes };
