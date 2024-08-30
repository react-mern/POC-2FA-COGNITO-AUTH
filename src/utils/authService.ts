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




export const cognitoClient = new CognitoIdentityProviderClient({
  region: awsConfig.region,
});

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
    console.error('Error signing up: ', error);
    throw error;
  }
};

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
    console.error('Error confirming sign up: ', error);
    throw error;
  }
};

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
      // MFA is required
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
    console.error('Error signing in: ', error);
    throw error;
  }
};

export const verifyTOTP = async (
  session: string,
  userCode: string,
  email: string,
  isMFAEnabled: boolean
) => {
  try {
    let respondToAuthChallengeResponse;

    if (isMFAEnabled) {
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

      return {
        type: 'Success',
        result: respondToAuthChallengeResponse.AuthenticationResult,
      };
    }
  } catch (error) {
    console.error('Error verifying TOTP: ', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return;
    }
    const command = new GlobalSignOutCommand({
      AccessToken: accessToken,
    });

    await cognitoClient.send(command);

    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('session');
    localStorage.removeItem('isAuthenticated');

  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export const getUser = async () => {
  const accessToken = localStorage.getItem('accessToken')!;

  const userCommand = new GetUserCommand({
    AccessToken: accessToken,
  });

  const response = await cognitoClient.send(userCommand);
  const emailAttribute = response.UserAttributes?.find(
    (attribute) => attribute.Name === 'email'
  );
  if (emailAttribute) {
    const email = emailAttribute.Value;
    return email;
  }
};

export const resendVerificationCode = async (email: string) => {
  const params = {
    ClientId: awsConfig.clientId,
    Username: email,
  };
  try {
    const command = new ResendConfirmationCodeCommand(params);
     await cognitoClient.send(command);
  } catch (error) {
    console.error('Error signing in: ', error);
    throw error;
  }
};
