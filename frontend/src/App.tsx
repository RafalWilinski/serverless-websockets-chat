import React, { Component } from 'react';
import { ChatFeed, Message } from 'react-chat-ui';
import Sockette from 'sockette';
import { ServiceEndpoint } from './stack.json';
import './App.css';

class App extends Component {
  private ws: any;

  state = {
    error: null,
    status: 0,
    message: '',
    messages: [],
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

  onMessageSubmit = (e: any) => {
    e.preventDefault();

    this.ws.json({ action: 'message', body: this.state.message });
    this.setState({
      message: '',
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.state.status === 0 && <p>Connecting...</p>}
          {this.state.status === 1 && (
            <>
              <ChatFeed
                messages={this.state.messages}
                hasInputField={false}
                showSenderName
                bubblesCentered={false}
                bubbleStyles={{
                  text: {
                    fontSize: 14,
                    color: 'black',
                  },
                  chatbubble: {
                    borderRadius: 20,
                    padding: 10,
                  },
                }}
                maxHeight={window.innerHeight - 200}
              />
              <form onSubmit={e => this.onMessageSubmit(e)}>
                <input
                  placeholder="Type a message..."
                  className="message-input"
                  value={this.state.message}
                  onChange={e => this.setState({ message: e.target.value })}
                />
              </form>
            </>
          )}
          {this.state.status === 2 && <p>Error 😭</p>}
        </header>
      </div>
    );
  }
}

export default App;
