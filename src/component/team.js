import React, { Component } from 'react';
import { Col } from 'react-bootstrap';

class Team extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      score: '',
      id: null,
      players: [],
      active: false,
      finalWagerSubmitted: false
    };
  }

  componentDidMount() {
    this.socket = this.props.socket;
    this.setState({name: this.props.name, score: this.props.score, id: this.props.id});
    if (this.socket && Object.keys(this.socket).length) {
      this.socket.on('firsties', (data) => {
        if (this.state.id === Number(data)) {
          this.setState({active: 'answering'})
        }
      })
      this.socket.on('answered', (data) => {
        if (this.state.id === Number(data[0])) {
          if (data[1] === 'right') {
            this.setState({ active: 'answering right'}, () => {console.log(this.state.active)})
          } else {
            this.setState({ active: 'answering wrong'}, () => {console.log(this.state.active)})
          }
        }
      })
      this.socket.on('view clue', (data) => {
        if (data.toDo === 'close') {
          this.setState({ active: false })
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
    if (this.props.finalWagerSubmitted !== prevProps.finalWagerSubmitted) {
      this.setState({ finalWagerSubmitted: this.props.finalWagerSubmitted });
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

    if (!this.state.name) {
      return (<div>Loading Team</div>);
    }
    if (Number(this.state.score) < 0) {
      scoreClasses = 'score negative';
    }

    return (
      <Col xs={12} className={ this.state.active }>
        <div className="team-name ">{this.state.name}</div>
        <div className="players">
          <ul>
            { this.getPlayers() }
          </ul>
          {
            this.state.finalWagerSubmitted ?
            <div>
              Final Wager Submitted
            </div> :
            null
          }
          </div>
        <div className={scoreClasses}>{this.state.score}</div>
      </Col>
    );
  }
}

export default Team;
