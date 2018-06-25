import React, { Component } from 'react';

import { Grid, Row, Jumbotron } from 'react-bootstrap';

import Gameboard from './gameboard';
import Teams from './teams';

class GameScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      response: false,
      fetchComplete: false,
      rawClues: [],
      roundClues: [],
      currentRound: '',
      socketOpen: false,
      roomHash: ''
    };
  }

  componentDidMount() {
    this.socket = this.props.socket;
    if (this.socket && Object.keys(this.socket).length) {
      this.setState({socketOpen: true});
      console.log('listening');
      this.socket.on('round', (data) => this.setState({ currentRound : data }));
      this.socket.on('clues',
        (data) => {
          if (data !== this.state.roundClues) {
            this.setState({ roundClues : data });
          }
        }
      );
    }
  }

  render() {
    let gameboardComp = 'Loading clues...';
    let teams = 'Waiting for teams...'
    if (this.socket && Object.keys(this.socket).length) {
      if (this.state.roundClues && Object.keys(this.state.roundClues).length) {
        gameboardComp = <Gameboard socket={this.socket} clues={this.state.roundClues} currentRound={this.state.currentRound ? this.state.currentRound : 'initial'} />;
      }
      teams = <Teams socket={this.socket} screenType={this.state.screenType}/>;
    }

    return (
      <Jumbotron className="App">
        <Grid fluid>
          <Row className="jeopardy-board no-gutters">
            {gameboardComp}
          </Row>
          <Row className='game-board-teams'>
            {teams}
          </Row>
        </Grid>
      </Jumbotron>
    );
  }
}

export default GameScreen;
