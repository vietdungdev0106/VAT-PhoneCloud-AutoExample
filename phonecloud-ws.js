// phonecloud-ws.js

class ActionResult {
    constructor(status, result, error) {
        this.status = status;
        this.result = result;
        this.error = error;
    }
}

class PhoneCloudWs {
    constructor({ apiKey, devices, debug = false }) {
        this.apiKey = apiKey;
        this.devices = devices;
        this.debug = debug;
        this.ws = null;
        this.wsPendingActions = {};
        this.onOpen = null;
        this.onClose = null;
        this.onMessage = null;
        this.onError = null;
        this.onDeviceConnected = null;
        this.onDeviceDisconnected = null;
        this.connect();
    }

    connect() {
        if (this.ws) {
            try { this.ws.close(); } catch (e) { }
            this.ws = null;
        }
        let idList = this.devices
            .filter(d => d.status !== "PENDING")
            .map(d => d.id)
            .join(',');
        this.ws = new WebSocket(`wss://phonecloud.dynns.com/ws/party?Access-Token=${getApiKey()}&Device-Ids=${idList}`);

        this.ws.onopen = (e) => {
            if (this.debug) console.log("WebSocket OPEN");
            if (typeof this.onOpen === 'function') this.onOpen(e);
        };
        this.ws.onclose = (e) => {
            this.reconnectWebSocket();
            if (this.debug) console.log("WebSocket CLOSE");
            if (typeof this.onClose === 'function') this.onClose(e);
        };
        this.ws.onerror = (e) => {
            if (this.debug) console.error("WebSocket ERROR", e);
            if (typeof this.onError === 'function') this.onError(e);
        };
        this.ws.onmessage = (event) => {
            if (this.debug) console.log("WebSocket MSG", event.data);
            let msg;
            try {
                msg = JSON.parse(event.data);
            } catch (e) {
                return;
            }
            if (msg.type == "SUBSCRIBE" && typeof this.onDeviceConnected === 'function') {
                const payload = msg.payload;
                const device = this.devices.find(d => d.id === payload.device_id);
                if (device) {
                    device.subId = payload.id;
                }
                this.onDeviceConnected(payload);
            } else if (msg.type == "UNSUBSCRIBE" && typeof this.onDeviceDisconnected === 'function') {
                const payload = msg.payload;
                const device = this.devices.find(d => d.id === payload.device_id);
                if (device) {
                    device.subId = "";
                }
                this.onDeviceDisconnected(payload);
            } else if (msg.type == "MESSAGE") {
                const payload = msg.payload;
                if (payload?.request_id && this.wsPendingActions[payload.request_id]) {
                    const requestId = payload.request_id;
                    const action = this.wsPendingActions[requestId];
                    action.resolve(new ActionResult(payload.status, payload.result, payload.error));
                    clearTimeout(action.timeoutId);
                    delete this.wsPendingActions[requestId];
                }else if(typeof this.onMessage === 'function') {
                    this.onMessage(payload);
                }
            }
        };
    }

    reconnectWebSocket() {
        if (wsReconnectTimer) return;
        wsReconnectTimer = setTimeout(() => {
            wsReconnectTimer = null;
            console.log("Reconnect WebSocket...");
            this.connect();
        }, 1000); // Đợi 1 giây rồi reconnect
    }

    sendMsg(msg) {
        if (!this.ws || this.ws.readyState !== 1) throw new Error("WebSocket not ready!");
        if (this.debug) console.log("Send MSG:", msg);
        this.ws.send(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }

    getDeviceSubId(deviceId) {
        const device = devices.find(d => d.id === deviceId);
        return device ? device.subId : "";
    }

    // Gọi action tới deviceId, actionName (action_id), args, timeout ms
    sendActionToDevice(deviceId, actionName, args, timeout = 8000) {
        const subId = this.getDeviceSubId(deviceId);
        if (!subId) throw new Error("Device not connected/subId missing!");

        const request_id = this.createRequestId();
        const msg = {
            type: "MESSAGE",
            subscription_id: subId,
            payload: {
                type: "ACTION_CONTROL",
                request_id,
                action_id: actionName,
                args: args || {}
            }
        };
        this.sendMsg(msg);

        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                delete this.wsPendingActions[request_id];
                resolve(new ActionResult(false, "", "Timeout for request_id: " + request_id));
            }, timeout);
            this.wsPendingActions[request_id] = { resolve, reject, timeoutId };
        });
    }

    createRequestId() {
        if (window.crypto && window.crypto.randomUUID) {
            return window.crypto.randomUUID();
        }
        // fallback:
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
