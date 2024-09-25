import { loginFormSchema } from '@/utils/validationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signIn } from '@/utils/authService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useErrorHandler } from '@/utils/hooks/useErrorHandler';
import SocialLogins from './SocialLogins';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const handleError = useErrorHandler();

  // Initialize form with Zod schema validation
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { isSubmitting } = form.formState;
  const [isSocialLoginInProgress, setIsSocialLoginInProgress] = useState(false);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    try {
      const { email, password } = values;
      const result = await signIn(email, password);

      // Handle different authentication scenarios
      if (result.type === 'SOFTWARE_TOKEN_MFA') {
        navigate('/mfa', { state: { email } });
      } else if (result.type === 'MFASetup') {       
        navigate('/mfa', { state: { secretCode: result.secretCode, email } });
      }
    }catch (error) {
      handleError(error, values.email);
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
        <Button type="submit"  disabled={isSubmitting || isSocialLoginInProgress}>
          Submit
        </Button>
        <SocialLogins
          isSubmitting={isSubmitting}
          isSocialLoginInProgress={isSocialLoginInProgress}
          setIsSocialLoginInProgress={setIsSocialLoginInProgress}
        />
      </form>
    </Form>
  );
};

export default LoginForm;
