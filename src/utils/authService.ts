import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  AssociateSoftwareTokenCommand,
  VerifySoftwareTokenCommand,
  RespondToAuthChallengeCommand,
  GlobalSignOutCommand,
  GetUserCommand,
  ResendConfirmationCodeCommand,
  AuthFlowType,
} from '@aws-sdk/client-cognito-identity-provider';
import { awsConfig } from './awsConfig';
import { jwtDecode } from 'jwt-decode';

// Initialize Cognito client
export const cognitoClient = new CognitoIdentityProviderClient({
  region: awsConfig.region,
});

// User sign-up function
export const signUp = async (email: string, password: string) => {
  const params = {
    ClientId: awsConfig.clientId,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
    ],
  };
  try {
    const command = new SignUpCommand(params);
    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    throw error;
  }
};

// Confirm sign-up function for verifying user's email
export const confirmSignUp = async (username: string, code: string) => {
  const params = {
    ClientId: awsConfig.clientId,
    Username: username,
    ConfirmationCode: code,
  };
  try {
    const command = new ConfirmSignUpCommand(params);
    await cognitoClient.send(command);

    return true;
  } catch (error) {
    throw error;
  }
};

// Resend verification code function
export const resendVerificationCode = async (email: string) => {
  const params = {
    ClientId: awsConfig.clientId,
    Username: email,
  };
  try {
    const command = new ResendConfirmationCodeCommand(params);
    await cognitoClient.send(command);
  } catch (error) {
    throw error;
  }
};

// User sign-in function
export const signIn = async (username: string, password: string) => {
  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH' as AuthFlowType,
    ClientId: awsConfig.clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const command = new InitiateAuthCommand(params);
    const res = await cognitoClient.send(command);
    const { Session } = res;

    if (res.ChallengeName === 'SOFTWARE_TOKEN_MFA') {
      localStorage.setItem('session', Session || '');
      return { type: 'SOFTWARE_TOKEN_MFA' };
    } else if (Session) {
      // MFA setup is required
      const associateSoftwareTokenCommand = new AssociateSoftwareTokenCommand({
        Session: Session,
      });
      const associateResponse = await cognitoClient.send(
        associateSoftwareTokenCommand
      );

      localStorage.setItem('session', associateResponse.Session || '');
      return {
        type: 'MFASetup',
        secretCode: associateResponse.SecretCode,
        session: associateResponse.Session,
      };
    }

    throw new Error('Unexpected response from Cognito');
  } catch (error) {
    throw error;
  }
};

// Verify TOTP function
export const verifyTOTP = async (
  session: string,
  userCode: string,
  email: string,
  isMFAEnabled: boolean
) => {
  try {
    let respondToAuthChallengeResponse;

    if (isMFAEnabled) {
      // If MFA is enabled, respond to the MFA challenge
      const respondToAuthChallengeCommand = new RespondToAuthChallengeCommand({
        ChallengeName: 'SOFTWARE_TOKEN_MFA',
        ChallengeResponses: {
          USERNAME: email,
          SOFTWARE_TOKEN_MFA_CODE: userCode,
        },
        ClientId: awsConfig.clientId,
        Session: session,
      });
      respondToAuthChallengeResponse = await cognitoClient.send(
        respondToAuthChallengeCommand
      );
    } else {
      // If MFA is not enabled, verify the TOTP code
      const verifySoftwareTokenCommand = new VerifySoftwareTokenCommand({
        Session: session,
        UserCode: userCode,
      });
      const verifySoftwareTokenResponse = await cognitoClient.send(
        verifySoftwareTokenCommand
      );

      if (verifySoftwareTokenResponse.Status === 'SUCCESS') {
        const respondToAuthChallengeCommand = new RespondToAuthChallengeCommand(
          {
            ChallengeName: 'MFA_SETUP',
            ChallengeResponses: { USERNAME: email },
            ClientId: awsConfig.clientId,
            Session: verifySoftwareTokenResponse.Session,
          }
        );
        respondToAuthChallengeResponse = await cognitoClient.send(
          respondToAuthChallengeCommand
        );
      }
    }
    if (respondToAuthChallengeResponse?.AuthenticationResult) {
      const { AccessToken, IdToken, RefreshToken } =
        respondToAuthChallengeResponse.AuthenticationResult;

      localStorage.setItem('idToken', IdToken || '');
      localStorage.setItem('accessToken', AccessToken || '');
      localStorage.setItem('refreshToken', RefreshToken || '');
      localStorage.setItem('provider', 'cognito');

      return {
        type: 'Success',
        result: respondToAuthChallengeResponse.AuthenticationResult,
      };
    }
  } catch (error) {
    throw error;
  }
};

