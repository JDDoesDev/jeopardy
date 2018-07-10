import React, { Component } from 'react';
import { Col, Button } from 'react-bootstrap';

class FinalResponse extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentTeam: null,
      canAnswer: false,
      teamId: null,
      playerName: null
    };
  }

  componentDidMount() {
    this.socket = this.props.socket;

    this.setState({
      currentTeam: this.props.teamJoined,
      teamId: this.props.teamId,
      playerName: this.props.playerName
    })

    if (this.socket && Object.keys(this.socket).length) {

    }
  }

  buzzIn = () => {
    const buzzerPayload = [this.state.teamId, this.state.currentTeam, this.state.playerName]
    if (this.socket) {
      this.socket.emit('buzzer', buzzerPayload);
      this.setState({canAnswer: false});
    } else {
      console.log('unable to connect')
    }
  }

  render() {
    return "Hello";
  }
}

export default FinalResponse;
