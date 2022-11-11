import solace from 'solclientjs';
import authConfigJson from "./auth_config.json";
import solaceConfigJson from "./solace_config.json";

export function getAuthConfig() {
  // Configure the audience here. By default, it will take whatever is in the config
  // (specified by the `audience` key) unless it's the default value of "YOUR_API_IDENTIFIER" (which
  // is what you get sometimes by using the Auth0 sample download tool from the quickstart page, if you
  // don't have an API).
  // If this resolves to `null`, the API page changes to show some helpful info about what to do
  // with the audience.
  const audience =
    authConfigJson.audience && authConfigJson.audience !== "YOUR_API_IDENTIFIER"
      ? authConfigJson.audience
      : null;

  return {
    domain: authConfigJson.domain,
    clientId: authConfigJson.clientId,
    ...(audience ? { audience } : null),
  };
}

export function getSolaceConfig() {
  return {
    connectRetries: 2,
    authenticationScheme: solace.AuthenticationScheme.OAUTH2,
    ...solaceConfigJson
  };
}