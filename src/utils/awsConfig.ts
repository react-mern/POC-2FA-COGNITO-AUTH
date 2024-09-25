export const awsConfig = {
  userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
  clientId: import.meta.env.VITE_AWS_CLIENT_ID,
  region: import.meta.env.VITE_AWS_REGION,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  cognitoDomain: import.meta.env.VITE_COGNITO_DOMAIN,
  redirectUri: import.meta.env.VITE_REDIRECT_URI,
  logoutRedirectUri: import.meta.env.VITE_LOGOUT_REDIRECT_URI
};

export const oidcConfig = {
  authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MICROSOFT_TENANT_ID}/v2.0`,
  client_id: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  response_type: 'id_token token',
  scope: 'openid profile email',
  post_logout_redirect_uri: import.meta.env.VITE_LOGOUT_REDIRECT_URI,
};



