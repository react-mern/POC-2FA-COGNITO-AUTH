import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { useToast } from '../ui/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { mfaFormSchema } from '@/utils/validationSchema';
import { verifyTOTP } from '@/utils/authService';

const MFAForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const secretCode = location.state?.secretCode;
  const isMFAEnabled = !secretCode;
  
  const { toast } = useToast();
  const form = useForm<z.infer<typeof mfaFormSchema>>({
    resolver: zodResolver(mfaFormSchema),
    defaultValues: {
      totpCode: '',
    },
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof mfaFormSchema>) => {
    try {
      const { totpCode } = values;
      const session = localStorage.getItem('session');

      if (!session) {
        throw new Error('No session found');
      }

      const result = await verifyTOTP(session, totpCode,email, isMFAEnabled);

      if (result?.type === 'Success') {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/home');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          description: error.message,
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <>
      {secretCode && (
        <div className="mb-4 mx-auto w-[100px]">
          <QRCode
            size={256}
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            value={`otpauth://totp/cognito:vanshita?secret=${secretCode}&issuer=Cognito&algorithm=SHA1&digits=6&period=50`}
            viewBox={`0 0 256 256`}
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
