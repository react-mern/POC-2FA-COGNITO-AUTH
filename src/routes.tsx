import {
  createBrowserRouter,
  useLocation,
} from 'react-router-dom';
import Signup from './pages/Signup';
import ConfirmEmail from './pages/EmailVerification';
import Login from './pages/Login';
import MultiFactorAuth from './pages/MultiFactorAuth';
import HomePage from './pages/HomePage';

import { Navigate, Outlet } from 'react-router-dom';

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

export const router = createBrowserRouter([
  {
    element: <AuthMiddleware requireAuth={false} />,
    children: [
      {
        path: '/',
        element: <Signup />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/verify',
        element: <ConfirmEmail />,
      },
      {
        path: '/mfa',
        element: <MultiFactorAuth />,
      },
    ],
  },
  {
    element: <AuthMiddleware requireAuth={true} />,
    children: [
      {
        path: '/home',
        element: <HomePage />,
      },
    ],
  },
  {
    path: '*',
    element: <div>404</div>,
  },
]);
