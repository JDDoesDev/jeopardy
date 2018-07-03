import React, { Component } from 'react';
import { Col, Row, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

class TeamSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'none',
      teamsList: [],
      teams: []
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
        return (
          <option key={k} value={k}>{v.name}</option>
        )
      });
      return teams;
    }
    return null;
  }

  handleChange = (e) => {
    this.setState({value: e.target.value }, () => {
      this.props.onTeamJoined(this.state.value)
    })
  }

  render() {
    const teams = this.buildOptions();
    return (
      <FormGroup controlId="formControlsSelect">
        <ControlLabel>Select your team:</ControlLabel>
        <FormControl componentClass="select" placeholder="none">
          <option value="none"> -- Select -- </option>
          { teams }
        </FormControl>
      </FormGroup>
    )
  }
}
export default TeamSelect;
