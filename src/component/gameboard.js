import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap'

import socketIOClient from "socket.io-client";
import _ from 'lodash';


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
    this.setState({
      clues: this.props.clues,
      socket: this.props.socket
    }, () => {console.log(this.state.clues.jeopardy)});
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentRound !== this.props.currentRound) {
      this.setState({ currentRound: this.props.currentRound }, () => {
        this.setBoardForRound(this.state.currentRound);
      });
    }
  }

  buildBoard = (currentBoard) => {

    const columns = Object.keys(currentBoard).map((keyName, keyIndex) => {

      return (
        <GameboardColumn key={keyIndex} currentColumn={currentBoard[keyName]} keyName={keyName} round={this.state.currentRound}/>
      );
    });

    return columns;
  }

  setBoardForRound = (currentRound) => {
    console.log(currentRound);
    switch (currentRound) {
      case 'doubleJeopardy':
        this.setState({ currentBoard: this.state.clues.doubleJeopardy}, () => {console.log(this.state.currentBoard)});
        break;
      case 'finalJeopardy':
        this.setState({ currentBoard: this.state.clues.finalJeopardy}, () => {console.log(this.state.currentBoard)});
        break;
      default:
        this.setState({ currentBoard: this.state.clues.jeopardy }, () => {console.log(this.state.currentBoard)});
    }
  }

  render() {
    let column;
    if (Object.keys(this.state.currentBoard).length) {
      column = this.buildBoard(this.state.currentBoard);
    }
    return (
      <Row className='no-gutters'>{column}</Row>
    );
  }
}

export default Gameboard;
