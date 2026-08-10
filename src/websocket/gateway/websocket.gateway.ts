import { ConnectionManager } from "../connection/connection.manager";
import connectionManager from "../connection/connection.manager";
import { EVENT_CODE } from "../events";
class WebSocketGateway {
  constructor(private readonly connectionManager: ConnectionManager) {}
  sendNotification(userId: string, data: string) {
    const jsonData = JSON.parse(data);
    const message = JSON.stringify({
      data: jsonData,
      event: EVENT_CODE.SEND_NOTIFICATION,
    });
    this.connectionManager.send(userId, message);
  }
}

export default new WebSocketGateway(connectionManager);
