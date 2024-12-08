import React from 'react';
import { Users, Video } from 'lucide-react';

interface StreamCardProps {
  stream: {
    id: string;
    title: string;
    hostName: string;
    thumbnailUrl: string;
    viewerCount: number;
    channelName: string;
  };
  onJoin: () => void;
}

export const StreamCard: React.FC<StreamCardProps> = ({ stream, onJoin }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative aspect-video">
        {stream.thumbnailUrl ? (
          <img
            src={stream.thumbnailUrl}
            alt={stream.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <Video className="h-12 w-12 text-gray-500" />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-red-600 text-white text-sm px-2 py-1 rounded-full flex items-center space-x-1">
          <Users className="h-4 w-4" />
          <span>{stream.viewerCount}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1 truncate">
          {stream.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Hosted by {stream.hostName}
        </p>
        <button
          onClick={onJoin}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Join Stream
        </button>
      </div>
    </div>
  );
};