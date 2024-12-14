import React, { useEffect, useState } from "react";
import { useAgoraRTM } from "../../hooks/useAgora";

interface ChatMessageProps {
  channelName: string;
  currentUser: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  channelName,
  currentUser,
}) => {
  const { joinChannel, sendMessage, registerMessageListener, isChannelReady } =
    useAgoraRTM();
  const [messages, setMessages] = useState<
    { sender: string; content: string }[]
  >([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!channelName) {
      console.error("ChatMessage: channelName is invalid or undefined.");
      return;
    }

    const initializeChat = async () => {
      try {
        await joinChannel(channelName);

        // Register the message listener once
        registerMessageListener((text, senderId) => {
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (
              lastMessage?.content === text &&
              lastMessage?.sender === senderId
            ) {
              return prev; // Prevent duplicate messages
            }
            return [...prev, { sender: senderId, content: text }];
          });
        });
      } catch (error) {
        console.error("Failed to join chat channel:", error);
      }
    };

    initializeChat();

    return () => {
      console.log("Cleaning up chat listeners.");
    };
  }, [channelName, joinChannel, registerMessageListener]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChannelReady) {
      console.error("Cannot send message: RTM Channel not joined.");
      return;
    }

    if (message.trim()) {
      try {
        await sendMessage(message);
        setMessages((prev) => [
          ...prev,
          { sender: currentUser, content: message },
        ]);
        setMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-3">
            <p className="text-purple-400 text-sm">{msg.sender}</p>
            <p className="text-gray-200">{msg.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-gray-700 text-white p-2 rounded-lg"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-purple-600 text-white p-2 rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
};
