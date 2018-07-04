import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import TeamSelect from './teams_select';
import Buzzer from './buzzer';

class MobileScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      teams: {},
      teamList: {},
      hasJoinedTeam: false,
      teamJoined: {},
      screenType: 'mobile',
      joinedRoom: false,
      playerName: null,
      teamId: null
    };
  }

  componentDidMount() {
    this.socket = this.props.socket;
    this.setState({teams: this.props.teams});
    if (this.socket && Object.keys(this.socket).length) {
      this.socket.on('teams', (data) => {
        if (this.state.teams !== data) {
          this.setState({teams: data});
        }
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.teams !== prevProps.teams) {
      this.setState({ teams: this.props.teams })
    }
    if (this.props.joinedRoom !== prevProps.joinedRoom) {
      this.setState({ joinedRoom: this.props.joinedRoom }, () => {
        if (this.state.joinedRoom && this.socket) {
          this.socket.emit('team getter', 'some payload');
        }
      })
    }
  }

  joinedTeam = () => {
    this.setState({hasJoinedTeam: true});
    let teamArray = this.state.teams;
    let currentTeam = this.state.teamJoined;
    let playerArray = currentTeam.players;
    playerArray = [...playerArray, this.state.playerName];
    currentTeam.players = playerArray;
    teamArray[this.state.teamId] = currentTeam;
    this.setState({teams: teamArray}, () => {
      this.socket.emit('teams', this.state.teams)
    })
  }

  render() {
    if (this.state.hasJoinedTeam === false) {
      return (
        <Col xs={12} className="mobile-join">
          <TeamSelect
            onTeamJoined={ (team) => {
              this.setState({teamJoined: this.state.teams[team], teamId: team});
            }}
            onNameEntered={ (name) => {
              this.setState({playerName: name});
            }}
            teams={this.state.teams}
          />
          <Button onClick={this.joinedTeam}>Join Team</Button>
        </Col>
      );
    }
    return (
      <Row>
        <Col xs={12} className="mobile-buzzer">
          <div className="team-name">
            { this.state.teamJoined.name }
          </div>
          <div className="player-name">
            { this.state.playerName }
          </div>
        </Col>
        <Col xs={12} className="buzzer-button-wrapper">
          <Buzzer teamJoined={this.state.teamJoined} socket={this.socket} playerName={ this.state.playerName } teamId={ this.state.teamId } />
        </Col>
      </Row>
    );
  }
}

export default MobileScreen;
