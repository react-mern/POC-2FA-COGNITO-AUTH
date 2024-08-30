import Card from '@/components/card/CardLayout';
import { Button } from '@/components/ui/button';
import { getUser, logout } from '@/utils/authService';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [user, setUser] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUser();
        setUser(user!);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
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
