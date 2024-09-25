import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useNavigate } from 'react-router-dom';

export const useErrorHandler = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleError = (error: unknown, email?: string) => {
    if (error instanceof Error) {
      const { name, message } = error;
      toast({
        description: message || 'An error occurred',
        variant: 'destructive',
        ...(name === 'UserNotConfirmedException' &&
          email && {
            action: (
              <ToastAction
                altText="Confirm Email"
                onClick={() => navigate('/verify', { state: { email } })}
              >
                Confirm Email
              </ToastAction>
            ),
          }),
      });
    }
  };

  return handleError;
};
