import React, { Component } from "react";
import { ChatFeed, Message } from "react-chat-ui";
import Sockette from "sockette";

import { ServiceEndpoint } from "./stack.json";
import NicknameSelect from "./NicknameSelect";
import { WSAEACCES } from "constants";

class App extends Component {
  private ws: any;

  state = {
    error: null,
    status: 0,
    message: "",
    messages: [],
    nickname: ""
  };

  constructor(props: any) {
    super(props);

    if (!ServiceEndpoint) {
      throw new Error(
        "ServiceEndpoint is not specified! Please deploy backend first."
      );
    }

    this.ws = new Sockette(ServiceEndpoint, {
      timeout: 5e3,
      maxAttempts: 3,
      onopen: this.onConnect,
      onmessage: this.onMessageReceive,
      onclose: () => this.setState({ status: 2 }),
      onerror: error => {
        console.log(error);
        this.setState({ status: 2, error });
      }
    });
  }

  onConnect = () => {
    const nickname = window.localStorage.getItem("nickname");
    this.setState({ status: 1 });

    if (nickname) {
      this.setState({ nickname });
      this.ws.json({
        action: "rename",
        nickname
      });
    }
  };

  onMessageReceive = (e: MessageEvent) => {
    const data = JSON.parse(e.data);

    if (data.action === "message") {
      this.setState(
        {
          messages: [
            ...this.state.messages,
            new Message({
              id: this.state.nickname === data.author ? 0 : 1,
              message: data.body
            })
          ]
        },
        () => {
          window.scrollBy(0, 200);
        }
      );
    } else if (data.action === "messages") {
      this.setState(
        {
          messages: [
            ...this.state.messages,
            ...data.messages
              .map((message: any) => JSON.parse(message.body))
              .map(
                (data: any) =>
                  new Message({
                    id: this.state.nickname === data.author ? 0 : 1,
                    message: data.body
                  })
              )
          ]
        },
        () => {
          window.scrollBy(0, 200);
        }
      );
    }
  };

  onMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    this.ws.json({
      action: "message",
      body: this.state.message,
      author: this.state.nickname
    });
    this.setState({
      message: ""
    });
  };

  onNicknameSubmit = (nickname: string) => {
    window.localStorage.setItem("nickname", nickname);
    this.setState({ nickname });
    this.ws.json({ action: "rename", nickname });
  };

  render() {
    if (this.state.status === 0) return <p>⏳ Connecting... ⏳</p>;
    if (!this.state.nickname)
      return <NicknameSelect onNicknameSubmit={this.onNicknameSubmit} />;
    if (this.state.status === 2) return <p>🛑 Error 🛑</p>;

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
              color: "white"
            },
            chatbubble: {
              borderRadius: 20,
              padding: 10
            }
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
  }
}

export default App;
