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
import './scss/custom.scss';
import Gameboard from './component/gameboard';


const URL = 'http://drupaljeopardy.lndo.site/v1/jeopardy/clues';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      fetchComplete: false,
      rawClues: [],
      clues: [],
      jeopardy: [],
      doubleJeopardy: [],
      finalJeopardy: [],
      currentRound: '',
      socket: [],
      sortedClues: false
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

  componentDidMount() {
    const { endpoint } = this.state;

    this.socket = socketIOClient(endpoint);
    this.setState({ socket: this.socket });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.fetchComplete !== this.state.fetchComplete) {
      this.selectCategories();
    }
  }

  formatClues = (rawData) => {
    let clues = _.groupBy(rawData, 'category');
    this.setState({clues});
  }

  cleanUpCategories = (categoryArrays, final = false) => {
    // Take randomized categories, put them in one array, then sort into objects
    const categoryArray = [].concat(...categoryArrays);
    const categoryObject = _.groupBy(categoryArray, 'category');
    let completed = {};

    for (let property in categoryObject) {
      completed[property] = _(categoryObject[property]).uniqBy('difficulty').sortBy('difficulty').value();
      if (final === true) {
        completed[property] = _.last(completed[property]);
      }
    }
    return completed;
  }

  selectCategories = () => {
    if (this.state.clues) {
      const categories = _.sampleSize(this.state.clues, 13);
      const allJeopardy = categories.slice(0,6);
      const allDoubleJeopardy = categories.slice(6,12);
      const allFinalJeopardy = categories.slice(12);

      const jeopardy = this.cleanUpCategories(allJeopardy);
      const doubleJeopardy = this.cleanUpCategories(allDoubleJeopardy);
      const finalJeopardy = this.cleanUpCategories(allFinalJeopardy, true);

      this.setState({ roundClues: { jeopardy, doubleJeopardy, finalJeopardy }, sortedClues: true }, () => {
        this.state.socket.emit('inner', this.state.clues);
      });
    }
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
    if (this.state.fetchComplete && this.state.sortedClues === true) {
      gameboardComp = <Gameboard socket={this.state.socket} clues={this.state.roundClues} currentRound={this.state.currentRound ? this.state.currentRound : 'initial'} />;
    }

    return (
      <Jumbotron className="App">
        <Grid fluid>
          <Row className="jeopardy-board no-gutters">
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
