import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "@auth0/auth0-react";
import history from "./utils/history";
import { getAuthConfig, getSolaceConfig } from "./config";
import { SolaceSessionProvider } from "./providers/solace";

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

// Please see https://auth0.github.io/auth0-react/interfaces/Auth0ProviderOptions.html
// for a full list of the available properties on the provider
const authConfig = getAuthConfig();
const solaceConfig = getSolaceConfig();

const providerConfig = {
  domain: authConfig.domain,
  clientId: authConfig.clientId,
  ...(authConfig.audience ? { audience: authConfig.audience } : null),
  redirectUri: window.location.origin,
  onRedirectCallback,
};

ReactDOM.render(
  <Auth0Provider {...providerConfig}>
    <SolaceSessionProvider {...solaceConfig}>
      <App />
    </SolaceSessionProvider>
  </Auth0Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
