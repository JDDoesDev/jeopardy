import React, { Component } from 'react';
import { Col, Row, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class TeamSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamName: '',
      teamsList: [],
      teams: [],
      playerName: ''
    }
  }

  componentDidMount() {
    this.setState({teams: this.props.teams})
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.teams !== this.props.teams) {
      this.setState({teams: this.props.teams})
    }
  }

  buildOptions = () => {
    console.log(this.state.teams);
    if (this.state.teams.length) {
      const teams = this.state.teams.map((v, k) => {
        console.log(v, k)
        return (
          <option key={k} value={k}>{v.name}</option>
        )
      });
      return teams;
    }
    return null;
  }

  handleTeamChange = (e) => {
    this.setState({teamName: e.target.value }, () => {
      this.props.onTeamJoined(this.state.teamName)
    })
  }

  handlePlayerChange = (e) => {
    this.setState({playerName: e.target.value }, () => {
      this.props.onNameEntered(this.state.playerName)
    })
  }

  render() {
    const teams = this.buildOptions();
    return (
      <form>
        <FormGroup controlId="formControlsSelect">
          <ControlLabel>Select your team:</ControlLabel>
          <FormControl onChange={this.handleTeamChange} componentClass="select" placeholder="none">
            <option value="none"> -- Select -- </option>
            { teams }
          </FormControl>
          <ControlLabel>Player Name:</ControlLabel>
          <FormControl
            type="text"
            value={this.state.playerName}
            placeholder="Enter text"
            onChange={this.handlePlayerChange}
          />
        </FormGroup>
      </form>
    )
  }
}
export default TeamSelect;
