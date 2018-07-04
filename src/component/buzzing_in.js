import React, { Component } from 'react';
import { Col, Button } from 'react-bootstrap';

class BuzzingIn extends Component {

  constructor(props) {
    super(props);

    this.state = {
      receivedBuzzes: [],
      currentBuzz: null,
      sentFirstResponse: false,
      deactivatedBuzzes: false
    };
  }

  componentDidMount() {
    this.socket = this.props.socket;

    if (this.socket && Object.keys(this.socket).length) {
      this.socket.on('buzzer', (data) => {
        if (this.state.receivedBuzzes.length < 10) {
          this.setState({currentBuzz: data, receivedBuzzes: [...this.state.receivedBuzzes, data]})
        }
      })
    }
  }

  handleBuzzes = () => {
    if (this.state.receivedBuzzes.length) {
      const firstResponse = this.state.receivedBuzzes[0];

      this.sendFirstResponse(firstResponse);

      const responses = this.state.receivedBuzzes.map((v, k) => {
        return <li key={k}>{`${v[0]} ${v[1].name} ${v[2]}`}</li>
      })
      return responses;
    }
    return null;
  }

  sendFirstResponse = (response) => {
    const teamId = response[0];
    if (this.socket && Object.keys(this.socket).length) {
      this.socket.emit('firsties', teamId);
    }
  }

  render() {
    return (
      <Col xs={12}>
        <ul>
          {this.handleBuzzes()}
        </ul>
      </Col>
    );
  }
}

export default BuzzingIn;
