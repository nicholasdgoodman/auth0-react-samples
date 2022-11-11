import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Profile from "./views/Profile";
import Solace from "./views/Solace";
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";

// styles
import "./App.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
import { useSolaceSession } from "./providers/solace";
initFontAwesome();


const App = () => {
  const auth0 = useAuth0();

  const { isLoading, error } = auth0;

  //TODO: Remove these - only used for troubleshooting and debugging
  Object.assign(window, { auth0 });

  useSolaceSession((session, solace) => {
    console.log('useSolaceSession callback', session);
    Object.assign(window, { session, solace});
  });


  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <Container className="flex-grow-1 mt-5">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/solace-pubsub" component={Solace} />
          </Switch>
        </Container>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
