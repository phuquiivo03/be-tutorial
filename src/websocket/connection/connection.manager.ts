import WebSocket from "ws";

export class ConnectionManager {
  private connections = new Map<string, WebSocket>();

  add(id: string, socket: WebSocket) {
    this.connections.set(id, socket);
  }
  remove(id: string) {
    this.connections.delete(id);
  }
  has(id: string): boolean {
    return this.connections.has(id);
  }
  get(id: string): WebSocket | undefined {
    return this.connections.get(id);
  }
  send(id: string, message: unknown) {
    const socket = this.connections.get(id);
    if (!socket) {
      return;
    }
    if (socket.readyState !== WebSocket.OPEN) {
      return;
    }

    socket.send(JSON.stringify(message));
  }
}

export default new ConnectionManager();
