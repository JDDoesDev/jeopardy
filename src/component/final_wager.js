import React, { Component } from 'react';
import { Col, Button } from 'react-bootstrap';

class FinalWager extends Component {

  constructor(props) {
    super(props);

    this.state = {
      canAnswer: false,
      teamId: null,
      playerName: null,
      wager: null,
      answer: null,
      wagerSubmitted: false
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

  render() {
    let buttonText = "Submit Wager";
    let currentField;
    let buttonId = 'wager';
    if (!this.state.wagerSubmitted) {
      currentField = <
    }
    return (
      <Row>
        <Col xs={12}>
          <Button id={ buttonId } onClick={ this.submitFinal } block>
            { buttonText }
          </Button>
        </Col>
      </Row>
    );
  }
}

export default FinalWager;
