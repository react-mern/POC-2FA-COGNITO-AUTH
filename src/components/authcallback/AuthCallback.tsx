import {
  handleGoogleCallback,
  handleMicrosoftCallback,
} from '@/utils/authService';
import { useErrorHandler } from '@/utils/hooks/useErrorHandler';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback: React.FC = () => {
  const navigate = useNavigate();
  const handleError = useErrorHandler();

  useEffect(() => {
    const provider = localStorage.getItem('provider');

    try {
      switch (provider) {
        case 'google':
          handleGoogleCallback();
          localStorage.setItem('isAuthenticated', 'true');
          navigate('/home');
          break;
        case 'microsoft':
          handleMicrosoftCallback();
          localStorage.setItem('isAuthenticated', 'true');
          navigate('/home');
          break;
        default:
          navigate('/login');
          break;
      }
    } catch (error) {
      handleError(error);
    }
  }, [navigate]);

  return <div>Processing login...</div>;
};

export default Callback;
