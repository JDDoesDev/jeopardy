import React from 'react';
import entities from 'entities';
import Clue from './clue';
import { Col } from 'react-bootstrap';

const GameboardColumn = (props) => {

  let multiplier = 200;
  let columnItems;

  if (props.round === 'doubleJeopardy') {
    multiplier = 400;
  }

  if (props.round !== 'finalJeopardy' && props.currentColumn.length) {
    columnItems = props.currentColumn.map((item) => {
      return (
        <Clue onValueAvailable={props.onValueAvailable} key={item.nid} item={item} multiplier={multiplier} socket={props.socket} screenType={props.screenType}/>
      );
    })
  } else {
    return (
      <Clue key={props.currentColumn.nid} item={props.currentColumn} round={props.round} socket={props.socket} screenType={props.screenType}/>
    );
  }

  return (
    <Col className='' xs={2}>
      <Col sm={12} className="category-row">{entities.decodeHTML(props.keyName)}</Col>
      {columnItems}
    </Col>
  );
};

export default GameboardColumn;
