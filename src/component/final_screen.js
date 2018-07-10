import React, { Component } from 'react';
import {
  Col,
  Button,
  Row,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';

class FinalScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      canAnswer: false,
      teamId: null,
      playerName: null,
      wager: '',
      answer: '',
      wagerSubmitted: false,
      answerSubmitted: false
    };
  }


  componentDidMount() {
    this.socket = this.props.socket;

    this.setState({
      teamId: this.props.teamId,
      playerName: this.props.playerName
    })

    if (this.socket && Object.keys(this.socket).length) {

    }
  }

  submitFinal = (e) => {
    if (e.target.id === 'wager') {
      this.setState({ wagerSubmitted: true})
      const finalWagerPayload = {
        'teamId' : Number(this.state.teamId)
      }
      if (this.socket) {
        this.socket.emit('final wager', finalWagerPayload);
      } else {
        console.log('unable to connect')
      }

    } else {
      this.setState({ answerSubmitted: true})
      const finalJeopardyPayload = {
        'teamId' : Number(this.state.teamId),
        'playerName' : this.state.playerName,
        'wager': this.state.wager,
        'answer': this.state.answer
      }
      if (this.socket) {
        this.socket.emit('final jeopardy', finalJeopardyPayload);
      } else {
        console.log('unable to connect')
      }
    }
  }

  handleWagerChange = (e) => {
    this.setState({ wager: e.target.value })
  }

  handleResponseChange = (e) => {
    this.setState({ answer: e.target.value })
  }

  render() {
    let buttonText = this.state.wagerSubmitted ? "Submit Answer" : "Submit Wager";
    let buttonId = this.state.wagerSubmitted ? 'answer' : 'wager';
    const currentField = () => {
      if (!this.state.wagerSubmitted) {
        return (
          <form>
            <FormGroup>
              <ControlLabel>Enter Wager:</ControlLabel>
              <FormControl
                type="input"
                value={this.state.wager}
                placeholder="Enter Wager"
                onChange={this.handleWagerChange}
              />
            </FormGroup>
          </form>
        );
      } else if (this.state.wagerSubmitted && !this.state.answerSubmitted) {
        return (
          <form>
            <FormGroup>
              <ControlLabel>Enter Response:</ControlLabel>
              <FormControl
              type="input"
              value={this.state.answer}
              placeholder="Enter Response"
              onChange={this.handleResponseChange}
              />
            </FormGroup>
          </form>
        );
      } else {
        return (
          <div className='success-submit'>
            Your response has been submitted
          </div>
        )
      }
    }

    return (
      <Row>
        <Col xs={12}>
          { currentField() }
        </Col>
        <Col xs={12}>
          <Button id={ buttonId } onClick={ this.submitFinal } block disabled={this.state.answerSubmitted}>
            { buttonText }
          </Button>
        </Col>
      </Row>
    );
  }
}

export default FinalScreen;
