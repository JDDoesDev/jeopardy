import React, { Component } from 'react';

import Modal from 'react-modal';
import { Row, Col, Button } from 'react-bootstrap';
import entities from 'entities';

import BuzzingIn from './buzzing_in'

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

class Clue extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      screenType: '',
      clueViewed: false,
      clueDisplay: '',
      pointValue: '',
      modalContent: '',
      daily: false,
      showDaily: false,
      clueAnswer: '',
      clueText: '',
      clueId: null,
      round: null,
      finalAnswer: null,
      finalWager: null,
      finalPlayerName: null,
      finalReceived: false,
      revealWager: false
    };
  }

  componentDidMount() {
    const { item, screenType, multiplier } = this.props;
    this.socket = this.props.socket;
    this.setState({
      screenType: screenType,
      pointValue: item.difficulty * multiplier,
      daily: item.daily ? true : false,
      clueAnswer: item.answer,
      clueText: item.clue,
      clueId: item.nid,
      round: this.props.round ? this.props.round : null
    }, () => console.log(this.state.round));

    if (this.socket && screenType !== 'host') {
      this.socket.on('view clue', (data) => {
        if (item.nid === data.nid) {
          if (data.toDo === 'open') {
            this.setState({modalIsOpen: true, clueViewed: true});
          } else {
            this.setState({modalIsOpen: false});
          }
        }
      });
      this.socket.on('show daily', (data) => {
        if (this.state.daily === true && this.state.showDaily === false) {
          this.setState({showDaily: true});
        }
      });
    }
    if (this.socket) {
      this.socket.on('final wager reveal', (data) => {
        this.setState({revealFinalWager: true});
      });
      this.socket.on('final answer', (data) => {
        console.log(data)
        this.setState({
          finalAnswer: data.answer,
          finalWager: data.wager,
          finalPlayerName: data.playerName,
          finalReceived: true
        })
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.round !== this.props.round) {
      this.setState({round: this.props.round});
    }
  }

  openModal = () => {
    const { item } = this.props;
    if (this.state.screenType === 'host') {
      this.socket.emit('view clue', {'nid': item.nid, 'toDo': 'open' });
    }
    this.setState({modalIsOpen: true, clueViewed: true});
  }

  handleTitleClick = () => {
    if (this.state.screenType === 'host') {
      this.openModal();
      this.props.onValueAvailable(this.state.pointValue);
    }
  }

  afterOpenModal = () => {

  }

  closeModal = () => {
    const { item } = this.props;
    if (this.state.screenType === 'host') {
      this.socket.emit('view clue', {'nid': item.nid, 'toDo': 'close', 'buzzersEnabled': false });
    }
    this.setState({modalIsOpen: false});
  }

  enableBuzzers = () => {
    if (this.state.screenType === 'host') {
      this.socket.emit('view clue', {'buzzersEnabled': true });
    }
  }

  getModalDisplay = () => {
    const modalClasses = `clue-modal ${this.state.screenType}`;
    const overlayClasses = `clue-overlay ${this.state.screenType}`;

    const display = () => {
      if (this.state.daily === true && this.state.screenType !== 'host' && this.state.showDaily === false) {
        return (
          <div className='daily-card'>
            DRUPAL DOUBLE!
          </div>
        )
      }

      if (this.state.round === 'finalJeopardy' && this.state.finalReceived) {
        return (
          <div className='final-reveal'>
            <span className='final-response'>{this.state.finalAnswer}</span>
            <span className='final-responder'>{this.state.finalPlayerName}</span>
            <span className='final-wager'>{this.state.revealFinalWager ? `$${this.state.finalWager}` : null}</span>
          </div>
        );
      }

      return this.state.clueText;
    }
    let answer = '';
    let closeButton = '';
    let buzzerButton = '';
    let doubleCover = '';
    let wagerField = '';
    let wagerSubmit = '';

    if (this.state.screenType === 'host') {
      answer = <div className='answer'>{this.state.clueAnswer}</div>;
      closeButton = <Button onClick={this.closeModal}>Close</Button>;
      buzzerButton = <Button onClick={this.enableBuzzers}>Enable Buzzers</Button>;
      if (this.state.daily) {
        wagerField = <input
          value={ this.state.pointValue }
          placeholder='Enter Wager'
          onChange={(e) => this.setState({ pointValue: e.target.value })} />
        wagerSubmit = <Button onClick={ this.handleWagerSubmit }>
                        Submit Wager
                      </Button>
      }
    }

    const content = () => {
      if (this.state.screenType === 'host') {
        return (
          <Row>
            <Col xs={6}>
              {display()}
              {answer}
              {closeButton}
              {buzzerButton}
              {wagerField}
              {wagerSubmit}
            </Col>
            <Col xs={6}>
              <BuzzingIn socket={this.socket} clueId={ this.state.clueId }/>
            </Col>
          </Row>
        );
      } else {
        return (
          <Col>
            {display()}
            {doubleCover}
          </Col>
        );
      }
    }
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        className={modalClasses}
        overlayClassName={overlayClasses}
        contentLabel="Open Clue"
      >
        { content() }
      </Modal>
    );
  }

  handleWagerSubmit = () => {
    this.props.onValueAvailable(this.state.pointValue);
    this.socket.emit('show daily', true);
  }

  render() {
    const { item, multiplier } = this.props;
    let title;
    let classes = 'clue-item';

    if (this.state.round === 'finalJeopardy') {
      classes = 'final-item';
      title = <Col sm={12} className="category-row final-clue"><span onClick={this.openModal}>{entities.decodeHTML(item.category)}</span></Col>;
    } else {
      let value = (item.difficulty * multiplier);
      if (!this.state.clueViewed) {
        let formattedValue = '$' + this.state.pointValue;
        title = <h1 onClick={() => {this.handleTitleClick(value)}}>{formattedValue}</h1>;
      } else {
        title = <span></span>;
      }
    }
    const clue = this.getModalDisplay();


    return (
      <Col xs={12} className={classes}>
        {title}
        {clue}
      </Col>
    );
  }
}

export default Clue;
