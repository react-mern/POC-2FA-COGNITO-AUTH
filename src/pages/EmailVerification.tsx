import Card from '@/components/card/CardLayout';
import ConfirmEmailForm from '@/components/form/EmailVerificationForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { resendVerificationCode } from '@/utils/authService';
import { useErrorHandler } from '@/utils/hooks/useErrorHandler';
import { useLocation } from 'react-router-dom';

const EmailVerificationForm = () => {
  const location = useLocation();
  const { toast } = useToast();
  const handleError = useErrorHandler();

  const email = location.state?.email;

  const resendCode = async () => {
    try {
      await resendVerificationCode(email);
      toast({
        description: 'Please check your email for the verification code.',
      });
    } catch (error) {
      handleError(error);
    }
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
