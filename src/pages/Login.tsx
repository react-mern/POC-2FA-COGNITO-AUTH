import Card from '@/components/card/CardLayout';
import LoginForm from '@/components/form/LoginForm';
import { Button } from '@/components/ui/button';

import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Login</Card.Title>
      </Card.Header>
      <Card.Content>
        <LoginForm />
      </Card.Content>
      <Card.Footer>
        <span className='text-sm'>Don't have an account?</span>
        <Link to="/">
          <Button variant="link" className="ms-1 p-0">
            Signup
          </Button>
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default Login;
