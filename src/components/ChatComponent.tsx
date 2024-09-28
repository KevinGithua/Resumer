import { useEffect, useState, useRef } from "react";
import { ref, push, onChildAdded, off } from "firebase/database";
import { db as database } from "@/lib/firebase";

type ChatMessage = {
  sender: string;
  message: string;
  timestamp: string;
  id?: string;
};

type ChatComponentProps = {
  userId: string;
  orderId: string;
  onMessageReceived: (count: number) => void;
};

const ChatComponent: React.FC<ChatComponentProps> = ({ userId, orderId, onMessageReceived }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);  // Error state
  const [otherParty, setOtherParty] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListenerRef = useRef<((snapshot: any) => void) | null>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesRef = ref(database, `/chats/${orderId}`);

    const handleNewMessage = (snapshot: any) => {
      const message: ChatMessage = snapshot.val();
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, { ...message, id: snapshot.key }];

        // Detect the other party (someone who's not the current user)
        if (message.sender !== userId && !otherParty) {
          setOtherParty(message.sender);
        }

        onMessageReceived(updatedMessages.length);
        return updatedMessages;
      });
    };

    if (messageListenerRef.current) {
      off(messagesRef, "child_added", messageListenerRef.current);
    }

    messageListenerRef.current = handleNewMessage;
    onChildAdded(messagesRef, handleNewMessage);

    return () => {
      off(messagesRef, "child_added", handleNewMessage);
    };
  }, [orderId, userId, onMessageReceived, otherParty]);

  useEffect(() => {
    if (messagesEndRef.current && chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      setLoading(true);
      setError(null);  // Clear any previous errors
      try {
        const messageRef = ref(database, `/chats/${orderId}`);
        await push(messageRef, {
          sender: userId,
          message: newMessage,
          timestamp: new Date().toISOString(),
        });
        setNewMessage("");
      } catch (error) {
        setError("Failed to send message. Please try again.");  // Set error message
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="chat-box px-2 py-4 bg-white rounded-lg shadow-lg h-full flex flex-col">
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-600 p-2 rounded-lg mb-2">
          {error}
        </div>
      )}

      {/* Top bar showing the other party's identity */}
      <div className="bg-cyan-600 text-white p-3 rounded-t-lg shadow-md mb-2 flex items-center">
        <span className="text-lg font-semibold">{otherParty ? otherParty : "Loading..."}</span>
      </div>

      {/* Chat messages */}
      <div
        ref={chatBoxRef}
        className="messages flex-1 overflow-y-auto p-2 space-y-4 bg-white rounded-lg shadow-inner"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message p-2 flex ${msg.sender === userId ? "justify-end" : "justify-start"}`}
          >
            <div className={`relative max-w-xs ${msg.sender === userId ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"} p-3 rounded-lg shadow-md`}>
              <p>{msg.message}</p>
              <span className="text-xs text-gray-500 absolute bottom-1 right-2">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="flex mt-4 space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 bg-white"
        />
        <button
          onClick={sendMessage}
          className={`p-2 bg-cyan-600 text-white rounded-r-lg hover:bg-cyan-700 ${loading ? "cursor-wait" : ""}`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
