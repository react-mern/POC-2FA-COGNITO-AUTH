# aws-cognito-2MFA
This Proof of Concept (POC) demonstrates AWS Cognito authentication flow that combines traditional username/password login with an additional layer of security.
- **2-Factor Authentication (2FA)**: Using TOTP (Time-based One-Time Password) for additional authentication security.
- **Social Logins**: Google and Microsoft sign-in integrations are added to provide users with seamless login experiences.

### Live Link : [Authentication with 2FA](https://main--aws-cognito-auth.netlify.app/)

### Demo Video
Here’s a quick demo of the application and configuration process:  
[Watch the Step-by-Step Configuration Demo](https://www.loom.com/share/47919b85015b4e71a0d8ecd3431ce1ea)

## Benefits:

- **Enhanced Security**: Adds an extra layer of protection using 2-Factor Authentication (TOTP).
- **Seamless Social Logins**: Simplifies user authentication via Google and Microsoft.
- **Built-in Security**: Automatic token handling and support for OAuth 2.0, SAML, and OIDC.
- **Cost-Effective**: Free tier available for up to 50,000 monthly active users.
- **Customizable**: Tailor user attributes and authentication flows to your needs.
- **AWS Integration**: Easily connects with other AWS services like Lambda, API Gateway, and S3.

## Quick Start

### Setting up Google Credentials
1. Go to the Google Cloud Console
2. Create a new project or select an existing one
3. Go to credentials.Create OAuth 2.0 credentials
4. Set the authorized JavaScript origins and redirect URIs
    ```bash
    Authorised JavaScript origins: <Your-cognito-domain>
    Authorised redirect URIs: <Your-cognito-domain>/oauth2/idpresponse
    ```
5. Note your Google Client ID and secret.

### Setting up Microsoft Azure Credentials

1. Sign in to the Azure portal
2. Register a new application in Azure Active Directory
3. Configure platform settings for a single-page application
4. Add redirect URIs
    ```bash
    <Your-cognito-domain>/oauth2/idpresponse
    ```
5. Note your Microsoft Client ID and Tenant ID
6. Issuer URL:(for later user in cognito user pool configuration) 
    ```bash
    https://login.microsoftonline.com/<your-tenant-id>/v2.0
    ``` 

### Creating an AWS Cognito User Pool
1. Sign in to the AWS Management Console
2. Navigate to the Cognito service
3. Create a new User Pool
4. Configure sign-in options and security requirements
5. Go to app integration. Set up the app client and domain
    ```bash
    callback URL: <Your-app-url>/callback
    SignOut Redirect URL: <Your-app-url>/login
    ```
6. Note your User Pool ID, App Client ID(from security credentials), and Cognito domain
6. Configure identity providers (add Google and Microsoft)
7. Note your User Pool ID, App Client ID(from security credentials), and Cognito domain

### Installation
1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/react-mern/POC-2FA-COGNITO-AUTH.git
   cd POC-2FA-COGNITO-AUTH
   npm install

2. **Set up environment variables**

   Create a `.env` file in the root of your project and add the following variables:
    ```bash
    VITE_AWS_USER_POOL_ID=<Your AWS User Pool ID>

    VITE_AWS_CLIENT_ID=<Your AWS Client ID>

    VITE_AWS_REGION=<Your AWS Region>

    VITE_COGNITO_DOMAIN=<Your Cognito Domain>

    VITE_GOOGLE_CLIENT_ID=<Your Google Client ID>

    VITE_MICROSOFT_TENANT_ID=<Your Microsoft Tenant ID>

    VITE_MICROSOFT_CLIENT_ID=<Your Microsoft Client ID>

    VITE_REDIRECT_URI=<Your Redirect URI>

    VITE_LOGOUT_REDIRECT_URI=<Your Logout Redirect URI>

    VITE_BASE_URL=<Your Base URL>

    ```
3. **Run the application**
   ```bash
   npm run dev

## Conclusion

This README provides a solid foundation for your AWS Cognito 2FA project, including an introduction, benefits, setup steps, and getting started guide. You can further customize it based on specific features or requirements of your implementation.


## Author

**Name:** Vanshita Shah  
**Email:** vanshita.s@simformsolutions.com