import React from 'react';
import { Video } from 'lucide-react';

export const StreamsHeader: React.FC = () => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-4">
        <Video className="h-12 w-12 text-purple-500" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">Live Streams</h1>
      <p className="text-gray-400 max-w-2xl mx-auto">
        Join live streams from our community of creators. Experience real-time interaction
        and engage with other viewers through chat.
      </p>
    </div>
  );
};