import { useEffect, useCallback, useState, useRef } from "react";
import { socket } from "../services/socket";

export function useSocket({
  conversationId,
  onMessage,
  onTypingStart,
  onTypingStop,
  onUserOnline,
  onUserOffline,
}) {
  const [isConnected, setIsConnected] = useState(socket.connected);

  const onMessageRef = useRef(onMessage);
  const onTypingStartRef = useRef(onTypingStart);
  const onTypingStopRef = useRef(onTypingStop);
  const onUserOnlineRef = useRef(onUserOnline);
  const onUserOfflineRef = useRef(onUserOffline);

  onMessageRef.current = onMessage;
  onTypingStartRef.current = onTypingStart;
  onTypingStopRef.current = onTypingStop;
  onUserOnlineRef.current = onUserOnline;
  onUserOfflineRef.current = onUserOffline;

  useEffect(() => {
    const token = localStorage.getItem("token");

    const handleConnect = () => {
      setIsConnected(true);
      if (conversationId)
        socket.emit("conversation:join", String(conversationId));
    };
    const handleDisconnect = () => setIsConnected(false);
    const handleMessage = (data) => onMessageRef.current?.(data);
    const handleTypingStart = (data) => onTypingStartRef.current?.(data);
    const handleTypingStop = (data) => onTypingStopRef.current?.(data);
    const handleUserOnline = (data) => onUserOnlineRef.current?.(data);
    const handleUserOffline = (data) => onUserOfflineRef.current?.(data);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("message:new", handleMessage);
    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);
    socket.on("user:online", handleUserOnline);
    socket.on("user:offline", handleUserOffline);

    if (!socket.connected) {
      if (token) {
        socket.auth = { token };
        socket.connect();
      }
    } else if (conversationId) {
      socket.emit("conversation:join", String(conversationId));
    }

    return () => {
      if (conversationId)
        socket.emit("conversation:leave", String(conversationId));

      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("message:new", handleMessage);
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
      socket.off("user:online", handleUserOnline);
      socket.off("user:offline", handleUserOffline);
    };
  }, [conversationId]);

  const sendTyping = useCallback(
    (isTyping) => {
      if (!socket.connected || !conversationId) return;
      socket.emit(isTyping ? "typing:start" : "typing:stop", {
        conversationId,
      });
    },
    [conversationId],
  );

  return { sendTyping, isConnected };
}
