import React, { useEffect, useRef } from 'react';
import { useAgoraRTC, useAgoraRTM } from '../../hooks/useAgora';
import { ChatMessage } from './ChatMessage';
import { ViewersList } from './ViewersList';
import { StreamControls } from './StreamControls';
import { VideoPlayer } from './VideoPlayer';

interface StreamerDashboardProps {
  channelName: string;
}

export const StreamerDashboard: React.FC<StreamerDashboardProps> = ({ channelName }) => {
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [viewers, setViewers] = useState<string[]>([]);
  const { localAudioTrack, localVideoTrack, join, leave } = useAgoraRTC();
  const { sendMessage, receiveMessage } = useAgoraRTM();
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startStream = async () => {
      try {
        await join(channelName);
        if (videoRef.current && localVideoTrack) {
          localVideoTrack.play(videoRef.current);
        }
      } catch (error) {
        console.error('Failed to start stream:', error);
      }
    };

    startStream();
    return () => {
      leave();
    };
  }, [channelName, join, leave, localVideoTrack]);

  const handleEndStream = async () => {
    try {
      await leave();
    } catch (error) {
      console.error('Failed to end stream:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <div className="flex-1 p-4">
        <div className="relative h-full">
          <VideoPlayer ref={videoRef} />
          <StreamControls onEndStream={handleEndStream} />
        </div>
      </div>
      <div className="w-80 bg-gray-800 p-4 flex flex-col">
        <ViewersList viewers={viewers} />
        <div className="flex-1">
          <ChatMessage messages={messages} onSendMessage={sendMessage} />
        </div>
      </div>
    </div>
  );
};