import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    collection, addDoc, query, where, orderBy, onSnapshot,
    updateDoc, doc, getDoc, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { toast } from 'react-toastify';
import { decodeToken } from 'utils/tokenUtils';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [chatRooms, setChatRooms] = useState([]);
    const [currentChatRoom, setCurrentChatRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    // Khởi tạo người dùng từ token
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const decodedToken = decodeToken(token);
            if (decodedToken) {
                setUser({
                    id: decodedToken.id,
                    fullName: decodedToken.fullName,
                    role: decodedToken.role
                });
            }
        }
    }, []);

    // Tạo phòng chat mới
    const createChatRoom = async (topic = "Tư vấn y tế") => {
        if (!user || user.role !== 'CUSTOMER') {
            toast.error('Chỉ bệnh nhân mới có thể tạo phòng chat');
            return null;
        }

        setLoading(true);
        try {
            const chatRoomData = {
                customerId: user.id,
                customerName: user.fullName,
                doctorId: null,
                doctorName: null,
                topic: topic,
                status: 'waiting',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            const docRef = await addDoc(collection(db, 'chatRooms'), chatRoomData);

            // Gửi tin nhắn đầu tiên
            await addDoc(collection(db, 'messages'), {
                chatRoomId: docRef.id,
                senderId: user.id,
                senderName: user.fullName,
                senderRole: user.role,
                message: `Xin chào, tôi cần tư vấn về ${topic}`,
                timestamp: serverTimestamp(),
                type: 'text'
            });

            // Theo dõi thay đổi phòng chat mới tạo
            const unsubscribe = onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    const updatedRoom = { id: doc.id, ...doc.data() };
                    setChatRooms(prev => prev.map(room =>
                        room.id === updatedRoom.id ? updatedRoom : room
                    ));
                }
            });

            toast.success('Đã tạo phòng chat thành công!');
            return docRef.id;
        } catch (error) {
            console.error('Error creating chat room:', error);
            toast.error('Không thể tạo phòng chat');
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Tham gia phòng chat (bác sĩ)
    const joinChatRoom = async (chatRoomId) => {
        if (!user || user.role !== 'DOCTOR') {
            toast.error('Chỉ bác sĩ mới có thể tham gia phòng chat');
            return false;
        }

        setLoading(true);
        try {
            const chatRoomRef = doc(db, 'chatRooms', chatRoomId);

            await updateDoc(chatRoomRef, {
                doctorId: user.id,
                doctorName: user.fullName,
                status: 'active',
                updatedAt: serverTimestamp()
            });

            // Gửi thông báo hệ thống
            await addDoc(collection(db, 'messages'), {
                chatRoomId: chatRoomId,
                senderId: 'system',
                senderName: 'Hệ thống',
                senderRole: 'system',
                message: `Bác sĩ ${user.fullName} đã tham gia cuộc tư vấn`,
                timestamp: serverTimestamp(),
                type: 'system'
            });

            toast.success('Đã tham gia phòng chat thành công!');
            return true;
        } catch (error) {
            console.error('Error joining chat room:', error);
            toast.error('Không thể tham gia phòng chat');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Lấy danh sách phòng chat
    const getChatRooms = () => {
        if (!user) return;

        let q;
        if (user.role === 'CUSTOMER') {
            q = query(
                collection(db, 'chatRooms'),
                where('customerId', '==', user.id),
                orderBy('updatedAt', 'desc')
            );
        } else {
            q = query(
                collection(db, 'chatRooms'),
                orderBy('updatedAt', 'desc')
            );
        }

        return onSnapshot(q, (snapshot) => {
            const rooms = [];
            snapshot.forEach((doc) => {
                rooms.push({
                    id: doc.id,
                    ...doc.data(),
                    updatedAt: doc.data().updatedAt?.toDate()
                });
            });
            setChatRooms(rooms);
        });
    };

    const getMessages = (chatRoomId) => {
        if (!chatRoomId) return;

        console.log("🔥 Đang lắng nghe tin nhắn từ room:", chatRoomId); // Debug log

        const q = query(
            collection(db, "messages"),
            where("chatRoomId", "==", chatRoomId),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newMessages = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                newMessages.push({
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp?.toDate(), // Chuyển Firestore Timestamp → JavaScript Date
                });
            });

            console.log("📨 Tin nhắn mới nhận được:", newMessages); // Debug log
            setMessages(newMessages);
        });

        return unsubscribe;
    };
    const sendMessage = async (chatRoomId, message) => {
        if (!user || !message.trim()) return false;

        try {
            // Thêm tin nhắn vào Firestore
            const docRef = await addDoc(collection(db, "messages"), {
                chatRoomId,
                senderId: user.id,
                senderName: user.fullName,
                senderRole: user.role,
                message: message.trim(),
                timestamp: serverTimestamp(), // ⚠️ Luôn dùng serverTimestamp() thay vì new Date()
                type: "text",
            });

            console.log("📤 Tin nhắn đã gửi thành công, ID:", docRef.id); // Debug log

            // Cập nhật thời gian sửa đổi phòng chat
            await updateDoc(doc(db, "chatRooms", chatRoomId), {
                updatedAt: serverTimestamp(),
            });

            return true;
        } catch (error) {
            console.error("❌ Lỗi khi gửi tin nhắn:", error);
            return false;
        }
    };

    // Kết thúc phiên chat
    const endChatSession = async (chatRoomId) => {
        try {
            await updateDoc(doc(db, 'chatRooms', chatRoomId), {
                status: 'completed',
                updatedAt: serverTimestamp()
            });

            await addDoc(collection(db, 'messages'), {
                chatRoomId: chatRoomId,
                senderId: 'system',
                senderName: 'Hệ thống',
                senderRole: 'system',
                message: `Cuộc tư vấn đã kết thúc`,
                timestamp: serverTimestamp(),
                type: 'system'
            });

            toast.success('Đã kết thúc cuộc tư vấn');
        } catch (error) {
            console.error('Error ending chat:', error);
            toast.error('Không thể kết thúc cuộc tư vấn');
        }
    };

    return (
        <ChatContext.Provider value={{
            user,
            chatRooms,
            currentChatRoom,
            setCurrentChatRoom,
            messages,
            loading,
            createChatRoom,
            joinChatRoom,
            getChatRooms,
            getMessages,
            sendMessage,
            endChatSession
        }}>
            {children}
        </ChatContext.Provider>
    );
};