import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { Grid, Row, Col, Button, Jumbotron } from 'react-bootstrap';
import socketIOClient from "socket.io-client";
import 'whatwg-fetch';
import _ from 'lodash';

import logo from './logo.svg';
import './App.css';
import Gameboard from './component/gameboard';


const URL = 'http://drupaljeopardy.lndo.site/v1/jeopardy/clues';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      welcome: 'Welcome to React!',
      fetchComplete: false,
      rawClues: [],
      clues: [],
      currentRound: 'jeopardy'
    };

    if (URL) {
      fetch(URL, {
        method: 'GET',
        credentials: 'same-origin'
      })
      .then(response => {
        return response.json()
      })
      .then(json => {
        this.setState({ rawData: json });
      })
      .then(() => {
        this.formatClues(this.state.rawData);
        this.setState({fetchComplete: true})
      });
    }
  }

  formatClues = (rawData) => {
    let clues = _.groupBy(rawData, 'category');
    this.setState({clues});

  }

  componentDidMount() {
    const { endpoint } = this.state;

    this.socket = socketIOClient(endpoint);
    this.socket.on("hello world", data => this.setState({ response: data }));


    this.socket.on('prepare', (data) => {
      this.setState({welcome: data});
    });
  }

  testEmitter = () => {
    // sending sockets
    this.setState({welcome: 'welcome to something else'});
  }

  handleRoundClick = (e) => {
    const round = e.target.id;
    this.setState({ currentRound : round});
  }

  render() {
    let gameboardComp = 'Loading clues...';
    if (this.state.fetchComplete) {

      gameboardComp = <Gameboard clues={this.state.clues} currentRound={this.state.currentRound} />;
    }

    return (
      <Jumbotron className="App">
        <Grid fluid>
          <Row className="jeopardy-board">
            {gameboardComp}
          </Row>
          <Row className="App-header">
            <Button id="jeopardy"onClick={this.handleRoundClick}>Start</Button>
            <Button id="doubleJeopardy"onClick={this.handleRoundClick}>Double</Button>
            <Button id="finalJeopardy"onClick={this.handleRoundClick}>Final</Button>
          </Row>
        </Grid>
      </Jumbotron>
    );
  }
}

export default App;
