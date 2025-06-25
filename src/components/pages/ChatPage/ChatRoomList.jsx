// components/Chat/ChatRoomList.js
import React, { useEffect, useState } from 'react';
import { useChat } from './ChatContext';
import { FaPlus, FaComments, FaClock, FaUserMd, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ChatRoomList = ({ onSelectRoom }) => {
  const { 
    user, 
    chatRooms, 
    createChatRoom, 
    joinChatRoom, 
    getChatRooms, 
    loading 
  } = useChat();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    const unsubscribe = getChatRooms();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const handleCreateRoom = async () => {
    if (!topic.trim()) {
      return;
    }
    
    const roomId = await createChatRoom(topic);
    if (roomId) {
      setShowCreateModal(false);
      setTopic('');
      onSelectRoom(roomId);
    }
  };

  const handleJoinRoom = async (roomId) => {
    const success = await joinChatRoom(roomId);
    if (success) {
      onSelectRoom(roomId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
        return 'text-yellow-600 bg-yellow-100';
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'waiting':
        return 'Đang chờ';
      case 'active':
        return 'Đang hoạt động';
      case 'completed':
        return 'Đã kết thúc';
      default:
        return 'Không xác định';
    }
  };

  const canJoinRoom = (room) => {
    if (user?.role !== 'DOCTOR') return false;
    if (room.status === 'completed') return false;
    if (room.doctorId && room.doctorId !== user.id) return false;
    return true;
  };

  const filteredRooms = user?.role === 'DOCTOR' 
    ? chatRooms.filter(room => room.status !== 'completed') 
    : chatRooms;

  return (
    <div className="h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaComments className="mr-2 text-blue-600" />
            Tư vấn trực tuyến
          </h2>
          {user?.role === 'CUSTOMER' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              title="Tạo cuộc tư vấn mới"
            >
              <FaPlus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Chat Room List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2">Đang tải...</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <FaComments className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p>Chưa có cuộc tư vấn nào</p>
            {user?.role === 'CUSTOMER' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-2 text-blue-600 hover:text-blue-700"
              >
                Tạo cuộc tư vấn đầu tiên
              </button>
            )}
          </div>
        ) : (
          <div className="p-2">
            {filteredRooms.map((room) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 mb-2 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  canJoinRoom(room) || (user?.role === 'CUSTOMER' && room.customerId === user.id)
                    ? 'hover:border-blue-300'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (user?.role === 'CUSTOMER' && room.customerId === user.id) {
                    onSelectRoom(room.id);
                  } else if (user?.role === 'DOCTOR' && canJoinRoom(room)) {
                    if (room.doctorId === user.id) {
                      onSelectRoom(room.id);  // Already joined, just open
                    } else {
                      handleJoinRoom(room.id);  // Join the room
                    }
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {room.topic}
                      </h3>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(room.status)}`}>
                        {getStatusText(room.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <FaUser className="w-3 h-3 mr-1" />
                      <span className="mr-3">{room.customerName}</span>
                      {room.doctorName && (
                        <>
                          <FaUserMd className="w-3 h-3 mr-1" />
                          <span>BS. {room.doctorName}</span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-400">
                      <FaClock className="w-3 h-3 mr-1" />
                      <span>
                        {room.updatedAt 
                          ? room.updatedAt.toLocaleString('vi-VN')
                          : 'Vừa tạo'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Doctor view - show if room is busy */}
                {user?.role === 'DOCTOR' && room.doctorId && room.doctorId !== user.id && (
                  <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                    <FaUserMd className="inline w-3 h-3 mr-1" />
                    Đang được tư vấn bởi BS. {room.doctorName}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">Tạo cuộc tư vấn mới</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chủ đề tư vấn
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="VD: Tư vấn về thuốc ARV, Hỏi về tác dụng phụ..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setTopic('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateRoom}
                disabled={!topic.trim() || loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang tạo...' : 'Tạo cuộc tư vấn'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ChatRoomList;