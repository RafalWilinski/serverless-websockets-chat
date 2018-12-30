import React, { SyntheticEvent } from 'react';

export default class extends React.Component {
  state = {
    nickname: '',
  };

  onNicknameSubmit = (e: React.FormEvent<HTMLFormElement>) => {};

  render() {
    return (
      <form onSubmit={e => this.onNicknameSubmit(e)}>
        <input
          placeholder="Pick username"
          className="nickname-input"
          value={this.state.nickname}
          onChange={e => this.setState({ nickname: e.target.value })}
        />
      </form>
    );
  }
}
