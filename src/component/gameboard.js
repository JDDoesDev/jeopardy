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
      currentRound: this.props.currentRound,
      currentBoard: {}
    }
  }

  componentDidMount() {
    this.setState({clues: this.props.clues});
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.categories.length) {
      this.selectCategories();
    }

    if (prevProps.currentRound !== this.props.currentRound) {
      this.setState({ currentRound: this.props.currentRound }, () => {
        this.setBoardForRound(this.state.currentRound);

      });
    }
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

      this.setState({ categories, jeopardy, doubleJeopardy, finalJeopardy }, () => { this.setBoardForRound() });
    }
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

  buildBoard = (currentBoard) => {

    // for (let key in currentBoard) {
    //
    // }

    const columns = Object.keys(currentBoard).map((keyName, keyIndex) => {

      return (
        <GameboardColumn key={keyIndex} currentColumn={currentBoard[keyName]} keyName={keyName} round={this.state.currentRound}/>
      );
    });

    return columns;
  }

  setBoardForRound = (currentRound) => {
    switch (currentRound) {
      case 'doubleJeopardy':
        this.setState({ currentBoard: this.state.doubleJeopardy});
        break;
      case 'finalJeopardy':
        this.setState({ currentBoard: this.state.finalJeopardy});
        break;
      default:
        this.setState({ currentBoard: this.state.jeopardy });
    }
  }

  render() {
    let column;
    if (Object.keys(this.state.currentBoard).length) {
      column = this.buildBoard(this.state.currentBoard);
    }
    return (
      <Row className='show-grid'>{column}</Row>
    );
  }
}

export default Gameboard;
