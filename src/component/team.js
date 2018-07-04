import React, { Component } from 'react';
import { Col } from 'react-bootstrap';

class Team extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      score: '',
      id: '',
      players: [],
      active: false
    };
  }

  componentDidMount() {
    this.socket = this.props.socket;
    this.setState({name: this.props.name, score: this.props.score, id: this.props.id});
    if (this.socket && Object.keys(this.socket).length) {
      this.socket.on('firsties', (data) => {
        console.log(data, this.state.id)
        if (this.state.id === data) {
          this.setState({active: true})
        }
      })
    }
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.score !== prevProps.score) {
      this.setState({score: this.props.score});
    }
    if (this.props.players !== prevProps.players) {
      this.setState({ players: this.props.players });
    }
  }

  getPlayers = () => {
    if (this.state.players.length) {
      const players = this.state.players.map((v, k)=> {
        return (<li className="player-name" key={k}>{v}</li>);
      })
      return players;
    }
    return null;
  }

  render() {
    let scoreClasses = 'score';
    const active = this.state.active ? 'answering' : null;
    if (!this.state.name) {
      return (<div>Loading Team</div>);
    }
    if (Number(this.state.score) < 0) {
      scoreClasses = 'score negative';
    }

    return (
      <Col xs={12} className={active}>
        <div className="team-name ">{this.state.name}</div>
        <div className="players">
          <ul>
            { this.getPlayers() }
          </ul>
        </div>
        <div className={scoreClasses}>{this.state.score}</div>
      </Col>
    );
  }
}

export default Team;
