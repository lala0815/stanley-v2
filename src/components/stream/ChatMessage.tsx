import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatMessageProps {
  messages: { sender: string; content: string }[];
  onSendMessage: (message: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ messages, onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-3">
            <p className="text-purple-400 text-sm font-medium">{msg.sender}</p>
            <p className="text-gray-200">{msg.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white placeholder-gray-400"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};