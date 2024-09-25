import Card from '@/components/card/CardLayout';
import { Button } from '@/components/ui/button';
import { getUser, logout } from '@/utils/authService';
import { useErrorHandler } from '@/utils/hooks/useErrorHandler';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [user, setUser] = useState<string>('');
  const navigate = useNavigate();
  const handleError = useErrorHandler();

 // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUser();
        setUser(user!);
      } catch (error) {
       handleError(error);
      }
    };
    fetchUserData();
  }, []);

  // Handle user logout
  const handleLogout = async () => {
    try {
      const provider=localStorage.getItem('provider')
      await logout();
      if(provider==='cognito'){
        navigate('/login');
      }
    } catch (error) {
      handleError(error);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <Card.Header>
          <Card.Title>Dashboard</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="text-sm mb-4">Welcome, {user}!</div>
          <Button onClick={handleLogout}>Logout</Button>
        </Card.Content>
      </Card>
    </>
  );
};

export default HomePage;
