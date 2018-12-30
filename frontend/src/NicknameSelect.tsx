import React from "react";

interface NicknameSelectProps {
  onNicknameSubmit(nickname: string): void;
}
export default class extends React.Component<NicknameSelectProps> {
  state = {
    nickname: ""
  };

  onNicknameSubmit = () => {
    this.props.onNicknameSubmit(this.state.nickname);
  };

  render() {
    return (
      <form onSubmit={this.onNicknameSubmit}>
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
