// components/Chat/ChatApp.js
import React, { useState } from 'react';
import { ChatProvider } from './ChatContext';
import ChatRoomList from './ChatRoomList';
import ChatWindow from './ChatWindow';
import { motion } from 'framer-motion';

const ChatApp = () => {
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  return (
    <ChatProvider>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            style={{ height: 'calc(100vh - 2rem)' }}
          >
            <div className="flex h-full">
              {/* Chat Room List */}
              <div className="w-80 border-r border-gray-200">
                <ChatRoomList onSelectRoom={setSelectedRoomId} />
              </div>
              
              {/* Chat Window */}
              <div className="flex-1">
                <ChatWindow chatRoomId={selectedRoomId} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ChatProvider>
  );
};

export default ChatApp;