// User logout function
export const logout = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const provider = localStorage.getItem('provider')!;

    if (!accessToken) {
      throw new Error('No access token found');
    }

    if (provider === 'microsoft' || provider === 'google') {
      const cognitoLogoutUrl = `${awsConfig.cognitoDomain}/logout?client_id=${
        awsConfig.clientId
      }&logout_uri=${encodeURIComponent(awsConfig.logoutRedirectUri)}`;
      window.location.href = cognitoLogoutUrl;
    } else {
      const command = new GlobalSignOutCommand({ AccessToken: accessToken });
      await cognitoClient.send(command);
      
    }

    localStorage.clear();
  } catch (error) {
    throw error;
  }
};

// Get user function
export const getUser = async () => {
  const accessToken = localStorage.getItem('accessToken')!;
  const provider = localStorage.getItem('provider')!;
  const idToken = localStorage.getItem('idToken');

  if (!accessToken || !idToken) {
    throw new Error('No tokens found');
  }

  if (provider === 'microsoft' || provider === 'google') {
    const decodedToken = jwtDecode(idToken) as any;
    return decodedToken.email || decodedToken.preferred_username;
  } else {
    const userCommand = new GetUserCommand({
      AccessToken: accessToken,
    });

    const response = await cognitoClient.send(userCommand);
    const emailAttribute = response.UserAttributes?.find(
      (attribute) => attribute.Name === 'email'
    );
    return emailAttribute?.Value;
  }
};

// Initiate login with Microsoft
export const initiateLoginWithMicrosoft = () => {
  localStorage.setItem('provider', 'microsoft');
  const microsoftLoginUrl =
    `${awsConfig.cognitoDomain}/oauth2/authorize?` +
    `client_id=${awsConfig.clientId}&` +
    `response_type=token&` +
    `scope=openid email profile&` +
    `redirect_uri=${encodeURIComponent(awsConfig.redirectUri)}&` +
    `identity_provider=Microsoft`;

  window.location.href = microsoftLoginUrl;
};

// Initiate login with Google
export const initiateLoginWithGoogle = () => {
  localStorage.setItem('provider', 'google');
  const googleLoginUrl =
    `${awsConfig.cognitoDomain}/oauth2/authorize?` +
    `client_id=${awsConfig.clientId}&` +
    `response_type=token&` +
    `scope=openid email profile&` +
    `redirect_uri=${encodeURIComponent(awsConfig.redirectUri)}&` +
    `identity_provider=Google`;

  window.location.href = googleLoginUrl;
};

// Handle Microsoft callback
export const handleMicrosoftCallback = () => {
  const hash = window.location.hash.substr(1);
  const result = hash.split('&').reduce((result: any, item) => {
    const parts = item.split('=');
    result[parts[0]] = parts[1];
    return result;
  }, {});

  if (result.access_token && result.id_token) {
    localStorage.setItem('accessToken', result.access_token);
    localStorage.setItem('idToken', result.id_token);
    return {
      accessToken: result.access_token,
      idToken: result.id_token,
    };
  } else {
    throw new Error('Failed to get tokens from the callback URL');
  }
};

// Handle Google callback
export const handleGoogleCallback = () => {
  const hash = window.location.hash.substr(1);
  const result = hash.split('&').reduce((result: any, item) => {
    const parts = item.split('=');
    result[parts[0]] = parts[1];
    return result;
  }, {});

  if (result.access_token && result.id_token) {
    localStorage.setItem('accessToken', result.access_token);
    localStorage.setItem('idToken', result.id_token);

    return {
      accessToken: result.access_token,
      idToken: result.id_token,
    };
  } else {
    throw new Error('Failed to get tokens from the callback URL');
  }
};
