import Card from '@/components/card/CardLayout';
import ConfirmEmailForm from '@/components/form/EmailVerificationForm';
import { Button } from '@/components/ui/button';
import { resendVerificationCode } from '@/utils/authService';
import { useLocation } from 'react-router-dom';

const EmailVerificationForm = () => {
  const location = useLocation();

  const email = location.state?.email;

  const resendCode = () => {
    resendVerificationCode(email);
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Email Confirmation</Card.Title>
      </Card.Header>
      <Card.Content>
        <ConfirmEmailForm email={email} />
      </Card.Content>
      <Card.Footer>
        <Button variant="secondary" onClick={resendCode}>
          Resend verification code
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default EmailVerificationForm;
