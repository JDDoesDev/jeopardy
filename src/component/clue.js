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
    right                 : 'auto',
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
    if (round) {
      title = item.category;
    } else {
      title = '$' + (item.difficulty * multiplier);
    }
    return (
      <Col sm={12}>
        <h1 onClick={this.openModal}>{entities.decodeHTML(title)}</h1>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Open Clue"
        >
        <button onClick={this.closeModal}>X</button>
        {item.clue}
        </Modal>
      </Col>
    );
  }
}

export default Clue;
