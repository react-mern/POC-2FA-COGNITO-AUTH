import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { mfaFormSchema } from '@/utils/validationSchema';
import { verifyTOTP } from '@/utils/authService';
import { useErrorHandler } from '@/utils/hooks/useErrorHandler';

const MFAForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const secretCode = location.state?.secretCode;
  const isMFAEnabled = !secretCode;
  
  const handleError = useErrorHandler();

  // Initialize form with Zod schema validation
  const form = useForm<z.infer<typeof mfaFormSchema>>({
    resolver: zodResolver(mfaFormSchema),
    defaultValues: {
      totpCode: '',
    },
  });

  const { isSubmitting } = form.formState;

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof mfaFormSchema>) => {
    try {
      const { totpCode } = values;
      const session = localStorage.getItem('session');

      if (!session) {
        throw new Error('No session found');
      }

      const result = await verifyTOTP(session, totpCode, email, isMFAEnabled);

      if (result?.type === 'Success') {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/home');
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      {secretCode && (
        <div className="mb-6 mx-auto w-[200px]">
          <QRCode
            size={512}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            value={`otpauth://totp/cognito:vanshita?secret=${secretCode}&issuer=Cognito`}
            viewBox={`0 0 512 512`}
          />
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="totpCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="TOTP Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

export default MFAForm;
