import React, { Component } from 'react';

import { Grid, Row, Button } from 'react-bootstrap';

import Gameboard from './gameboard';
import Teams from './teams';

class HostScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      jeopardy: [],
      doubleJeopardy: [],
      finalJeopardy: [],
      currentRound: '',
      socket: [],
      roundClues: [],
      sortedClues: false,
      screenType: 'host',
      currentValue:'',
      room: '',
      viewedClues: []
    };
  }

  componentDidMount() {
    this.socket = this.props.socket;
    this.setState({ roundClues: this.props.roundClues });
  }

  handleRoundClick = (e) => {
    const round = e.target.id;
    this.setState({ currentRound : round});
    this.socket.emit('clues', this.props.roundClues);
    this.socket.emit('round', round);
  }

  render() {
    let gameboardComp = 'Press start to begin...';
    let teams;

    if (this.state.roundClues && Object.keys(this.state.roundClues).length) {
      gameboardComp = <Gameboard
        onValueAvailable={(currentValue) => this.setState({ currentValue }, () => {console.log(this.state.currentValue)})}
        socket={this.socket}
        clues={this.state.roundClues}
        currentRound={this.state.currentRound}
        screenType={this.state.screenType}
      />;
    }

    if (this.socket && Object.keys(this.socket).length) {
      teams = <Teams
        socket={this.socket}
        screenType={this.state.screenType}
        currentValue={this.state.currentValue}
        currentRound={this.state.currentRound}
      />;
    }

    return (
        <Grid>
          <Row className="host-board no-gutters">
            {gameboardComp}
          </Row>
          <Row className="App-header">
            <Button id="jeopardy" onClick={this.handleRoundClick}>Start</Button>
            <Button id="doubleJeopardy" onClick={this.handleRoundClick}>Double</Button>
            <Button id="finalJeopardy" onClick={this.handleRoundClick}>Final</Button>
          </Row>
          <div>Current Game ID: {this.props.roomHash}</div>
          { teams }
        </Grid>
    );
  }
}

export default HostScreen;
