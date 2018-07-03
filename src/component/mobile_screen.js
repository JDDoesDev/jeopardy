import React, { Component } from 'react';
import { Col, Button } from 'react-bootstrap';
import TeamSelect from './teams_select';

class MobileScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      teams: {},
      teamList: {},
      hasJoinedTeam: false,
      teamJoined: {},
      screenType: 'mobile'
    };
  }

  componentDidMount() {
    this.socket = this.props.socket;
    this.setState({teams: this.props.teams});
    if (this.socket && Object.keys(this.socket).length) {
      this.socket.emit('get teams', true);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.teams !== prevProps.teams) {
      this.setState({ teams: this.props.teams })
    }
  }

  joinedTeam = () => {
    this.setState({hasJoinedTeam: true})
  }

  render() {
    if (this.state.hasJoinedTeam === false) {
      return (
        <Col xs={12}>
          <TeamSelect onTeamJoined={(team) => {this.setState({teamJoined: this.state.teams[team]}, () => console.log(this.state.teamJoined))}} teams={this.state.teams} />
          <Button onClick={this.joinedTeam}>Join Team</Button>
        </Col>
      );
    }
    return (
      <Col xs={12}>
      </Col>
    );
  }
}

export default MobileScreen;
