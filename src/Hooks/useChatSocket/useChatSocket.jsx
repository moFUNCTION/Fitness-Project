import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

export const useChatSocket = (userId) => {
  const socket = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    if (!userId) return;

    const apiUrl = "https://api.ls-fitnes.com";
    console.log("Connecting to:", apiUrl);

    socket.current = io(apiUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.current.on("connect", () => {
      setConnected(true);
      socket.current.emit("addUser", { userId });
      console.log("asa");
      console.log("Connected to Socket.IO server with ID:", socket.current.id);
    });

    socket.current.on("receiveMessage", (message) => {
      console.log("Received message:", message);
      setMessages((prev) => [...prev, message]);
    });

    socket.current.on("receiveRepliedMessage", (message) => {
      console.log("Received replied message:", message);
      setMessages((prev) => [...prev, message]);
    });

    socket.current.on("receiveReactionToMessage", (reaction) => {
      console.log("Received reaction:", reaction);
      // Implement reaction handling logic here
    });

    socket.current.on("connect_error", (err) => {
      console.log(err, "Connection Error");
      setError(err.message);
    });

    socket.current.on("disconnect", () => {
      setConnected(false);
      console.log("Disconnected from Socket.IO server");
    });

    socket.current.on("errorMessage", (err) => {
      console.error("Socket.IO Error:", err);
      setError(err);
    });

    return () => {
      if (socket.current) {
        console.log("Cleaning up socket connection");
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [userId]);

  // Join a room
  const joinRoom = useCallback(
    (roomId) => {
      if (socket.current && connected) {
        console.log(`Joining room: ${roomId}`);
        socket.current.emit("joinRoom", { userId, roomId });
      } else {
        console.error("Cannot join room: Socket not connected");
      }
    },
    [userId, connected]
  );

  // Leave a room
  const leaveRoom = useCallback(
    (roomId) => {
      if (socket.current && connected) {
        console.log(`Leaving room: ${roomId}`);
        socket.current.emit("leaveRoom", { userId, roomId });
      }
    },
    [userId, connected]
  );

  // Send a private message
  const sendPrivateMessage = useCallback(
    ({ receiverId, text, media = [] }) => {
      if (socket.current && connected) {
        console.log(`Sending private message to: ${receiverId}`);
        socket.current.emit("sendMessage", {
          senderId: userId,
          receiverId,
          text,
          media,
        });
      } else {
        console.error("Cannot send message: Socket not connected");
      }
    },
    [userId, connected]
  );

  // Send a group message
  const sendGroupMessage = useCallback(
    ({ roomId, payload, media = [], action }) => {
      if (socket.current && connected) {
        console.log(`Sending group message to room: ${roomId}`);
        socket.current.emit("sendMessage", {
          senderId: userId,
          roomId,
          payload,
          media,
          action,
        });
      } else {
        console.error("Cannot send message: Socket not connected");
      }
    },
    [userId, connected]
  );

  // Send a reply message
  const sendReplyMessage = useCallback(
    ({
      receiverId,
      roomId,
      text,
      payload,
      repliedToMessageData,
      repliedToMessageId,
      media = [],
      action,
    }) => {
      if (socket.current && connected) {
        if (roomId) {
          console.log(`Sending group reply to room: ${roomId}`);
          socket.current.emit("sendMessage", {
            senderId: userId,
            roomId,
            payload,
            repliedToMessageData,
            repliedToMessageId,
            media,
            action,
          });
        } else {
          console.log(`Sending private reply to: ${receiverId}`);
          socket.current.emit("sendMessage", {
            senderId: userId,
            receiverId,
            text,
            repliedToMessageData,
            repliedToMessageId,
            media,
          });
        }
      }
    },
    [userId, connected]
  );

  // Toggle a reaction to a message
  const toggleReaction = useCallback(
    ({ messageId, emoji, receiverId, roomId }) => {
      if (socket.current && connected) {
        console.log(`Toggling reaction for message: ${messageId}`);
        socket.current.emit("toggleReaction", {
          senderId: userId,
          messageId,
          emoji,
          receiverId,
          roomId,
        });
      }
    },
    [userId, connected]
  );

  // Check connection status
  const checkConnection = useCallback(() => {
    if (socket.current) {
      return {
        connected: socket.current.connected,
        id: socket.current.id,
      };
    }
    return { connected: false, id: null };
  }, []);

  return {
    connected,
    messages,
    error,
    joinRoom,
    leaveRoom,
    sendPrivateMessage,
    sendGroupMessage,
    sendReplyMessage,
    toggleReaction,
    checkConnection,
  };
};
