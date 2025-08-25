// Handles WebSocket connection with the Render server
class Net {
  constructor() {
    this.socket = null;
    this.handlers = {};
  }

  connect(url, playerName) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      this.send('join', { name: playerName });
    };

    this.socket.onmessage = (msg) => {
      let data = JSON.parse(msg.data);
      if (this.handlers[data.type]) {
        this.handlers[data.type](data.payload);
      }
    };

    this.socket.onclose = () => {
      alert('Disconnected from server');
    };
  }

  on(type, fn) {
    this.handlers[type] = fn;
  }

  send(type, payload) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    }
  }
}

export default new Net();
