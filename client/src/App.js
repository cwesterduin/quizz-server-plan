import React from 'react'
import { Switch, Route } from 'react-router-dom';
import { ChatRoom, ChatSetup } from './pages'

const App = () => {

  return (
      <Switch>
        <Route exact path="/" render={() => <h1>Welcome</h1>} />
        <Route exact path="/game" component={ChatSetup} />
        <Route path="/game/:id" component={ChatRoom} />
      </Switch>
  );
};

export default App