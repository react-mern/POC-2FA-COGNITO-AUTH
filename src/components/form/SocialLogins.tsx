import { Button } from '../ui/button';
import { FcGoogle } from 'react-icons/fc';
import { BsMicrosoft } from 'react-icons/bs';
import {
  initiateLoginWithGoogle,
  initiateLoginWithMicrosoft,
} from '@/utils/authService';
import { useErrorHandler } from '@/utils/hooks/useErrorHandler';

interface SocialLoginsProps {
  isSubmitting: boolean;
  isSocialLoginInProgress: boolean;
  setIsSocialLoginInProgress: React.Dispatch<React.SetStateAction<boolean>>;
}

// SocialLogins component for Google and Microsoft login options
const SocialLogins = ({
  isSubmitting,
  isSocialLoginInProgress,
  setIsSocialLoginInProgress,
}: SocialLoginsProps) => {
  const handleError = useErrorHandler();
  const handleSocialLogin = (loginFunction: () => void) => {
    try {
      setIsSocialLoginInProgress(true);
      loginFunction();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting || isSocialLoginInProgress}
          onClick={() => handleSocialLogin(initiateLoginWithGoogle)}
          className="flex items-center justify-center"
        >
          <FcGoogle className="h-5 w-5" />
          <span className="ml-2 hidden sm:inline">Google</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting || isSocialLoginInProgress}
          onClick={() => handleSocialLogin(initiateLoginWithMicrosoft)}
          className="flex items-center justify-center"
        >
          <BsMicrosoft className="h-5 w-5 text-[#00a4ef]" />
          <span className="ml-2 hidden sm:inline">Microsoft</span>
        </Button>
      </div>
    </>
  );
};

export default SocialLogins;
