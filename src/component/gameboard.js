import React, { Component } from 'react';
import { Row } from 'react-bootstrap'

import GameboardColumn from './gameboard_column';

class Gameboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      clues: [],
      categories: [],
      jeopardy: [],
      doubleJeopardy: [],
      finalJeopardy: [],
      currentRound: '',
      currentBoard: [],
      socket: []
    }

  }

  componentDidMount() {
    this.socket = this.props.socket;
    this.setState({clues: this.props.clues});
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.clues !== this.props.clues) {
      this.setState({ clues: this.props.clues });
    }
    if (prevProps.currentRound !== this.props.currentRound) {
      this.setState({ currentRound: this.props.currentRound }, () => {
        this.setBoardForRound(this.state.currentRound);
      });
    }
  }

  buildBoard = (currentBoard) => {
    const columns = Object.keys(currentBoard).map((keyName, keyIndex) => {
      return (
        <GameboardColumn onValueAvailable={this.props.onValueAvailable} socket={this.socket} key={keyIndex} currentColumn={currentBoard[keyName]} keyName={keyName} round={this.state.currentRound} screenType={this.props.screenType}/>
      );
    });

    return columns;
  }

  setBoardForRound = (currentRound) => {
    switch (currentRound) {
      case 'doubleJeopardy':
        this.setState({ currentBoard: this.state.clues.doubleJeopardy});
        break;
      case 'finalJeopardy':
        this.setState({ currentBoard: this.state.clues.finalJeopardy});
        break;
      default:
        this.setState({ currentBoard: this.state.clues.jeopardy });
    }
  }

  render() {
    let column;
    if (this.state.currentBoard) {
      column = this.buildBoard(this.state.currentBoard);
    }
    return (
      <Row className='no-gutters'>{column}</Row>
    );
  }
}

export default Gameboard;
