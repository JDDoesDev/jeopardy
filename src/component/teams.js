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
      currentValue: '',
      currentRound: null,
      finalResponses: [],
      finalSubmitted: []
    }
  }

  componentDidMount() {
    this.setState({screenType: this.props.screenType, currentRound: this.props.currentRound });
    if (this.props.screenType !== 'host') {
      this.setState({showInput: false})
    }
    this.socket = this.props.socket;
    if (this.socket) {
      this.socket.on('teams', (data) => {
        if (data !== this.state.teams) {
          this.setState({ teams: data });
        }
      });
      this.socket.on('round', (data) => {
        console.log('round received');
        if (data !== this.state.currentRound) {
          this.setState({ currentRound: data });
        }
      });
    }
    if (this.socket && this.props.screenType === 'host') {
      this.socket.on('team getter', (data) => {
        if (data) {
          this.sendTeamInfo();
        }
      })
      this.socket.on('final wager', (data) => {
        if (data) {
          this.finalWagerSubmitted(data.teamId);
        }
      })
      this.socket.on('final jeopardy', (data) => {
        if (data) {
          let teamArray = this.state.teams;
          teamArray[data.teamId].finalResponseSubmitted = true;

          this.setState({ finalResponses: [...this.state.finalResponses, data], teams: teamArray}, () => console.log(this.state.finalResponses))

        }
      })
    }
    if (this.socket && this.props.screenType !== 'host') {
      console.log('getting the teams')
      this.socket.emit('team getter', 'get some')
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.currentValue !== prevState.currentValue) {
      this.setState({currentValue: this.props.currentValue});
    }
    if (this.props.currentRound !== prevState.currentRound) {
      this.setState({currentRound: this.props.currentRound});
    }
  }

  finalWagerSubmitted = (key) => {
    let teamArray = this.state.teams;
    teamArray[key].finalWagerSubmitted = true;
    this.setState({teams: teamArray}, () => console.log(this.state.teams));
  }

  addTeam = () => {
    let teamArray = this.state.teams;
    teamArray.push({name: this.state.currentTeam, score: 0, players: {}});
    this.setState({ teams: teamArray, currentTeam: ''}, () => {
      this.sendTeamInfo();
    });
  }

  sendTeamInfo = () => {
    if (this.state.screenType === 'host' && this.socket) {
      console.log('sending teams')
      this.socket.emit('teams', this.state.teams);
    }
  }

  buildTeams = () => {
    if (this.state.teams.length) {
      const teams = this.state.teams.map((v, k) => {
        if (this.state.screenType !== 'host') {
          return (
            <Col xs={3} className='gameboard-team-item' key={k}>
              <Team id={k} name={v.name} score={v.score} socket={this.socket} />
            </Col>
          );
        }
        return (
          <Col xs={3} key={k}>
            <Team key={k} id={k} name={v.name} score={v.score} players={v.players} finalWagerSubmitted={v.finalWagerSubmitted} />
            <Button bsStyle='success' onClick={() => this.correctAnswer(k, this.state.currentValue)}>Correct</Button>
            <Button bsStyle='danger' onClick={() => this.wrongAnswer(k, this.state.currentValue)}>Wrong</Button>
            {(this.state.currentRound === 'finalJeopardy') ?
            <Row>
              <Col xs={12}>
                <Button disabled={!this.state.teams[k].finalResponseSubmitted} bsStyle='success' onClick={() => this.revealFinalAnswer(k, this.state.finalResponses)} block>Reveal Response</Button>
              </Col>
              <Col xs={12}>
                <Button disabled={!this.state.teams[k].finalWagerSubmitted} bsStyle='success' onClick={() => this.revealFinalWager(k, this.state.finalResponses)} block>Reveal Wager</Button>
              </Col>
            </Row>
            : null
            }
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

  correctAnswer = (key, val) => {
    let teamArray = this.state.teams;
    teamArray[key].score += Number(val);
    this.setState({teams : teamArray}, () => this.sendTeamInfo());
    if (this.socket && Object.keys(this.socket).length) {
      this.socket.emit('answered', [key, 'right']);
    }
  }

  wrongAnswer = (key, val) => {
    let teamArray = this.state.teams;
    teamArray[key].score -= Number(val);
    this.setState({teams : teamArray}, () => this.sendTeamInfo());
    if (this.socket && Object.keys(this.socket).length) {
      this.socket.emit('answered', [key, 'wrong']);
    }
  }

  revealFinalAnswer = (key, answers) => {
    const getCurrentResponse = () => answers.find(val => (val.teamId === key));
    let currentResponse = getCurrentResponse();
    if (currentResponse) {
      this.setState({ currentValue: currentResponse.wager ? currentResponse.wager : this.state.currentValue });
      currentResponse.currentTeam = this.state.teams[key].name
      if (this.socket && Object.keys(this.socket).length) {
        this.socket.emit('final answer', currentResponse)
      }
    }
  }

  revealFinalWager = (key, answers) => {
    let teamArray = this.state.teams;
    if (this.socket && Object.keys(this.socket).length) {
      this.socket.emit('final wager reveal', true)
    }
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
