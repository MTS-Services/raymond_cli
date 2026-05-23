import React, { memo } from "react";
import ChatPanel from "../../components/chat/ChatPanel";

const UserMessages = memo(() => (
  <div className="flex flex-col gap-4 h-full min-h-0">
    <div className="shrink-0">
      <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
      <p className="text-gray-500 text-base mt-1">
        Your conversations with agents and vendors.
      </p>
    </div>

    <ChatPanel role="user" className="flex-1 min-h-0" />
  </div>
));
UserMessages.displayName = "UserMessages";

export default UserMessages;
