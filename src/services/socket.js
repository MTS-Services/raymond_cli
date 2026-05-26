import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.REACT_APP_API_BASE_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false, // connect manually in useSocket after auth token is available
  transports: ["websocket"],
  withCredentials: true,
});

if (process.env.NODE_ENV === "development") {
  socket.on("connect", () => console.log("[Socket] Connected:", socket.id));
  socket.on("disconnect", (reason) =>
    console.log("[Socket] Disconnected:", reason),
  );
  socket.on("connect_error", (err) =>
    console.warn("[Socket] Error:", err.message),
  );
}
