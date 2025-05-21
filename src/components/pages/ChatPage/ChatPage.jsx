
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Loader2, Image as ImageIcon, X, XCircle } from 'lucide-react';

const ChatPage = () => {
    // Simplified state management with fake data
    const [messages, setMessages] = useState([
        {
            id: 1,
            userId: 1,
            userName: "Hỗ trợ viên",
            content: "Xin chào! Tôi có thể giúp gì cho bạn?",
            timestamp: "10:30",
            type: "text"
        },
        {
            id: 2,
            userId: 2,
            userName: "Nguyễn Văn A",
            content: "Tôi cần hỗ trợ về đơn hàng của mình",
            timestamp: "10:32",
            type: "text"
        },
        {
            id: 3,
            userId: 1,
            userName: "Hỗ trợ viên",
            content: "Vui lòng cung cấp mã đơn hàng để tôi kiểm tra giúp bạn",
            timestamp: "10:33",
            type: "text"
        },
        {
            id: 4,
            userId: 2,
            userName: "Nguyễn Văn A",
            content: "Mã đơn hàng của tôi là #DH12345",
            timestamp: "10:35",
            type: "text"
        },
        {
            id: 5,
            userId: 2,
            userName: "Nguyễn Văn A",
            imageUrl: "/api/placeholder/400/300",
            timestamp: "10:36",
            type: "image"
        },
        {
            id: 6,
            userId: 1,
            userName: "Hỗ trợ viên",
            content: "Cảm ơn bạn đã gửi hình ảnh. Tôi đã kiểm tra đơn hàng #DH12345 và thấy rằng nó đang trong quá trình vận chuyển. Dự kiến sẽ được giao vào ngày mai.",
            timestamp: "10:38",
            type: "text"
        }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isWithinSupportHours, setIsWithinSupportHours] = useState(true);
    const [viewImage, setViewImage] = useState(null);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Fake user info
    const userId = 2;
    const userName = "Nguyễn Văn A";

    // Simplified scroll behavior
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Simulate file selection
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            // Create fake preview URL
            setImagePreview("/api/placeholder/400/300");
        }
    };

    const removeSelectedImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleViewImage = (imageUrl) => {
        setViewImage(imageUrl);
        document.body.style.overflow = 'hidden';
    };

    const closeImageView = (e) => {
        if (e) e.stopPropagation();
        setViewImage(null);
        document.body.style.overflow = 'auto';
    };

    // Simplified message sending
    const handleSendMessage = (e) => {
        e.preventDefault();
        if ((!newMessage.trim() && !selectedImage) || isSending) return;

        setIsSending(true);

        // Simulate sending delay
        setTimeout(() => {
            const newMsg = {
                id: messages.length + 1,
                userId: userId,
                userName: userName,
                content: newMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: selectedImage ? "image" : "text",
                imageUrl: selectedImage ? imagePreview : null
            };

            setMessages([...messages, newMsg]);
            setNewMessage("");
            setSelectedImage(null);
            setImagePreview(null);
            setIsSending(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Simulate support agent typing
            if (Math.random() > 0.5) {
                setIsTyping(true);
                setTimeout(() => {
                    const response = {
                        id: messages.length + 2,
                        userId: 1,
                        userName: "Hỗ trợ viên",
                        content: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ hỗ trợ bạn sớm nhất có thể.",
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        type: "text"
                    };
                    setMessages(prevMessages => [...prevMessages, response]);
                    setIsTyping(false);
                }, 2000);
            }
        }, 1000);
    };

    return (
        <div className="flex h-[calc(100vh-132px)] bg-white  relative">
            {/* Sidebar */}
            <div className="w-80 border-r border-gray-200  bg-gray-100  p-4">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 ">Hỗ trợ trực tuyến</h2>
                    <p className="text-sm text-gray-500 ">Thời gian hỗ trợ: 8:00 - 17:00</p>
                </div>

                <div className="space-y-2">
                    <div className="bg-white  rounded-lg p-3">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${isWithinSupportHours ? 'bg-[#26A65B]' : 'bg-gray-400'}`}></div>
                            <span className="text-sm text-gray-900 ">
                                {isWithinSupportHours ? 'Đang hoạt động' : 'Ngoài giờ hỗ trợ'}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white  rounded-lg p-3">
                        <h3 className="text-sm font-medium text-gray-900  mb-1">Thông tin hỗ trợ</h3>
                        <p className="text-xs text-gray-500 ">Email: support@example.com</p>
                        <p className="text-xs text-gray-500 ">Hotline: 1900 xxxx</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="h-16 border-b border-gray-200 px-6 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 text-primary">
                            <AvatarImage src="/avatars/support.png" />
                            <AvatarFallback>HT</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-sm text-left font-medium text-gray-900 ">Hỗ trợ viên</h3>
                            <div className="flex items-center gap-2">
                                <p className={`text-xs ${isWithinSupportHours ? 'text-[#26A65B]' : 'text-gray-400'}`}>
                                    {isWithinSupportHours ? 'Đang hoạt động' : 'Ngoài giờ hỗ trợ'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white ]">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex items-start gap-3 ${message.userId === userId ? 'flex-row-reverse' : ''
                                }`}
                        >
                            <Avatar className="h-8 w-8 shrink-0 text-primary">
                                <AvatarImage src={message.avatar} />
                                <AvatarFallback>{message.userName?.[0] || "U"}</AvatarFallback>
                            </Avatar>

                            <div className={`flex flex-col ${message.userId === userId ? 'items-end' : ''
                                }`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-gray-900 ">
                                        {message.userName}
                                    </span>
                                    <span className="text-xs text-gray-500 ">
                                        {message.timestamp}
                                    </span>
                                </div>

                                <div className={`rounded-lg px-4 py-2 max-w-[80%] ${message.userId === userId
                                        ? 'bg-[#26A65B] text-white'
                                        : 'bg-white  text-gray-900 '
                                    }`}>
                                    {message.type === 'image' ? (
                                        <div
                                            className="relative group cursor-pointer"
                                            onClick={() => handleViewImage(message.imageUrl)}
                                        >
                                            <img
                                                src={message.imageUrl}
                                                alt="Shared"
                                                className="max-w-full max-h-[300px] rounded-lg object-contain"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                                                <span className="text-white opacity-0 group-hover:opacity-100 transition-all duration-200 text-sm font-medium">
                                                    Xem ảnh đầy đủ
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-left">{message.content}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex items-center gap-2 text-gray-500 ">
                            <div className="animate-bounce">●</div>
                            <div className="animate-bounce delay-100">●</div>
                            <div className="animate-bounce delay-200">●</div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Selected Image Preview */}
                {imagePreview && (
                    <div className="px-4 pt-2 bg-gray-50 ">
                        <div className="bg-white rounded-lg p-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="relative w-14 h-14 overflow-hidden rounded-md">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-sm text-gray-900 ">Ảnh đã chọn</span>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 hover:bg-gray-100  rounded-full p-1"
                                onClick={removeSelectedImage}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <form
                    onSubmit={handleSendMessage}
                    className="h-20 border-t border-gray-200  p-4 flex items-center gap-4 bg-white "
                >
                    <div className="flex-1 flex items-center gap-2">
                        <Input
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 bg-gray-100  border-gray-200  text-gray-900  placeholder:text-gray-500 "
                            disabled={isSending}
                        />
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*"
                            className="hidden"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-gray-500  hover:text-gray-700  hover:bg-gray-100 "
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isSending}
                        >
                            <ImageIcon className="h-5 w-5" />
                        </Button>
                    </div>

                    <Button
                        type="submit"
                        className="bg-[#26A65B] hover:bg-[#219150] text-white px-6 min-w-[100px]"
                        disabled={isSending || (!newMessage.trim() && !selectedImage)}
                    >
                        {isSending ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Đang gửi...</span>
                            </div>
                        ) : (
                            'Gửi'
                        )}
                    </Button>
                </form>
            </div>

            {/* Image View Dialog */}
            {viewImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
                    onClick={closeImageView}
                    tabIndex={0}
                >
                    <div
                        className="relative max-w-4xl max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={viewImage}
                            alt="Full view"
                            className="max-w-full max-h-[85vh] object-contain rounded-lg"
                        />
                        <button
                            type="button"
                            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white hover:bg-opacity-70 rounded-full p-2 transition-all"
                            onClick={closeImageView}
                            aria-label="Close image view"
                        >
                            <XCircle className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPage;