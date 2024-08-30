import { loginFormSchema } from '@/utils/validationSchema';
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
import { signIn } from '@/utils/authService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/use-toast';
import { ToastAction } from '../ui/toast';

const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    try {
      const { email, password } = values;
      const result = await signIn(email, password);

      if (result.type === 'SOFTWARE_TOKEN_MFA') {
        navigate('/mfa', { state: { email: email } });
      } else if (result.type === 'MFASetup') {
        navigate('/mfa', {
          state: { secretCode: result.secretCode, email: email },
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        const { name, message } = error;
        toast({
          description: message || 'An error occurred',
          variant: 'destructive',
          ...(name === 'UserNotConfirmedException' && {
            action: (
              <ToastAction
                altText="Confirm Email"
                onClick={() =>
                  navigate('/verify', { state: { email: values.email } })
                }
              >
                Confirm Email
              </ToastAction>
            ),
          }),
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
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

export default LoginForm;
