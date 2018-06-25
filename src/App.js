import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import socketIOClient from "socket.io-client";
import 'whatwg-fetch';
import _ from 'lodash';

import './App.css';
import './scss/custom.scss';

import GameScreen from './component/game_screen';
import HostScreen from './component/host_screen';


const URL = process.env.REACT_APP_REST_URL;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      response: false,
      endpoint: process.env.REACT_APP_SOCKET_URL,
      fetchComplete: false,
      rawClues: [],
      clues: [],
      jeopardy: [],
      doubleJeopardy: [],
      finalJeopardy: [],
      currentRound: '',
      socket: [],
      sortedClues: false,
      baseUrl: true,
      loadingComplete: false,
      mainDisplay: false,
      gameStarted: false,
      gameDisplay: false,
      roomHash: '',
      enteredHash: ''
    };
  }

  randomString = (length) => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  componentDidMount() {
    const { endpoint } = this.state;

    this.redirected = false;

    this.socket = socketIOClient(endpoint);

    this.setState({ socket: this.socket, roomHash: this.randomString(7) });

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

    if (this.socket) {
      this.socket.on('host', (data) => {
        if (data === 'selected') {
          this.setState({ gameStarted: true, gameDisplay: true });
        }
      });
    }
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

      this.setState({ roundClues: { jeopardy, doubleJeopardy, finalJeopardy }, sortedClues: true });
    }
  }

  toggleMenu = (e) => {
    const targetScreen = e.target.id;
    if (targetScreen === 'host') {
      this.setState({ mainDisplay: true, gameStarted: true, baseUrl: false }, () => {
        this.socket.emit('host', 'selected');
        this.socket.emit('room', this.state.roomHash);
      });
    }
    if (targetScreen === 'game') {
      this.setState({ gameStarted: true, baseUrl: false });
      this.socket.emit('room', this.state.roomHash);
    }
  }

  checkIfLoading = () => {
    if (this.state.fetchComplete) {
      return true;
    }
    return false;
  }

  buildMenu = () => {
    let menu =
      <div>
        <button onClick={this.toggleMenu}>
          <Link id="host" to="/host">Start Game</Link>
        </button>
        <div>
          <input
            value={ this.state.roomHash }
            onChange={event => this.setState({ roomHash: event.target.value }, () => console.log(this.state.roomHash))} />
        </div>
        <button onClick={this.toggleMenu}>
          <Link id="game" to="/game">Join Game</Link>
        </button>

      </div>


    if (this.state.gameStarted && window.location.pathname !== '/') {
      menu = '';
    }

    return (
      <div>
        <Router>
          <div>
            { menu }
            <Route
              path="/host"
              render={(props) => <HostScreen {...props} socket={this.socket} roundClues={this.state.roundClues} roomHash={this.state.roomHash} />}
              />
            <Route
              path="/game"
              render={(props) => <GameScreen {...props} socket={this.socket} onRoomSelect={(hash) => this.setState({roomHash: hash})} />}
              />
          </div>
        </Router>
      </div>
    );
  }




  render() {
    let menu;
    if (!this.state.gameStarted && window.location.pathname !== '/') {
      menu =
        <Router>
          <Redirect to="/" />
        </Router>
    }
    if (this.checkIfLoading()) {
      menu = this.buildMenu();
    }

    return (
      <div>
        {menu}
      </div>
    );
  }
}

export default App;
