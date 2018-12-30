import React, { Component } from 'react';
import { ChatFeed, Message } from 'react-chat-ui';
import Sockette from 'sockette';
import { ServiceEndpoint } from './stack.json';
import './App.css';

class App extends Component {
  private ws: any;

  state = {
    error: null,
    status: 3,
    message: '',
    messages: [],
    nickname: '',
  };

  constructor(props: any) {
    super(props);

    this.ws = new Sockette(ServiceEndpoint, {
      timeout: 5e3,
      maxAttempts: 3,
      onopen: () => this.setState({ status: 1 }),
      onmessage: e => {
        const data = JSON.parse(e.data);

        if (data.action === 'message') {
          this.setState(
            {
              messages: [
                ...this.state.messages,
                new Message({
                  id: 0,
                  message: data.body,
                }),
              ],
            },
            () => {
              window.scrollBy(0, 200);
            },
          );
        }
      },
      onclose: e => this.setState({ status: 2 }),
      onerror: error => {
        console.log(error);
        this.setState({ status: 2, error });
      },
    });
  }

  componentDidMount() {
    const nickname = window.localStorage.getItem('nickname');

    if (nickname) {
      this.setState({
        nickname,
      });
    }
  }

  onMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    this.ws.json({ action: 'message', body: this.state.message });
    this.setState({
      message: '',
    });
  };

  renderContent = () => {
    if (this.state.status === 0) return <p>Connecting...</p>;
    if (this.state.status === 2) return <p>Error 😭</p>;

    return (
      <>
        <ChatFeed
          messages={this.state.messages}
          hasInputField={false}
          showSenderName
          bubblesCentered={false}
          bubbleStyles={{
            text: {
              fontSize: 14,
              color: 'white',
            },
            chatbubble: {
              borderRadius: 20,
              padding: 10,
            },
          }}
          maxHeight={window.innerHeight - 200}
        />
        <form onSubmit={e => this.onMessageSubmit(e)} className="message-form">
          <input
            placeholder="Type a message..."
            className="message-input"
            value={this.state.message}
            onChange={e => this.setState({ message: e.target.value })}
          />
        </form>
      </>
    );
  };

  render() {
    return <div className="App">{this.renderContent()}</div>;
  }
}

export default App;
