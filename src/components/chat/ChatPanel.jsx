import React, {
  memo,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { Send, ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useSocket } from "../../hooks/useSocket";
import { socket } from "../../services/socket";
import { httpMethods } from "../../services/httpMethods";
import API_ENDPOINTS from "../../services/httpEndpoint";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

const formatMsgTime = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatSidebarTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
};

// ─── Avatar — handles null profileImage with initials fallback ────────────────

const Avatar = memo(({ src, name, size = "md", online }) => {
  const sizeClass = size === "sm" ? "size-9" : "size-12";
  const rounded = size === "sm" ? "rounded-full" : "rounded-2xl";
  return (
    <div className={`relative shrink-0 ${sizeClass}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClass} ${rounded} object-cover`}
          loading="lazy"
        />
      ) : (
        <div
          className={`${sizeClass} ${rounded} bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm select-none`}
        >
          {getInitials(name)}
        </div>
      )}
      {online === true && (
        <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-green-500" />
      )}
    </div>
  );
});
Avatar.displayName = "Avatar";

// ─── Bubble helpers ───────────────────────────────────────────────────────────

function computePositions(messages) {
  return messages.map((msg, i) => {
    const prev = messages[i - 1];
    const next = messages[i + 1];
    const samePrev = prev && prev.type === msg.type;
    const sameNext = next && next.type === msg.type;
    let position;
    if (!samePrev && !sameNext) position = "single";
    else if (!samePrev && sameNext) position = "first";
    else if (samePrev && sameNext) position = "middle";
    else position = "last";
    return { ...msg, position };
  });
}

function getBubbleCorners(type, position) {
  if (type === "received") {
    if (position === "single") return "rounded-[32px]";
    if (position === "first")
      return "rounded-tl-[32px] rounded-tr-[32px] rounded-br-[32px] rounded-bl-[4px]";
    if (position === "middle")
      return "rounded-tl-[4px] rounded-tr-[32px] rounded-br-[32px] rounded-bl-[4px]";
    return "rounded-tl-[4px] rounded-tr-[32px] rounded-br-[32px] rounded-bl-[32px]";
  }
  if (position === "single") return "rounded-[32px]";
  if (position === "first")
    return "rounded-tl-[32px] rounded-tr-[32px] rounded-br-[4px] rounded-bl-[32px]";
  if (position === "middle")
    return "rounded-tl-[32px] rounded-tr-[4px] rounded-br-[4px] rounded-bl-[32px]";
  return "rounded-tl-[32px] rounded-tr-[4px] rounded-br-[32px] rounded-bl-[32px]";
}

// ─── Conversation sidebar item ────────────────────────────────────────────────

