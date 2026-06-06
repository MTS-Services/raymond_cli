import React, { memo } from "react";
import ChatPanel from "../../components/chat/ChatPanel";

const AdminMessages = memo(() => (
  <div className="flex-1 min-h-0 flex flex-col gap-4">
    <div className="shrink-0">
      <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
      <p className="text-gray-500 text-base mt-1">
        Conversations with users and clients.
      </p>
    </div>

    <ChatPanel role="admin" className="flex-1 min-h-0" />
  </div>
));
AdminMessages.displayName = "AdminMessages";

export default AdminMessages;
