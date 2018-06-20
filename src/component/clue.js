import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import socketIOClient from "socket.io-client";
import _ from 'lodash';
import Modal from 'react-modal';
import { Grid, Row, Col } from 'react-bootstrap';
import entities from 'entities';

const customStyles = {
  content : {
    top                   : '0',
    left                  : '0',
    right                 : '0',
    bottom                : '0'
  }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

class Clue extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false
    };
  }

  openModal = () => {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    // this.subtitle.style.color = '#f00';
  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
  }


  render() {
    const { item, multiplier, round } = this.props;
    let title;
    let classes = 'clue-item';
    if (round) {
      classes = 'final-item';
      title = <Col sm={12} className="category-row final-clue"><span onClick={this.openModal}>{entities.decodeHTML(item.category)}</span></Col>;
    } else {
      let value = '$' + (item.difficulty * multiplier);
      title = <h1 onClick={this.openModal}>{value}</h1>;
    }
    return (
      <Col sm={12} className={classes}>
        {title}
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          className="clue-modal"
          overlayClassName="clue-overlay"
          contentLabel="Open Clue"
        >
        {item.clue}
        <button onClick={this.closeModal}>Close</button>
        </Modal>
      </Col>
    );
  }
}

export default Clue;
