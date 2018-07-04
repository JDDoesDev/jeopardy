import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
import socketIOClient from "socket.io-client";
import 'whatwg-fetch';
import _ from 'lodash';
import { Grid, Row, Button } from 'react-bootstrap';

import './App.css';
import './scss/custom.scss';

import GameScreen from './component/game_screen';
import HostScreen from './component/host_screen';
import MobileScreen from './component/mobile_screen';
import LoadingScreen from './component/loading';


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
      enteredHash: '',
      gameValue: '',
      showHashField: false,
      teams: []
    };
  }

  randomString = (length) => {
    let text = "";
    const possible = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789";
    for(let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  componentDidMount() {
    const { endpoint } = this.state;
    if (isMobile) {
      this.setState({ showHashField: true, loadingComplete: true});
    }

    this.redirected = false;

    this.socket = socketIOClient(endpoint, {secure: true, rejectUnauthorized: false});

    this.setState({ socket: this.socket, roomHash: this.randomString(7) });

    if (URL && !isMobile) {
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
      this.socket.on('teams', (data) => {
        this.setState({teams: data}, () => {console.log(this.state.teams)});
      })
    }
  }

  componentWillUnmount() {
    this.socket.close();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.fetchComplete !== this.state.fetchComplete) {
      this.selectCategories();
    }
    if (this.checkIfLoading() && this.state.loadingComplete !== true) {
      this.setState({ loadingComplete: true })
    }
  }

  formatClues = (rawData) => {
    let clues = _.groupBy(rawData, 'category');
    this.setState({clues});
  }

  cleanUpCategories = (categoryArrays, roundNumber, final = false) => {
    // Take randomized categories, put them in one array, then sort into objects
    const categoryArray = [].concat(...categoryArrays);
    const uniquedArray = _.uniqBy(categoryArray, v => [v.category, v.difficulty].join());
    console.log(uniquedArray);

    const doubles = _.sampleSize(uniquedArray, roundNumber);
// eslint-disable-next-line
    doubles.map((val, key) => {
      const index = _.findIndex(uniquedArray, {'nid' : doubles[key].nid })

      uniquedArray.map((v,k) => {
        let clueObject = v;
        if (k === index) {
          clueObject.daily = '1';
        }
        return clueObject;
      })
    });


    const categoryObject = _.groupBy(uniquedArray, 'category');
    let completed = {};

    for (let property in categoryObject) {
      completed[property] = _(categoryObject[property]).sortBy('difficulty').value();
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

      const jeopardy = this.cleanUpCategories(allJeopardy, '1');
      const doubleJeopardy = this.cleanUpCategories(allDoubleJeopardy, '2');
      const finalJeopardy = this.cleanUpCategories(allFinalJeopardy, '0', true);

      this.setState({ roundClues: { jeopardy, doubleJeopardy, finalJeopardy }, sortedClues: true });
    }
  }

  toggleMenu = (e) => {
    const targetScreen = e.target.id;
    if (targetScreen === 'host') {
      this.setState({ mainDisplay: true, gameStarted: true, baseUrl: false }, () => {
        this.socket.emit('host', 'selected');
        this.socket.emit('room', this.state.roomHash, (data) => {
          if (data === true) {
            this.setState({joinedRoom: true})
          }
        });

      });
    }
    if (targetScreen === 'game' || targetScreen === 'mobile') {
      this.setState({ gameStarted: true,
        baseUrl: false,
        roomHash: this.state.gameValue },
        () => {
          this.socket.emit('room', this.state.roomHash, (data) => {
            if (data === true) {
              this.setState({joinedRoom: true})
            }
          });
        }
      );
    }
  }

  checkIfLoading = () => {
    if (this.state.fetchComplete) {
      return true;
    }
    return false;
  }

  selectRoom = () => {
    return (
      <Row>
        { this.state.showHashField ?
          <div>
            <input
              value={ this.state.gameValue }
              placeholder='Enter Game ID'
              onChange={event => this.setState({ gameValue: event.target.value })} />
          </div> :
          null
        }
      </Row>
    );
  }

  handleJoinClick = (e) => {
    if (this.state.showHashField === false) {
      this.setState({showHashField: true})
    } else {
      this.toggleMenu(e);
    }
  }

  buildMenu = () => {
    let menu =
    <Grid>
      {this.selectRoom()}
      <BrowserView device={isBrowser}>
        <Row>
          { this.state.showHashField ?
            null :
            <Button onClick={ this.toggleMenu }>
              <Link id="host" to="/host">Start Game</Link>
            </Button>
          }
          <Button onClick={ this.handleJoinClick }>
            { this.state.showHashField ?
              <Link id="game" to="/game">Join Game</Link> :
                <span>Join Game</span>
              }
            </Button>
        </Row>
      </BrowserView>
      <MobileView device={isMobile}>
        <Row>
          <Button onClick={this.handleJoinClick}>
            <Link id="mobile" to="/mobile">Join Game</Link>
          </Button>
        </Row>
      </MobileView>
    </Grid>

    return (
      <div>
        <Router>
          <div>
            <Route
              exact path="/"
              render={(props) => <LoadingScreen {...props} loaded={this.state.loadingComplete} menu={menu} />}
              />
            <Route
              path="/host"
              render={(props) => <HostScreen {...props} socket={this.socket} roundClues={this.state.roundClues} roomHash={this.state.roomHash} />}
            />
            <Route
              path="/game"
              render={(props) => <GameScreen {...props} socket={this.socket}  />}
            />
            <Route
              path="/mobile"
              render={(props) => <MobileScreen {...props} socket={this.socket} teams={ this.state.teams } joinedRoom={ this.state.joinedRoom}/>}
            />
          </div>
        </Router>
      </div>
    );
  }

  render() {
    let initialScreen = this.buildMenu();
    if (!this.state.gameStarted && (window.location.pathname !== '/') && !isMobile) {
      return (
        <Router>
          <Redirect to="/" />
        </Router>
      );
    }

    return (
      <div>

          {initialScreen}


      </div>
    );
  }
}

export default App;
