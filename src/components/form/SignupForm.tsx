import { signUpFormSchema } from '@/utils/validationSchema';
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
import {
  signUp,
} from '@/utils/authService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useErrorHandler } from '@/utils/hooks/useErrorHandler';
import SocialLogins from './SocialLogins';

const SignupForm: React.FC = () => {
  const navigate = useNavigate();

  // Initialize form with Zod schema validation
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [isSocialLoginInProgress, setIsSocialLoginInProgress] = useState(false);
  const { isSubmitting } = form.formState;
  const handleError = useErrorHandler();

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
    try {
      const { email, password } = values;
      await signUp(email, password);
      navigate('/verify', { state: { email } });
    } catch (error) {
      handleError(error);
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting || isSocialLoginInProgress}
          className="w-full"
        >
          Sign Up
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

export default SignupForm;
