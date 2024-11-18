"use client";
import { useEffect, useState, useRef } from "react";
import { ref, push, onChildAdded, off, onValue, get, update } from "firebase/database";
import { db as database } from "@/lib/firebase";
import { AiOutlineSend } from "react-icons/ai";
import { FaExclamationTriangle } from "react-icons/fa";

type ChatMessage = {
  sender: string;
  message: string;
  timestamp: string;
  id?: string;
};

type ChatComponentProps = {
  userId: string; // Current user ID
  orderId: string;
  isAdmin: boolean; // Admin flag
};

const ChatComponent: React.FC<ChatComponentProps> = ({ userId, orderId, isAdmin }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [adminName, setAdminName] = useState<string>("Admin");
  const [clientName, setClientName] = useState<string>("Client");
  const [displayName, setDisplayName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Real-time listener for names
  useEffect(() => {
    const chatRef = ref(database, `/chats/${orderId}/chatData`);

    const handleChatDataChange = (snapshot: any) => {
      if (snapshot.exists()) {
        const chatData = snapshot.val();
        setAdminName(chatData.admin || "Admin");
        setClientName(chatData.client || "Client");
      }
    };

    onValue(chatRef, handleChatDataChange);

    return () => {
      off(chatRef, "value", handleChatDataChange);
    };
  }, [orderId]);

  // Update the database if admin or client fields are empty
  useEffect(() => {
    const chatRef = ref(database, `/chats/${orderId}/chatData`);

    const updateChatData = async () => {
      try {
        const snapshot = await get(chatRef);
        if (snapshot.exists()) {
          const chatData = snapshot.val();
          if (isAdmin && !chatData.admin) {
            await update(chatRef, { admin: userId });
          } else if (!isAdmin && !chatData.client) {
            await update(chatRef, { client: userId });
          }
        } else {
          await update(chatRef, {
            admin: isAdmin ? userId : null,
            client: !isAdmin ? userId : null,
          });
        }
      } catch (error) {
        setError("Failed to update chat data.");
      }
    };

    updateChatData();
  }, [orderId, isAdmin, userId]);

  // Update display name dynamically
  useEffect(() => {
    if (isAdmin) {
      setDisplayName(clientName);
    } else {
      setDisplayName(adminName);
    }
  }, [isAdmin, adminName, clientName]);

  // Listen for chat messages
  useEffect(() => {
    const messagesRef = ref(database, `/chats/${orderId}/messageData`);

    const handleNewMessage = (snapshot: any) => {
      const message: ChatMessage = snapshot.val();
      setMessages((prevMessages) => [...prevMessages, { ...message, id: snapshot.key }]);
    };

    onChildAdded(messagesRef, handleNewMessage);

    return () => {
      off(messagesRef, "child_added", handleNewMessage);
    };
  }, [orderId]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current && chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      setLoading(true);
      setError(null);
      try {
        const messageRef = ref(database, `/chats/${orderId}/messageData`);
        await push(messageRef, {
          sender: userId,
          message: newMessage,
          timestamp: new Date().toISOString(),
        });

        setNewMessage("");
      } catch (error) {
        setError("Failed to send message. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Message cannot be empty.");
    }
  };

  return (
    <div className="chat-box px-4 py-6 bg-gradient-to-b from-teal-50 to-teal-100 rounded-lg h-full flex flex-col">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-3 flex items-center">
          <FaExclamationTriangle className="text-xl mr-2" />
          {error}
        </div>
      )}

      {/* Top bar showing the other party's identity */}
      <div className="bg-teal-400 text-white p-4 rounded-t-lg shadow-md mb-4 flex items-center justify-between">
        <span className="text-sm text-teal-200">{displayName}</span>
      </div>

      {/* Chat messages */}
      <div
        ref={chatBoxRef}
        className="messages flex-1 overflow-y-auto p-3 space-y-5 rounded-lg shadow-inner transition-all duration-300 ease-in-out"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message p-3 flex ${msg.sender === userId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`relative max-w-xs ${
                msg.sender === userId ? "bg-teal-100 text-teal-800" : "bg-blue-100 text-blue-800"
              } p-4 rounded-lg shadow-md`}
            >
              <p>{msg.message}</p>
              <span className="text-xs text-gray-500 absolute bottom-2 right-3">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="flex mt-5 space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 bg-teal-100 text-sm"
        />
        <button
          onClick={sendMessage}
          className={`p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-cyan-300 ${
            loading ? "cursor-wait opacity-50" : ""
          }`}
          disabled={loading}
        >
          <AiOutlineSend className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
