import React, { Component } from 'react';
import { Row, Button, Col } from 'react-bootstrap';

import Team from './team';

class Teams extends Component {

  constructor(props) {
    super(props);

    this.state = {
      teams: [],
      currentTeam: '',
      acceptingNewTeams: true,
      maxTeams: '4',
      showInput: true,
      screenType: '',
      socket: [],
      currentValue: ''
    }
  }

  componentDidMount() {
    this.setState({screenType: this.props.screenType});
    if (this.props.screenType !== 'host') {
      this.setState({showInput: false})
    }
    this.socket = this.props.socket;
    if (this.socket && this.props.screenType !== 'host') {
      this.socket.on('teams', (data) => {
        if (data !== this.state.teams) {
          this.setState({ teams: data });
        }
      });
    }
    if (this.socket && this.props.screenType === 'host') {
      this.socket.on('get teams', (d) => {
        this.sendTeamInfo();
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.currentValue !== prevState.currentValue) {
      this.setState({currentValue: this.props.currentValue});
    }
  }

  addTeam = () => {
    let teamArray = this.state.teams;
    teamArray.push({name: this.state.currentTeam, score: 0});
    this.setState({ teams: teamArray, currentTeam: ''}, () => {
      this.sendTeamInfo();
    });
  }

  sendTeamInfo = () => {
    if (this.state.screenType === 'host' && this.socket) {
      this.socket.emit('teams', this.state.teams);
    }
  }

  buildTeams = () => {
    if (this.state.teams.length) {
      const teams = this.state.teams.map((v, k) => {
        if (this.state.screenType !== 'host') {
          return (
            <Col xs={3} className='gameboard-team-item' key={k}>
              <Team id={k} name={v.name} score={v.score} />
            </Col>
          );
        }
        return (
          <Col xs={3} key={k}>
            <Team key={k} id={k} name={v.name} score={v.score} />
            <Button bsStyle='success' onClick={() => this.addMoney(k, this.state.currentValue)}>Correct</Button>
            <Button bsStyle='danger' onClick={() => this.takeMoney(k, this.state.currentValue)}>Wrong</Button>
          </Col>
        );
      });
      return teams;
    }
    return '';
  }

  finishTeams = () => {
    let teamArray = this.state.teams;
    this.setState({showInput: false});
    this.setState({teams : teamArray}, () => this.sendTeamInfo());
  }

  addMoney = (key, val) => {
    let teamArray = this.state.teams;
    teamArray[key].score += Number(val);
    this.setState({teams : teamArray}, () => this.sendTeamInfo());
  }

  takeMoney = (key, val) => {
    let teamArray = this.state.teams;
    teamArray[key].score -= Number(val);
    this.setState({teams : teamArray}, () => this.sendTeamInfo());
  }

  render() {
    const teams = this.buildTeams();
    const getInputs = (show) => {
      if (show) {
        return (
          <Row>
            <input
              value={ this.state.currentTeam }
              onChange={event => this.setState({ currentTeam: event.target.value })} />
            <Button disabled={ !this.state.currentTeam } onClick={() => {this.addTeam();}}>Add Team</Button>
            <Button onClick={() => {this.finishTeams();}}>Finished</Button>
          </Row>
        );
      }
    }
    const inputs = getInputs(this.state.showInput);
    return (
      <Row>
        { inputs }
        <Row className='flex-row'>
          {teams}
        </Row>
      </Row>
    );
  }
}

export default Teams;
