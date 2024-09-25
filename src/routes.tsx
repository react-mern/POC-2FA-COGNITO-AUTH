import { createBrowserRouter, useLocation, Navigate, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const Signup = lazy(() => import('./pages/Signup'));
const EmailVerification = lazy(() => import('./pages/EmailVerification'));
const Login = lazy(() => import('./pages/Login'));
const MultiFactorAuth = lazy(() => import('./pages/MultiFactorAuth'));
const HomePage = lazy(() => import('./pages/HomePage'));
const AuthCallback = lazy(() => import('./components/authcallback/AuthCallback'));

const Loader = () => (
  <div className="flex justify-center items-center h-screen">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

function AuthMiddleware({ requireAuth }: { requireAuth: boolean }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const location = useLocation();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  if (
    (location.pathname === '/verify' || location.pathname === '/mfa') &&
    (!location.state || !location.state.email)
  ) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
);

const routes = [
  {
    element: <AuthMiddleware requireAuth={false} />,
    children: [
      { path: '/', element: withSuspense(Signup) },
      { path: '/login', element: withSuspense(Login) },
      { path: '/verify', element: withSuspense(EmailVerification) },
      { path: '/mfa', element: withSuspense(MultiFactorAuth) },
    ],
  },
  {
    element: <AuthMiddleware requireAuth={true} />,
    children: [
      { path: '/home', element: withSuspense(HomePage) },
    ],
  },
  { path: '/callback', element: withSuspense(AuthCallback) },
  { path: '*', element: <div>404 - Page Not Found</div> },
];

export const router = createBrowserRouter(routes);
