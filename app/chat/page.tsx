"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const MOCK_CHATS = [
  {
    id: 1,
    userId: "emp123",
    userName: "Rahul Sharma",
    userDepartment: "Engineering",
    itemTitle: "iPhone 13 Pro",
    lastMessage: "Is it still available?",
    timestamp: "2 min ago",
    unread: 2,
    avatar: "R"
  },
  {
    id: 2,
    userId: "emp456",
    userName: "Priya Patel",
    userDepartment: "HR",
    itemTitle: "Office Chair",
    lastMessage: "Can we meet tomorrow?",
    timestamp: "1 hour ago",
    unread: 0,
    avatar: "P"
  },
  {
    id: 3,
    userId: "emp789",
    userName: "Amit Kumar",
    userDepartment: "Sales",
    itemTitle: "Honda City 2019",
    lastMessage: "Thanks for the info!",
    timestamp: "Yesterday",
    unread: 0,
    avatar: "A"
  }
];

const MOCK_MESSAGES = [
  {
    id: 1,
    senderId: "emp123",
    senderName: "Rahul Sharma",
    message: "Hi! Is the iPhone 13 Pro still available?",
    timestamp: "10:30 AM",
    isOwn: false
  },
  {
    id: 2,
    senderId: "me",
    senderName: "You",
    message: "Yes, it's available. Would you like to check it out?",
    timestamp: "10:32 AM",
    isOwn: true
  },
  {
    id: 3,
    senderId: "emp123",
    senderName: "Rahul Sharma",
    message: "Great! Can we meet at the Mumbai office tomorrow?",
    timestamp: "10:35 AM",
    isOwn: false
  },
  {
    id: 4,
    senderId: "me",
    senderName: "You",
    message: "Sure! Let's meet at the cafeteria around 2 PM.",
    timestamp: "10:36 AM",
    isOwn: true
  },
  {
    id: 5,
    senderId: "emp123",
    senderName: "Rahul Sharma",
    message: "Perfect! See you then.",
    timestamp: "10:37 AM",
    isOwn: false
  }
];

function ChatContent() {
  const searchParams = useSearchParams();
  const [selectedChat, setSelectedChat] = useState<number | null>(
    searchParams.get("user") ? 1 : null
  );
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      senderId: "me",
      senderName: "You",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      isOwn: true
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const currentChat = MOCK_CHATS.find((chat) => chat.id === selectedChat);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/home" className="p-2 hover:bg-gray-100 rounded-full transition-colors lg:hidden">
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Messages</h1>
              <p className="text-xs text-gray-500">Internal chat only</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat List */}
        <div className={`w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col ${selectedChat ? "hidden lg:flex" : "flex"}`}>
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {MOCK_CHATS.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  selectedChat === chat.id ? "bg-purple-50" : ""
                }`}
              >
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {chat.avatar}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-gray-900 truncate">{chat.userName}</p>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{chat.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{chat.userDepartment} • {chat.itemTitle}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate flex-1">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <span className="ml-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        {selectedChat ? (
          <div className={`flex-1 flex flex-col ${selectedChat ? "flex" : "hidden lg:flex"}`}>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold">
                  {currentChat?.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{currentChat?.userName}</p>
                  <p className="text-xs text-gray-600">{currentChat?.userDepartment}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowReportModal(true)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Report user"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {/* Item Reference */}
              <div className="flex justify-center">
                <div className="bg-white rounded-lg shadow-sm p-3 max-w-xs text-center">
                  <p className="text-xs text-gray-500 mb-1">Chatting about</p>
                  <p className="text-sm font-semibold text-purple-600">{currentChat?.itemTitle}</p>
                </div>
              </div>

              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs lg:max-w-md ${msg.isOwn ? "order-2" : "order-1"}`}>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        msg.isOwn
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          : "bg-white shadow-sm text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${msg.isOwn ? "text-right" : "text-left"}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="h-12 w-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                🔒 Secure internal chat • No external links allowed
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 hidden lg:flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Select a chat</h3>
              <p className="text-gray-500">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Report User</h3>
            <div className="space-y-3 mb-6">
              {["Spam", "Harassment", "Inappropriate Content", "Other"].map((reason) => (
                <button
                  key={reason}
                  onClick={() => {
                    alert(`User reported for: ${reason}`);
                    setShowReportModal(false);
                  }}
                  className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowReportModal(false)}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
