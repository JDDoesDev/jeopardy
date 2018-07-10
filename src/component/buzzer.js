import React, { Component } from 'react';
import { Col, Button } from 'react-bootstrap';

class Buzzer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentTeam: null,
      canAnswer: false,
      teamId: null,
      playerName: null,
      currentClueId: null
    };
  }

  componentDidMount() {
    this._isMounted = true
    this.socket = this.props.socket;

    this.setState({
      currentTeam: this.props.teamJoined,
      teamId: this.props.teamId,
      playerName: this.props.playerName
    })

    if (this.socket && Object.keys(this.socket).length && this._isMounted) {
      this.socket.on('buzzer', (data) => {
        if (data[0] === this.state.teamId) {
          this.setState({canAnswer: false});
        }
      })
      this.socket.on('view clue', (data) => {
        if (this._isMounted) {
          this.setState({canAnswer: data.buzzersEnabled, currentClueId: data.nid });
        }
      })
    }
  }

  componentWillUnmount() {
    this._isMounted = false
    this.socket = null;
  }

  buzzIn = () => {
    const buzzerPayload = [this.state.teamId, this.state.currentTeam, this.state.playerName, this.state.currentClueId]
    if (this.socket) {
      this.socket.emit('buzzer', buzzerPayload);
      this.setState({canAnswer: false});
    } else {
      console.log('unable to connect')
    }
  }

  render() {
    return (
      <Col xs={12} className="buzzer-button-wrapper">
        <Button disabled={!this.state.canAnswer} bsStyle="danger" bsSize="large" block onClick={this.buzzIn} >
          ANSWER!
        </Button>
      </Col>
    );
  }
}

export default Buzzer;
