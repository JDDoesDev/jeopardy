import React, { Component } from 'react';

import Modal from 'react-modal';
import { Col } from 'react-bootstrap';
import entities from 'entities';

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

class Clue extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      screenType: '',
      clueViewed: false
    };
  }

  componentDidMount() {
    const { item } = this.props;
    this.socket = this.props.socket;
    this.setState({screenType: this.props.screenType});
    if (this.socket && this.props.screenType !== 'host') {

      this.socket.on('view clue', (data) => {
        if (item.nid === data.nid) {
          if (data.toDo === 'open') {
            this.setState({modalIsOpen: true, clueViewed: true});
          } else {
            this.setState({modalIsOpen: false});
          }
        }
      });
    }
  }

  openModal = () => {
    const { item } = this.props;
    if (this.state.screenType === 'host') {
      this.socket.emit('view clue', {'nid': item.nid, 'toDo': 'open'});
    }

    this.setState({modalIsOpen: true, clueViewed: true});
  }


  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    // this.subtitle.style.color = '#f00';
  }

  closeModal = () => {
    const { item } = this.props;
    if (this.state.screenType === 'host') {
      this.socket.emit('view clue', {'nid': item.nid, 'toDo': 'close'});
    }
    this.setState({modalIsOpen: false});
  }


  render() {
    const { item, multiplier, round } = this.props;
    let title;
    let classes = 'clue-item';
    let modalClasses = `clue-modal ${this.state.screenType}`;
    let overlayClasses = `clue-overlay ${this.state.screenType}`;
    if (round) {
      classes = 'final-item';
      title = <Col sm={12} className="category-row final-clue"><span onClick={this.openModal}>{entities.decodeHTML(item.category)}</span></Col>;
    } else {
      let value = (item.difficulty * multiplier);
      if (!this.state.clueViewed) {
        let formattedValue = '$' + value;
        title = <h1 onClick={() => {this.openModal(); this.props.onValueAvailable(value)}}>{formattedValue}</h1>;
      } else {
        title = <span></span>;
      }
    }
    return (
      <Col xs={12} className={classes}>
        {title}
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          className={modalClasses}
          overlayClassName={overlayClasses}
          contentLabel="Open Clue"
        >
        {item.clue}
        { (this.state.screenType === 'host') ?
          <div className='answer'>{item.answer}</div> :
          ''
        }
        <button onClick={this.closeModal}>Close</button>
        </Modal>
      </Col>
    );
  }
}

export default Clue;