const ConversationItem = memo(({ room, isActive, onClick }) => {
  const handleClick = useCallback(() => onClick(room.id), [room.id, onClick]);
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full flex gap-3 items-start px-4 py-4 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-500 cursor-pointer ${
        isActive ? "bg-white" : "bg-gray-200 hover:bg-gray-100"
      }`}
      aria-pressed={isActive}
    >
      <Avatar
        src={room.otherUser.avatar}
        name={room.otherUser.name}
        online={room.online}
      />
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-[16px] text-gray-900 tracking-[0.286px] truncate leading-normal">
            {room.otherUser.name}
          </span>
          {room.lastMessageTime && (
            <span className="text-xs text-gray-400 shrink-0">
              {formatSidebarTime(room.lastMessageTime)}
            </span>
          )}
        </div>
        <p
          className={`text-[14px] leading-5 line-clamp-1 ${
            room.hasUnread ? "font-semibold text-gray-800" : "text-gray-500"
          }`}
        >
          {room.lastMessage || "No messages yet"}
        </p>
        {room.hasUnread && (
          <span className="self-end size-2 rounded-full bg-orange-500" />
        )}
      </div>
    </button>
  );
});
ConversationItem.displayName = "ConversationItem";

// ─── Message bubble groups ────────────────────────────────────────────────────

const ReceivedGroup = memo(({ messages }) => (
  <div className="flex flex-col gap-1 items-start">
    {messages.map((msg) => (
      <div
        key={msg.id}
        className={`bg-bubble-received px-4 sm:px-5 py-3 sm:py-4 ${getBubbleCorners("received", msg.position)} max-w-[75vw] sm:max-w-[70%] lg:max-w-[65%]`}
      >
        <p className="text-slate-800 text-sm sm:text-[18px] leading-6 sm:leading-7 tracking-[0.5px] font-poppins wrap-break-word">
          {msg.text}
        </p>
        {msg.time && (
          <span className="text-[10px] text-gray-400 mt-1 block">
            {msg.time}
          </span>
        )}
      </div>
    ))}
  </div>
));
ReceivedGroup.displayName = "ReceivedGroup";

const SentGroup = memo(({ messages }) => (
  <div className="flex flex-col gap-1 items-end">
    {messages.map((msg) => (
      <div
        key={msg.id}
        className={`bg-bubble-sent px-4 sm:px-5 py-3 sm:py-4 ${getBubbleCorners("sent", msg.position)} max-w-[75vw] sm:max-w-[70%] lg:max-w-[65%]`}
      >
        <p className="text-slate-800 text-sm sm:text-[18px] leading-6 sm:leading-7 tracking-[0.5px] font-poppins wrap-break-word">
          {msg.text}
        </p>
        {msg.time && (
          <span className="text-[10px] text-gray-400 mt-1 block text-right">
            {msg.time}
          </span>
        )}
      </div>
    ))}
  </div>
));
SentGroup.displayName = "SentGroup";

// ─── Main ChatPanel ───────────────────────────────────────────────────────────

/**
 * @param {string}           [className] - optional extra wrapper class (e.g. height constraint)
 * @param {object}           [style]     - optional inline style object
 * @param {'admin'|'user'}   [role]      - 'admin' fetches all rooms; 'user' creates/gets own room
 */
const ChatPanel = memo(({ className = "", style, role = "user" }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const isAdmin = role === "admin";

  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const adminRoomIdsRef = useRef(new Set());
  const justLoadedRef = useRef(false);

  // ── Normalize API room → sidebar shape ──────────────────────────────────────
  const normalizeRoom = useCallback(
    (room) => {
      const other = room.participants?.find(
        (p) => String(p.userId) !== String(currentUser?.id),
      );
      const lastMsg = Array.isArray(room.messages) ? room.messages[0] : null;
      const hasUnread =
        lastMsg != null &&
        !lastMsg.isRead &&
        String(lastMsg.sender?.id) !== String(currentUser?.id);
      return {
        id: room.id,
        otherUser: {
          id: other?.user?.id ?? null,
          name: other?.user?.name ?? "Unknown",
          avatar: other?.user?.profileImage ?? null,
        },
        lastMessage: lastMsg?.content ?? "",
        lastMessageTime: lastMsg?.createdAt ?? room.updatedAt ?? null,
        hasUnread,
        online: false,
      };
    },
    [currentUser?.id],
  );

  // ── Normalize API message → bubble shape ────────────────────────────────────
  const normalizeMessage = useCallback(
    (msg) => ({
      id: msg.id,
      type:
        String(msg.sender?.id) === String(currentUser?.id)
          ? "sent"
          : "received",
      text: msg.content,
      time: formatMsgTime(msg.createdAt),
      senderId: msg.sender?.id,
      isRead: msg.isRead,
    }),
    [currentUser?.id],
  );

  // ── Load room(s) on mount ────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;

    const load = async () => {
      setLoadingRooms(true);

      if (isAdmin) {
        const { data, error } = await httpMethods.get(API_ENDPOINTS.CHAT.ROOMS);
        if (error) {
          toast.error(
            error?.data?.message ||
              error?.message ||
              "Failed to load conversations.",
          );
        } else {
          const list = data?.data ?? [];
          const normalized = list.map(normalizeRoom);
          setRooms(normalized);
          if (normalized.length > 0) setActiveRoomId(normalized[0].id);

          normalized.forEach((r) => {
            adminRoomIdsRef.current.add(String(r.id));
            socket.emit("conversation:join", String(r.id));
          });
        }
      } else {
        // User: POST creates room if not exists, returns existing room
        const { data, error } = await httpMethods.post(
          API_ENDPOINTS.CHAT.ROOM,
          {},
        );
        if (error) {
          toast.error(
            error?.data?.message || error?.message || "Failed to open chat.",
          );
        } else {
          const room = data?.data;
          if (room) {
            setRooms([normalizeRoom(room)]);
            setActiveRoomId(room.id);
          }
        }
      }

      setLoadingRooms(false);
    };

    load();
  }, [currentUser, isAdmin, normalizeRoom]);

  useEffect(() => {
    if (!isAdmin || adminRoomIdsRef.current.size === 0) return;
    adminRoomIdsRef.current.forEach((id) => {
      socket.emit("conversation:join", id);
    });
  }, [isAdmin, activeRoomId]);

  useEffect(() => {
    if (!isAdmin) return;
    const rejoinAll = () => {
      adminRoomIdsRef.current.forEach((id) => {
        socket.emit("conversation:join", id);
      });
    };
    socket.on("connect", rejoinAll);
    return () => {
      socket.off("connect", rejoinAll);
      adminRoomIdsRef.current.forEach((id) => {
        socket.emit("conversation:leave", id);
      });
      adminRoomIdsRef.current.clear();
    };
  }, [isAdmin]);

  // ── Load messages + mark as read when active room changes ─────────────────────
  useEffect(() => {
    if (!activeRoomId) return;

    const load = async () => {
      setLoadingMsgs(true);
      setMessages([]);
      setIsOtherTyping(false);

      const { data, error } = await httpMethods.get(
        API_ENDPOINTS.CHAT.MESSAGES(activeRoomId),
      );
      if (error) {
        toast.error(
          error?.data?.message || error?.message || "Failed to load messages.",
        );
      } else {
        const list = data?.data ?? [];
        justLoadedRef.current = true;
        setMessages(list.map(normalizeMessage));

        const lastMsg = list.length > 0 ? list[list.length - 1] : null;
        setRooms((prev) =>
          prev.map((r) =>
            String(r.id) === String(activeRoomId)
              ? {
                  ...r,
                  hasUnread: false,
                  ...(lastMsg && {
                    lastMessage: lastMsg.content,
                    lastMessageTime: lastMsg.createdAt,
                  }),
                }
              : r,
          ),
        );
      }

      setLoadingMsgs(false);
      httpMethods.put(API_ENDPOINTS.CHAT.MARK_READ(activeRoomId), {});
    };

    load();
  }, [activeRoomId, normalizeMessage]);

  // ── Auto-scroll to bottom on new messages ───────────────────────────────────
  useEffect(() => {
    if (!messagesEndRef.current || messages.length === 0) return;
    const behavior = justLoadedRef.current ? "instant" : "smooth";
    justLoadedRef.current = false;
    messagesEndRef.current.scrollIntoView({ behavior });
  }, [messages.length]);

  // ── Clean up typing timeout on unmount ──────────────────────────────────────
  useEffect(() => () => clearTimeout(typingTimeoutRef.current), []);

  // ── Poll messages every 4 s (real-time fallback while socket broadcast unconfirmed) ──
  useEffect(() => {
    if (!activeRoomId) return;
    const poll = setInterval(async () => {
      const { data } = await httpMethods.get(
        API_ENDPOINTS.CHAT.MESSAGES(activeRoomId),
      );
      if (!data) return;
      const incoming = (data?.data ?? []).map(normalizeMessage);
      setMessages((prev) => {
        if (prev.some((m) => String(m.id).startsWith("temp-"))) return prev;
        if (incoming.length <= prev.length) return prev;
        return incoming;
      });
    }, 4000);
    return () => clearInterval(poll);
  }, [activeRoomId, normalizeMessage]);

  // ── Poll rooms list every 8 s so sidebar stays fresh (admin only) ────────────
  useEffect(() => {
    if (!isAdmin) return;
    const poll = setInterval(async () => {
      const { data } = await httpMethods.get(API_ENDPOINTS.CHAT.ROOMS);
      if (!data) return;
      const incoming = (data?.data ?? []).map(normalizeRoom);
      setRooms((prev) =>
        incoming.map((r) => {
          const existing = prev.find((p) => p.id === r.id);
          return existing ? { ...r, online: existing.online } : r;
        }),
      );
    }, 8000);
    return () => clearInterval(poll);
  }, [isAdmin, normalizeRoom]);

  // ── Socket: incoming message ─────────────────────────────────────────────────
  const handleSocketMessage = useCallback(
    (payload) => {
      const conversationId = payload?.conversationId ?? payload?.roomId;
      const message = payload?.message ?? payload?.data;

      if (!message || !conversationId) return;

      const senderId = message?.sender?.id;
      if (
        senderId != null &&
        currentUser?.id != null &&
        String(senderId) === String(currentUser?.id)
      )
        return;

      const normalized = normalizeMessage(message);
      const sConv = String(conversationId);
      const sActive = String(activeRoomId);

      if (sConv === sActive) {
        setMessages((prev) => [...prev, normalized]);
        httpMethods.put(API_ENDPOINTS.CHAT.MARK_READ(conversationId), {});
      }

      setRooms((prev) =>
        prev.map((r) =>
          String(r.id) === sConv
            ? {
                ...r,
                lastMessage: message.content,
                lastMessageTime: message.createdAt,
                hasUnread: sConv !== sActive,
              }
            : r,
        ),
      );
    },
    [activeRoomId, currentUser?.id, normalizeMessage],
  );

  // ── Socket: typing indicators ─────────────────────────────────────────────────
  const handleTypingStart = useCallback(
    ({ conversationId }) => {
      if (String(conversationId) === String(activeRoomId))
        setIsOtherTyping(true);
    },
    [activeRoomId],
  );

  const handleTypingStop = useCallback(
    ({ conversationId }) => {
      if (String(conversationId) === String(activeRoomId))
        setIsOtherTyping(false);
    },
    [activeRoomId],
  );

  // ── Socket: online / offline ─────────────────────────────────────────────────
  const handleUserOnline = useCallback(({ userId }) => {
    setRooms((prev) =>
      prev.map((r) =>
        String(r.otherUser.id) === String(userId) ? { ...r, online: true } : r,
      ),
    );
  }, []);

  const handleUserOffline = useCallback(({ userId }) => {
    setRooms((prev) =>
      prev.map((r) =>
        String(r.otherUser.id) === String(userId) ? { ...r, online: false } : r,
      ),
    );
  }, []);

  const { sendTyping } = useSocket({
    conversationId: activeRoomId,
    onMessage: handleSocketMessage,
    onTypingStart: handleTypingStart,
    onTypingStop: handleTypingStop,
    onUserOnline: handleUserOnline,
    onUserOffline: handleUserOffline,
  });

  // ── Compute message groups for rendering ─────────────────────────────────────
  const messageGroups = useMemo(() => {
    const positioned = computePositions(messages);
    const groups = [];
    let current = null;
    for (const msg of positioned) {
      if (!current || current.type !== msg.type) {
        current = { type: msg.type, messages: [msg] };
        groups.push(current);
      } else {
        current.messages.push(msg);
      }
    }
    return groups;
  }, [messages]);

  const activeRoom = rooms.find((r) => r.id === activeRoomId);

  // ── Select room ──────────────────────────────────────────────────────────────
  const handleSelectRoom = useCallback((id) => {
    setActiveRoomId(id);
    setShowSidebar(false);
    setInputValue("");
  }, []);

  // ── Input change + typing indicator ─────────────────────────────────────────
  const handleInputChange = useCallback(
    (e) => {
      setInputValue(e.target.value);
      sendTyping(true);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => sendTyping(false), 1500);
    },
    [sendTyping],
  );

  // ── Send message ─────────────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || !activeRoomId) return;

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      type: "sent",
      text,
      time: formatMsgTime(new Date().toISOString()),
      senderId: currentUser?.id,
      isRead: false,
    };
    setMessages((prev) => [...prev, optimistic]);
    setInputValue("");
    inputRef.current?.focus();
    sendTyping(false);
    clearTimeout(typingTimeoutRef.current);

    const { data, error } = await httpMethods.post(
      API_ENDPOINTS.CHAT.SEND_MESSAGE(activeRoomId),
      { content: text },
    );

    if (error) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setInputValue(text);
      toast.error(
        error?.data?.message || error?.message || "Failed to send message.",
      );
      return;
    }

    const real = normalizeMessage(data?.data);
    if (!real.time) real.time = optimistic.time;
    setMessages((prev) => prev.map((m) => (m.id === tempId ? real : m)));

    setRooms((prev) =>
      prev.map((r) =>
        r.id === activeRoomId
          ? {
              ...r,
              lastMessage: text,
              lastMessageTime:
                data?.data?.createdAt ?? new Date().toISOString(),
            }
          : r,
      ),
    );
  }, [inputValue, activeRoomId, currentUser?.id, sendTyping, normalizeMessage]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleBackToSidebar = useCallback(() => setShowSidebar(true), []);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className={`flex overflow-hidden rounded-xl shadow-sm border border-gray-200 bg-gray-50 ${className}`}
      style={style}
    >
      {/* ── Sidebar ── */}
      <aside
        className={`${
          showSidebar ? "flex" : "hidden"
        } lg:flex flex-col w-full lg:w-76.5 shrink-0 border-r border-gray-200`}
        aria-label="Conversations"
      >
        <div className="flex items-center px-4 h-20 bg-gray-200 shrink-0">
          <span className="font-medium text-base text-gray-900 tracking-[0.352px] leading-normal">
            {isAdmin ? "All Conversations" : "Messages"}
          </span>
        </div>

        <div
          className="flex-1 overflow-y-auto scrollbar-light"
          role="list"
          aria-label="Conversations"
        >
          {loadingRooms ? (
            <p className="text-center text-gray-400 py-10 text-sm">Loading…</p>
          ) : rooms.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">
              No conversations yet.
            </p>
          ) : (
            rooms.map((room) => (
              <div key={room.id} role="listitem">
                <ConversationItem
                  room={room}
                  isActive={room.id === activeRoomId}
                  onClick={handleSelectRoom}
                />
              </div>
            ))
          )}
        </div>
      </aside>

      {/* ── Chat area ── */}
      <section
        className={`${
          !showSidebar ? "flex" : "hidden"
        } lg:flex flex-col flex-1 min-w-0`}
        aria-label={`Conversation with ${activeRoom?.otherUser?.name ?? ""}`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 h-20 bg-gray-200 shrink-0 border-b border-gray-200">
          <button
            type="button"
            onClick={handleBackToSidebar}
            className="lg:hidden text-gray-900 hover:text-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded cursor-pointer"
            aria-label="Back to conversations"
          >
            <ArrowLeft size={22} />
          </button>

          {activeRoom ? (
            <>
              <Avatar
                src={activeRoom.otherUser.avatar}
                name={activeRoom.otherUser.name}
                size="sm"
                online={activeRoom.online}
              />
              <div className="flex flex-col">
                <span className="font-medium text-lg sm:text-xl text-gray-900 tracking-[0.44px] leading-none">
                  {activeRoom.otherUser.name}
                </span>
                {(isOtherTyping || activeRoom.online) && (
                  <span className="text-xs text-gray-400 mt-0.5">
                    {isOtherTyping ? "Typing…" : "Online"}
                  </span>
                )}
              </div>
            </>
          ) : (
            <span className="text-gray-400 text-sm">Select a conversation</span>
          )}
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 flex flex-col gap-3"
          aria-live="polite"
          aria-label="Messages"
        >
          {loadingMsgs ? (
            <p className="text-center text-gray-400 py-10 text-sm">
              Loading messages…
            </p>
          ) : !activeRoomId ? (
            <p className="text-center text-gray-400 py-10 text-sm">
              Select a conversation to start chatting.
            </p>
          ) : messageGroups.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">
              No messages yet. Say hello!
            </p>
          ) : (
            messageGroups.map((group, gi) =>
              group.type === "received" ? (
                <ReceivedGroup key={gi} messages={group.messages} />
              ) : (
                <SentGroup key={gi} messages={group.messages} />
              ),
            )
          )}
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        {/* Input */}
        <div className="shrink-0 px-4 sm:px-6 py-4 sm:py-5 bg-gray-50">
          <div className="flex gap-3 items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              aria-label="Type a message"
              disabled={!activeRoomId}
              className="flex-1 h-13 bg-white rounded-full px-5 text-sm text-slate-800 placeholder-gray-400 tracking-[0.5px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.14)] focus:outline-none focus:ring-2 focus:ring-orange-400 transition-shadow disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputValue.trim() || !activeRoomId}
              aria-label="Send message"
              className="shrink-0 flex flex-col items-center justify-center size-13 bg-white rounded-full shadow-[0px_2px_8px_0px_rgba(0,0,0,0.14)] text-gray-400 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <Send size={18} aria-hidden="true" />
              <span className="text-[10px] font-semibold tracking-[0.5px] leading-none mt-0.5 select-none">
                SMS
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
});
ChatPanel.displayName = "ChatPanel";

export default ChatPanel;
