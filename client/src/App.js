import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react'
import { createHttpLink } from 'apollo-link-http';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

const httpLink = createHttpLink({
  uri: 'http://localhost:3001'
});

function App() {
  return (
    <Router>
      <Container>
      <NavBar />
      <Route exact path='/' component={Home}/>
      <Route exact path="/login" component={Login}/>
      <Route exact path="/register" component={Register}/>
      </Container>
    </Router>
  );
}

export default App;
