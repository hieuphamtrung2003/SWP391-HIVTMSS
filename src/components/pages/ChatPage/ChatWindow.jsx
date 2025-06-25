import React, { useEffect, useRef, useState } from 'react';
import { useChat } from './ChatContext';
import { FaPaperPlane, FaUserMd, FaUser, FaPhoneSlash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const ChatWindow = ({ chatRoomId }) => {
  const { 
    user, 
    messages, 
    getMessages, 
    sendMessage,
    endChatSession,
    chatRooms
  } = useChat();
  
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const currentRoom = chatRooms.find(room => room.id === chatRoomId);

  // Theo dõi thay đổi phòng chat
  useEffect(() => {
    if (!chatRoomId) return;
    
    const unsubscribeMessages = getMessages(chatRoomId);
    
    return () => {
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, [chatRoomId]);

  // Cuộn xuống tin nhắn mới
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Hiển thị thông báo khi bác sĩ tham gia
  useEffect(() => {
    if (currentRoom?.status === 'active' && currentRoom?.doctorId) {
      toast.success(`Bác sĩ ${currentRoom.doctorName} đã tham gia!`);
    }
  }, [currentRoom?.status, currentRoom?.doctorId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    await sendMessage(chatRoomId, newMessage);
    setNewMessage('');
    inputRef.current?.focus();
    setSending(false);
  };

  const handleEndSession = async () => {
    if (window.confirm('Bạn có chắc chắn muốn kết thúc cuộc tư vấn này?')) {
      await endChatSession(chatRoomId);
    }
  };

  // Component hiển thị tin nhắn
  const MessageBubble = ({ message }) => {
    const isOwnMessage = message.senderId === user?.id;
    const isSystemMessage = message.senderRole === 'system';

    if (isSystemMessage) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center my-4"
        >
          <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm">
            {message.message}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
          {!isOwnMessage && (
            <div className="flex items-center mb-1">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                {message.senderRole === 'DOCTOR' ? (
                  <FaUserMd className="w-3 h-3 text-white" />
                ) : (
                  <FaUser className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {message.senderRole === 'DOCTOR' ? `BS. ${message.senderName}` : message.senderName}
              </span>
            </div>
          )}
          
          <div className={`px-4 py-2 rounded-lg ${
            isOwnMessage ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
          }`}>
            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
            <p className={`text-xs mt-1 ${
              isOwnMessage ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {message.timestamp?.toLocaleTimeString('vi-VN')}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  if (!chatRoomId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <FaUserMd className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">Chọn cuộc tư vấn</h3>
          <p>Chọn một cuộc tư vấn để bắt đầu trò chuyện</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <FaUserMd className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {currentRoom?.topic || 'Tư vấn y tế'}
              </h3>
              <p className="text-sm text-gray-500">
                {currentRoom?.status === 'waiting' && 'Đang chờ bác sĩ...'}
                {currentRoom?.status === 'active' && `Đang tư vấn với BS. ${currentRoom?.doctorName}`}
                {currentRoom?.status === 'completed' && 'Đã kết thúc'}
              </p>
            </div>
          </div>
          
          {currentRoom?.status === 'active' && (
            <button
              onClick={handleEndSession}
              className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <FaPhoneSlash className="w-4 h-4 mr-2" />
              Kết thúc
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {currentRoom?.status !== 'completed' && (
        <div className="p-4 border-t border-gray-200 bg-white">
          {currentRoom?.status === 'waiting' && user?.role === 'CUSTOMER' ? (
            <div className="text-center text-gray-500 py-4">
              <div className="animate-pulse flex items-center justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="ml-2">Đang chờ bác sĩ tham gia...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                />
              </div>
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPaperPlane className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWindow;