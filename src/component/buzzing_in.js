import React, { Component } from 'react';
import { Col, Button } from 'react-bootstrap';

class BuzzingIn extends Component {

  constructor(props) {
    super(props);

    this.state = {
      receivedBuzzes: [],
      currentBuzz: null,
      sentFirstResponse: false,
      deactivatedBuzzes: false,
      currentClueId: null,
      currentBuzzes: null,
      finalResponses: [],
      receivedFinals: null,
      isFinal: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.socket = this.props.socket;
    this.setState({ currentClueId: this.props.clueId })

    if (this.socket && Object.keys(this.socket).length) {
      this.socket.on('buzzer', (data) => {
        if (this.state.receivedBuzzes.length < 10 && (data[3] === this.state.currentClueId) && this._isMounted) {
          this.setState({currentBuzz: data, receivedBuzzes: [...this.state.receivedBuzzes, data]})
        }
      })
      this.socket.on('final jeopardy', (data) => {
        if (this._isMounted) {
          this.setState({ finalResponses: [...this.state.finalResponses, data], isFinal: true })
        }
      })
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.receivedBuzzes !== prevState.receivedBuzzes && this.state.receivedBuzzes.length) {
      this.setState({currentBuzzes: this.handleBuzzes() })
    }
    if (this.state.finalResponses !== prevState.finalResponses && this.state.finalResponses.length) {
      this.setState({receivedFinals: this.handleFinals() })
    }
  }

  handleBuzzes = () => {
    const firstResponse = this.state.receivedBuzzes[0];
    if (!this.state.sentFirstResponse) {
      this.sendFirstResponse(firstResponse);
    }

    const responses = this.state.receivedBuzzes.map((v, k) => {
      return <li key={k}>{`${v[0]} ${v[1].name} ${v[2]}`}</li>
    })
    return responses;
  }

  handleFinals = () => {
    console.log(this.state.finalResponses);
    const responses = this.state.finalResponses.map((v, k) => {
      return <li key={k}>{`${v.teamId} ${v.playerName}`}</li>
    })
    return responses;
  }

  sendFirstResponse = (response) => {
    const teamId = response[0];
    if (this.socket && Object.keys(this.socket).length) {
      this.socket.emit('firsties', teamId);
      this.setState({ sentFirstResponse: true})
    }
  }

  render() {
    return (
      <Col xs={12}>
        <ul>
          {this.state.isFinal ? this.state.receivedFinals : this.state.currentBuzzes}
        </ul>
      </Col>
    );
  }
}

export default BuzzingIn;
