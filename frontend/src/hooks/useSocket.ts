import { useEffect, useState } from "react";

// Define the WebSocket URL
const WEBSOCKET_URL = "ws://localhost:8080";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket|null>(null);

  useEffect(() => {
    const newSocket = new WebSocket(WEBSOCKET_URL);

    newSocket.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(newSocket);
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed");
      setSocket(null);
    };

    return () => {
      newSocket.close();
    };
  }, []);

  return socket;
};
