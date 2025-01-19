import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
console.log(import.meta.env.VITE_API_URL);
export const useChatSocket = (userId) => {
  const socket = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    // if (!userId) return;
    socket.current = io(`${import.meta.env.VITE_API_URL}`, {
      transports: ["websocket"],
    });
    console.log(socket.current);

    socket.current.on("connect", () => {
      setConnected(true);
      socket.current.emit("addUser", { userId });
      console.log("Connected to Socket.IO server");
    });

    socket.current.on("receiveMessage", (message) => {
      console.log("saasas");
      setMessages((prev) => [...prev, message]);
    });

    socket.current.on("disconnect", () => {
      setConnected(false);
      console.log("Disconnected from Socket.IO server");
    });
    socket.current.on("errorMessage", (err) => {
      console.error("Socket.IO Error:", err);
    });

    // return () => {
    //   if (socket.current) {
    //     socket.current.disconnect();
    //     socket.current = null;
    //   }
    // };
  }, [userId]);

  // Join a room
  const joinRoom = useCallback(
    (roomId) => {
      if (socket.current) {
        socket.current.emit("joinRoom", { userId, roomId });
      }
    },
    [userId]
  );

  // Leave a room
  const leaveRoom = useCallback(
    (roomId) => {
      if (socket.current) {
        socket.current.emit("leaveRoom", { userId, roomId });
      }
    },
    [userId]
  );

  // Send a private message
  const sendPrivateMessage = useCallback(
    ({ receiverId, text }) => {
      if (socket.current) {
        socket.current.emit("sendMessage", {
          senderId: userId,
          receiverId,
          text,
        });
      }
    },
    [userId]
  );

  // Send a group message
  const sendGroupMessage = useCallback(
    async ({ roomId, payload, action }) => {
      if (socket.current) {
        await socket.current.emit("sendMessage", {
          senderId: userId,
          roomId,
          payload,
          action,
        });
      }
    },
    [userId]
  );

  return {
    connected,
    messages,
    error,
    joinRoom,
    leaveRoom,
    sendPrivateMessage,
    sendGroupMessage,
  };
};
