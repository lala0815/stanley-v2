import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StreamCard } from '../components/streams/StreamCard';
import { StreamsHeader } from '../components/streams/StreamsHeader';
import { useStreamsStore } from '../stores/streamsStore';
import { ArrowLeft } from 'lucide-react';

export const Streams = () => {
  const navigate = useNavigate();
  const { streams } = useStreamsStore();

  const handleJoinStream = (channelName: string) => {
    navigate(`/stream/audience/${channelName}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Return to Home</span>
          </button>
        </div>

        <StreamsHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {streams.map((stream) => (
            <StreamCard
              key={stream.id}
              stream={stream}
              onJoin={() => handleJoinStream(stream.channelName)}
            />
          ))}
        </div>

        {streams.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No active streams at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};