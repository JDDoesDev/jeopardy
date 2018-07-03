import React, { Component } from 'react';
import { Col } from 'react-bootstrap';

class Team extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      score: '',
      id: ''
    };
  }

  componentDidMount() {
    this.socket = this.props.socket;
    this.setState({name: this.props.name, score: this.props.score, id: this.props.id});
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.score !== prevProps.score) {
      this.setState({score: this.props.score});
    }
  }

  render() {
    let scoreClasses = 'score';
    if (!this.state.name) {
      return (<div>Loading Team</div>);
    }
    if (Number(this.state.score) < 0) {
      scoreClasses = 'score negative';
    }

    return (
      <Col xs={12}>
        <div className="team-name">{this.props.name}</div>
        <div className={scoreClasses}>{this.props.score}</div>
      </Col>
    );
  }
}

export default Team;
