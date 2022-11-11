import React from "react";
import { Container } from "reactstrap";

import Loading from "../components/Loading";
import TryMe from "../components/TryMe";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

export const SolaceComponent = () => {
  const { user } = useAuth0();

  return (
    <Container className="mb-5">
      <TryMe />
    </Container>
  );
};

export default withAuthenticationRequired(SolaceComponent, {
  onRedirecting: () => <Loading />,
});
