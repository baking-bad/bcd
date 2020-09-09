export class BcdWs {
    constructor(host) {
        this.ws = new WebSocket(host);

        this.ws.onclose = function (event) {
            console.log("close: ", event.data);
        };
        this.ws.onerror = function (event) {
            console.log("error: ", event.data);
        };
    }

    send(data) {
        if (this.ws && this.ws.readyState === 1) {
            this.ws.send(JSON.stringify(data));
        }
    }

    onMessage(callback) {
        this.ws.onmessage = (msg) => {
            let data = JSON.parse(msg.data);
            callback(data);
        }
    }

    onOpen(callback) {
        if (this.ws.readyState !== 1) {
            this.ws.onopen = callback;
        } else {
            callback();
        }
    }
}