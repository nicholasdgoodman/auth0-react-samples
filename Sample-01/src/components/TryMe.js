import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { useSolaceTopic, useSolaceSession } from "../providers/solace";


const TryMe = () => {

  const [formState, setFormState] = useState({
    connectionStatus: 'Disconnected',
    subTopic: 'try-me',
    pubTopic: 'try-me',
    message: 'Hello World!'
  });
  const setFormValue = (key, value) => setFormState(s => ({...s, [key]: value }));


  const [solace, setSolace] = useState();
  const [session, setSession] = useState();

  useSolaceSession((session, solace) => {
    if(formState.connectionStatus !== 'Connected') {
      setFormValue('connectionStatus', 'Connected');
      setSolace(solace);
      setSession(session);
    }
  });

  const handleInputChange = e => {
    setFormValue(e.target.id, e.target.value);
  };

  const handlePublish = () => {
    const message = solace.SolclientFactory.createMessage();
    const destination = solace.SolclientFactory.createTopicDestination(formState.pubTopic);
    message.setDestination(destination);
    message.setBinaryAttachment(formState.message);
    session.send(message);
  };
  return (
    <Form>
      <h2>Solace Messaging</h2>
      <FormGroup>
        <Label for="connectionStatus">Conection Status</Label>
        <Input id="connectionStatus" value={formState.connectionStatus} readOnly />
      </FormGroup>
      <FormGroup>
        <Label for="subTopic">Subscription Topic</Label>
        <Input id="subTopic" value={formState.subTopic} onChange={handleInputChange} />
      </FormGroup>
      <FormGroup>
        <Label for="pubTopic">Publish Topic</Label>
        <Input id="pubTopic" value={formState.pubTopic} onChange={handleInputChange} />
      </FormGroup>
      <FormGroup>
        <Label for="message">Message</Label>
        <Input id="message" value={formState.message} onChange={handleInputChange} />
      </FormGroup>
      <Button type="button">Subscribe</Button>
      {' '}
      <Button type="button" disabled={session === undefined} onClick={handlePublish}>Publish</Button>
    </Form>
  );
};

export default TryMe;
