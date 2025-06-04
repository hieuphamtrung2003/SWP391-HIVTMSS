import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebaseConfig'; // Adjust the import path as needed

export const useChat = (user) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatRoom, setChatRoom] = useState(null);

  // Create or get existing chat room
  useEffect(() => {
    if (!user?.uid) return;

    const initializeChatRoom = async () => {
      try {
        // Use different chat room IDs based on role
        const chatRoomId = user.role === 'STAFF' || user.role === 'ADMIN' 
          ? `staff_${user.uid}` 
          : `customer_${user.uid}`;
        
        const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
        const chatRoomDoc = await getDoc(chatRoomRef);

        if (!chatRoomDoc.exists()) {
          // Create new chat room
          await setDoc(chatRoomRef, {
            participantId: user.uid,
            participantName: user.displayName || user.email,
            participantRole: user.role,
            createdAt: serverTimestamp(),
            lastMessage: null,
            lastMessageTime: serverTimestamp(),
            status: 'active'
          });
        }

        setChatRoom(chatRoomId);
      } catch (error) {
        console.error('Error initializing chat room:', error);
      }
    };

    initializeChatRoom();
  }, [user]);

  // Listen to messages
  useEffect(() => {
    if (!chatRoom) return;

    const messagesRef = collection(db, 'chatRooms', chatRoom, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().createdAt?.toDate?.()?.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) || 'Sending...'
      }));
      
      setMessages(messageList);
      setLoading(false);
    }, (error) => {
      console.error('Error listening to messages:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatRoom]);

  // Send text message
  const sendMessage = async (content) => {
    if (!chatRoom || !content.trim() || !user) return;

    try {
      const messagesRef = collection(db, 'chatRooms', chatRoom, 'messages');
      await addDoc(messagesRef, {
        content,
        senderId: user.uid,
        senderName: user.displayName || user.email,
        senderRole: user.role,
        type: 'text',
        createdAt: serverTimestamp(),
        read: false
      });

      // Update chat room last message
      const chatRoomRef = doc(db, 'chatRooms', chatRoom);
      await setDoc(chatRoomRef, {
        lastMessage: content,
        lastMessageTime: serverTimestamp(),
        lastSender: user.displayName || user.email
      }, { merge: true });

    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  // Send image message
  const sendImage = async (file) => {
    if (!chatRoom || !file || !user) return;

    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `chat-images/${chatRoom}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Send message with image URL
      const messagesRef = collection(db, 'chatRooms', chatRoom, 'messages');
      await addDoc(messagesRef, {
        content: '',
        imageUrl: downloadURL,
        fileName: file.name,
        senderId: user.uid,
        senderName: user.displayName || user.email,
        senderRole: user.role,
        type: 'image',
        createdAt: serverTimestamp(),
        read: false
      });

      // Update chat room last message
      const chatRoomRef = doc(db, 'chatRooms', chatRoom);
      await setDoc(chatRoomRef, {
        lastMessage: '📸 Đã gửi hình ảnh',
        lastMessageTime: serverTimestamp(),
        lastSender: user.displayName || user.email
      }, { merge: true });

    } catch (error) {
      console.error('Error sending image:', error);
      throw error;
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    sendImage,
    chatRoom
  };
};