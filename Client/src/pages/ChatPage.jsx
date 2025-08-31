import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

const ChatPage = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const navigate = useNavigate();
  const { receiverId } = useParams();

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]); // {senderId, message}
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      // navigate("/");
    } else {
      // ✅ Connect to socket with userId
      const newSocket = io(`https://ecommercebackend-8w7r.onrender.com`, {
        query: { userId: userInfo._id },
      });
      setSocket(newSocket);

      // ✅ Listen for incoming messages
      newSocket.on("receiveMessage", (data) => {
        setMessages((prev) => [...prev, data]);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isLoggedIn, navigate, userInfo]);

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    const msgData = {
      senderId: userInfo._id,
      receiverId,
      message: newMessage,
    };

    // ✅ Add to own chat instantly
    setMessages((prev) => [...prev, msgData]);

    // ✅ Send to backend
    socket.emit("sendMessage", msgData);

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white p-4 font-semibold">
        Chat with {receiverId}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 p-2 rounded-md max-w-xs ${
              msg.senderId === userInfo._id
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-300 text-black mr-auto"
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex p-3 border-t bg-white">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2 mr-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
