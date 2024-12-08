import React from 'react';
import { Mic, MicOff, Video, VideoOff, X } from 'lucide-react';

interface StreamControlsProps {
  onEndStream: () => void;
  onToggleAudio?: () => void;
  onToggleVideo?: () => void;
  isAudioEnabled?: boolean;
  isVideoEnabled?: boolean;
  showMediaControls?: boolean;
}

export const StreamControls: React.FC<StreamControlsProps> = ({
  onEndStream,
  onToggleAudio,
  onToggleVideo,
  isAudioEnabled = true,
  isVideoEnabled = true,
  showMediaControls = true,
}) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-gray-800/80 rounded-lg p-4">
      {showMediaControls && (
        <>
          <button 
            onClick={onToggleAudio}
            className={`p-3 rounded-full ${isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'} text-white transition-colors`}
          >
            {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>
          <button 
            onClick={onToggleVideo}
            className={`p-3 rounded-full ${isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'} text-white transition-colors`}
          >
            {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>
        </>
      )}
      <button
        onClick={onEndStream}
        className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};