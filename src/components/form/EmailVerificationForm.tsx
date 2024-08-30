import { emailVerificationFormSchema } from '@/utils/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/use-toast';
import { confirmSignUp } from '@/utils/authService';

const EmailVerificationForm = ({ email }: { email: string }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // if (!email) {
  //   defaultValues = {
  //     verificationCode: '',
  //     email: '',
  //   };
  // }
  const form = useForm<z.infer<typeof emailVerificationFormSchema>>({
    resolver: zodResolver(emailVerificationFormSchema),
    defaultValues: {
      verificationCode: '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (
    values: z.infer<typeof emailVerificationFormSchema>
  ) => {
    try {
      const { verificationCode } = values;
      await confirmSignUp(email, verificationCode);
      navigate('/login');
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* {!email && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )} */}
        <FormField
          control={form.control}
          name="verificationCode"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Verification Code" {...field} />
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
  );
};

export default EmailVerificationForm;
