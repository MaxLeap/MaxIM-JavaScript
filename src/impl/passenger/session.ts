import {PassengerMessageBuilder, PassengerSession} from "../../api/passenger";
import {Callback} from "../../model/models";
import {PassengerMessageBuilderImpl} from "./buildMessage";
import Socket = SocketIOClient.Socket;

class PassengerSessionImpl implements PassengerSession {

  public socket: Socket;
  public id: string;
  private closed: boolean;

  constructor(socket: Socket, passengerid: string) {
    this.socket = socket;
    this.id = passengerid;
  }

  public say(text: string, remark?: string): PassengerMessageBuilder {
    return new PassengerMessageBuilderImpl(this, text, remark);
  }

  public close(callback?: Callback<void>) {
    if (this.closed) {
      return;
    }
    this.closed = true;
    this.socket.close();
  }

}

export {
  PassengerSessionImpl,
};
