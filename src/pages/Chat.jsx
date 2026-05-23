import React, { memo } from "react";
import { useSEO } from "../hooks/useSEO";
import ChatPanel from "../components/chat/ChatPanel";

const Chat = memo(() => {
  useSEO({
    title: "Messages | Skyridge Group",
    description: "Chat with Skyridge Group agents and team members directly.",
    keywords: ["chat", "messages", "contact", "skyridge group"],
  });

  return (
    <div className="flex flex-col min-h-screen bg-primary-50 py-6 px-4 sm:px-8 lg:px-12">
      <div className="max-w-384 mx-auto h-full flex-1">
        <ChatPanel role="user" />
      </div>
    </div>
  );
});

Chat.displayName = "Chat";

export default Chat;
