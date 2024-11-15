"use client";
import { useEffect, useState, useRef } from "react";
import { ref, push, onChildAdded, off, get, set } from "firebase/database";
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
  admin: string; // admin flag ("true" or "false")
};

const ChatComponent: React.FC<ChatComponentProps> = ({ userId, orderId, admin }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>(""); 
  const [adminName, setAdminName] = useState<string>("Admin");
  const [clientName, setClientName] = useState<string>("Client");
  const [displayName, setDisplayName] = useState<string>(""); // Track the display name
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Error state
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListenerRef = useRef<((snapshot: any) => void) | null>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Fetch chat names and ensure chat data exists
  useEffect(() => {
    const fetchNames = async () => {
      try {
        const chatRef = ref(database, `/chats/${orderId}/chatData`);
        const snapshot = await get(chatRef);

        if (snapshot.exists()) {
          const chatData = snapshot.val();
          setAdminName(chatData.admin);
          setClientName(chatData.client);
        } else {
          // Ensure chat data is set at least once
          const chatDataRef = ref(database, `/chats/${orderId}/chatData`);
          await set(chatDataRef, {
            admin: admin === "true" ? userId : adminName,
            client: admin === "false" ? userId : clientName,
          });
        }
      } catch (error) {
        setError("Failed to fetch names.");
      }
    };

    fetchNames();
  }, [orderId, admin, userId, adminName, clientName]);

  // Set display name based on role
  useEffect(() => {
    if (admin === "true") {
      setDisplayName(clientName);
    } else if (admin === "false") {
      setDisplayName(adminName);
    }
  }, [admin, clientName, adminName]);

  // Listen for new chat messages
  useEffect(() => {
    const messagesRef = ref(database, `/chats/${orderId}/messageData`);

    const handleNewMessage = (snapshot: any) => {
      const message: ChatMessage = snapshot.val();
      setMessages((prevMessages) => [...prevMessages, { ...message, id: snapshot.key }]);
    };

    if (messageListenerRef.current) {
      off(messagesRef, "child_added", messageListenerRef.current);
    }

    messageListenerRef.current = handleNewMessage;
    onChildAdded(messagesRef, handleNewMessage);

    return () => {
      off(messagesRef, "child_added", handleNewMessage);
    };
  }, [orderId]);

  // Scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current && chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Send a new message
  const sendMessage = async () => {
    if (newMessage.trim()) {
      setLoading(true);
      setError(null); // Clear any previous errors
      try {
        // Push the message to the Firebase 'messageData' node
        const messageRef = ref(database, `/chats/${orderId}/messageData`);
        await push(messageRef, {
          sender: userId,
          message: newMessage,
          timestamp: new Date().toISOString(),
        });

        setNewMessage(""); // Clear the input field after sending
      } catch (error) {
        setError("Failed to send message. Please try again."); // Set error message
      } finally {
        setLoading(false);
      }
    } else {
      setError("Message cannot be empty."); // Error for empty message
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
