import React, { useContext } from 'react';

import solace from 'solclientjs';
import { useAuth0 } from "@auth0/auth0-react";


const SolaceSessionContext = React.createContext();

const factoryProps = new solace.SolclientFactoryProperties();
factoryProps.profile = solace.SolclientFactoryProfiles.version10;
solace.SolclientFactory.init(factoryProps);
solace.SolclientFactory.setLogLevel(solace.LogLevel.WARN);

export const SolaceSessionProvider = ({ children, ...props }) => {
  const auth0 = useAuth0();

  const solaceSession = auth0.isAuthenticated ? auth0.getIdTokenClaims().then(claims => {
    const session = solace.SolclientFactory.createSession({
      idToken: claims.__raw,
      ...props,
    });

    session.connect();

    return new Promise((rs, rj) => {
      session.on(solace.SessionEventCode.UP_NOTICE, () => rs(session));
      if(session.getSessionState() === solace.SessionState.Connected) {
        rs(session);
      }
    });
  }) : Promise.resolve();

  return (
    <SolaceSessionContext.Provider value={solaceSession}>
      {children}
    </SolaceSessionContext.Provider>
  );
};

export const useSolaceSession = (didConnect) => {
  const sessionPromise = useContext(SolaceSessionContext);
  sessionPromise.then(session => didConnect(session, solace));
};

export const useSolaceTopic = (topic, messageReceived) => {
  const sessionPromise = useContext(SolaceSessionContext);
  const topicDestination = solace.SolclientFactory.createTopicDestination(topic);
  return React.useEffect(() => {
    let subscribed = false;
    sessionPromise.then(session => {
      if(session) {
        session.on(solace.SessionEventCode.MESSAGE, messageReceived);
        session.subscribe(topicDestination, true, topic, 5000);
        subscribed = true;
      }
    });
    return () => {
      if(subscribed) {
        sessionPromise.then(session => {
          session.unsubscribe(topicDestination, true, topic, 5000);
          session.removeEventListener(solace.SessionEventCode.MESSAGE, messageReceived);
        });
      }
    }
  });
};