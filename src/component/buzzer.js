import React, { Component } from 'react';
import { Col, Button } from 'react-bootstrap';

class Buzzer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentTeam: null,
      canAnswer: true,
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
    } else {
      console.log('unable to connect')
    }
  }

  render() {
    return (
      <Col xs={12}>
        <Button bsStyle="danger" bsSize="large" block onClick={this.buzzIn} >
          ANSWER!
        </Button>
      </Col>
    );
  }
}

export default Buzzer;
