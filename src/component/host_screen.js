import React, { Component } from 'react';

import { Grid, Row, Button, Jumbotron} from 'react-bootstrap';

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
      currentValue:''
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
      gameboardComp = <Gameboard onValueAvailable={(currentValue) => this.setState({ currentValue })} socket={this.socket} clues={this.state.roundClues} currentRound={this.state.currentRound ? this.state.currentRound : 'initial'} screenType={this.state.screenType}/>;
    }

    if (this.socket && Object.keys(this.socket).length) {
      teams = <Teams socket={this.socket} screenType={this.state.screenType} currentValue={this.state.currentValue}/>;
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
          { teams }
        </Grid>
    );
  }
}

export default HostScreen;
