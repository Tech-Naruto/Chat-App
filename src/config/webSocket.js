const presenceEventsListener = new Set();
const messageEventsListener = new Set();
const roomEventsListener = new Set();

const addPresenceEventsListener = (listener) => {
  presenceEventsListener.add(listener);
};

const removePresenceEventsListener = (listener) => {
  presenceEventsListener.delete(listener);
};

const addMessageEventsListener = (listener) => {
  messageEventsListener.add(listener);
};

const removeMessageEventsListener = (listener) => {
  messageEventsListener.delete(listener);
};

const addRoomEventsListener = (listener) => {
  roomEventsListener.add(listener);
};

const removeRoomEventsListener = (listener) => {
  roomEventsListener.delete(listener);
};

let socket;
let heartbeatInterval;
let numberOfReconnections = 0;
const webSocketConfig = (userStatusRef) => {
  socket = new WebSocket("wss://chat-app-backend-bnbt.onrender.com");

  socket.onopen = () => {
    console.log("✅ WebSocket connected frontend");
    heartbeatInterval = setInterval(() => {
      socket.send(JSON.stringify({ type: "heartbeat" }));
    }, 120000); // Send heartbeat every 2 minutes
  };

  socket.onclose = async (event) => {
    console.log("❌ WebSocket disconnected");
    console.log("🔍 Close code:", event.code);
    console.log("🔍 Reason:", event.reason.toString("utf8"));
    console.log("🔍 Was clean:", event.wasClean);

    clearInterval(heartbeatInterval);

    // Attempt to reconnect after a delay
    if (userStatusRef.current) {
      if(numberOfReconnections > 5) {
        return;
      };
      setTimeout(() => {
        console.log("🔄 Attempting to reconnect...", numberOfReconnections);
        webSocketConfig(userStatusRef);
        numberOfReconnections++;
      }, 5000); // Reconnect after 5 seconds
    }
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "presence-events") {
      presenceEventsListener.forEach((listener) => listener(data));
    } else if (data.type === "message") {
      messageEventsListener.forEach((listener) => listener(data));
    } else if (data.type === "room") {
      roomEventsListener.forEach((listener) => listener(data));
    }
  };
  socket.onerror = (err) => console.error("⚠️ WebSocket error:", err);

  return socket;
};

export {
  socket,
  webSocketConfig,
  addPresenceEventsListener,
  removePresenceEventsListener,
  addMessageEventsListener,
  removeMessageEventsListener,
  addRoomEventsListener,
  removeRoomEventsListener,
};
