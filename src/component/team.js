import React, { Component } from 'react';
import { Col, Row} from 'react-bootstrap';

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

  render() {
    if (!this.state.name) {
      return (<div>Loading Team</div>);
    }

    return (
      <Col xs={12}>
        <div className="team-name">{this.props.name}</div>
        <div className="score">{this.props.score}</div>
      </Col>
    );
  }
}

export default Team;
