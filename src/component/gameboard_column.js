import React from 'react';
import entities from 'entities';
import Clue from './clue';
import { Grid, Row, Col } from 'react-bootstrap';

const GameboardColumn = (props) => {

  let multiplier = 200;
  let columnItems;
  if (props.round === 'doubleJeopardy') {
    multiplier = 400;
  }
  console.log(props.currentColumn);
  if (props.round !== 'finalJeopardy' && props.currentColumn.length) {
    columnItems = props.currentColumn.map((item) => {
      return (
        <Clue key={item.nid} item={item} multiplier={multiplier} />
      );
    })
  } else {
    return (
      <Clue key={props.currentColumn.nid} item={props.currentColumn} round={props.round} />
    );
  }



  return (
    <Col className='show-grid' md={2}>
      <Col sm={12} className="category-row"><h3>{entities.decodeHTML(props.keyName)}</h3></Col>
      {columnItems}
    </Col>
  );
};

export default GameboardColumn;
