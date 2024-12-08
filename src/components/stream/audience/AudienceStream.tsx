import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import { agoraConfig } from '../../../config/agora';
import { VideoPlayer } from '../VideoPlayer';
import { ChatMessage } from '../ChatMessage';
import { ViewersList } from '../ViewersList';
import { StreamControls } from '../StreamControls';
import { ArrowLeft } from 'lucide-react';

export const AudienceStream: React.FC = () => {
  const { channelName } = useParams<{ channelName: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [viewers] = useState<string[]>(['Viewer1', 'Viewer2']);
  const [remoteUser, setRemoteUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const rtcClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      setClient(rtcClient);

      try {
        await rtcClient.join(agoraConfig.appId, channelName || 'host-channel', agoraConfig.token, agoraConfig.uid);
        
        rtcClient.on('user-published', async (user, mediaType) => {
          await rtcClient.subscribe(user, mediaType);
          setRemoteUser(user);
          
          if (mediaType === 'video' && videoRef.current) {
            user.videoTrack?.play(videoRef.current);
          }
          if (mediaType === 'audio') {
            user.audioTrack?.play();
          }
        });

        rtcClient.on('user-unpublished', async (user) => {
          if (user.uid === remoteUser?.uid) {
            setRemoteUser(null);
          }
        });
      } catch (error) {
        console.error('Failed to join stream:', error);
        navigate('/streams');
      }
    };

    init();

    return () => {
      if (remoteUser) {
        client?.unsubscribe(remoteUser);
      }
      client?.leave();
    };
  }, [channelName, navigate]);

  const handleLeaveStream = async () => {
    if (remoteUser) {
      await client?.unsubscribe(remoteUser);
    }
    await client?.leave();
    navigate('/streams');
  };

  const handleSendMessage = (message: string) => {
    setMessages(prev => [...prev, { sender: 'Viewer', content: message }]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="p-4">
        <button
          onClick={handleLeaveStream}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Return to Streams</span>
        </button>
      </div>
      <div className="flex flex-1">
        <div className="flex-1 p-4">
          <div className="relative h-full">
            <VideoPlayer ref={videoRef} />
            <StreamControls 
              onEndStream={handleLeaveStream}
              showMediaControls={false}
            />
          </div>
        </div>
        <div className="w-80 bg-gray-800 p-4 flex flex-col">
          <ViewersList viewers={viewers} />
          <div className="flex-1">
            <ChatMessage messages={messages} onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};