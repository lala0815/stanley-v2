import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import { agoraConfig } from '../../../config/agora';
import { StreamControls } from '../StreamControls';
import { VideoPlayer } from '../VideoPlayer';
import { ChatMessage } from '../ChatMessage';
import { ViewersList } from '../ViewersList';

export const HostStream: React.FC = () => {
  const navigate = useNavigate();
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localTracks, setLocalTracks] = useState<{
    videoTrack: any;
    audioTrack: any;
  } | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [viewers] = useState<string[]>(['Viewer1', 'Viewer2']);

  useEffect(() => {
    const init = async () => {
      const rtcClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      setClient(rtcClient);

      try {
        await rtcClient.join(agoraConfig.appId, 'host-channel', agoraConfig.token, agoraConfig.uid);
        
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        
        setLocalTracks({ audioTrack, videoTrack });
        await rtcClient.publish([audioTrack, videoTrack]);

        if (videoRef.current) {
          videoTrack.play(videoRef.current);
        }
      } catch (error) {
        console.error('Failed to initialize stream:', error);
      }
    };

    init();

    return () => {
      if (localTracks) {
        localTracks.audioTrack?.close();
        localTracks.videoTrack?.close();
      }
      client?.leave();
    };
  }, []);

  const toggleAudio = () => {
    if (localTracks?.audioTrack) {
      localTracks.audioTrack.setEnabled(!isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (localTracks?.videoTrack) {
      localTracks.videoTrack.setEnabled(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const handleEndStream = async () => {
    if (localTracks) {
      localTracks.audioTrack?.close();
      localTracks.videoTrack?.close();
    }
    await client?.leave();
    navigate('/');
  };

  const handleSendMessage = (message: string) => {
    setMessages(prev => [...prev, { sender: 'Host', content: message }]);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <div className="flex-1 p-4">
        <div className="relative h-full">
          <VideoPlayer ref={videoRef} />
          <StreamControls 
            onEndStream={handleEndStream}
            onToggleAudio={toggleAudio}
            onToggleVideo={toggleVideo}
            isAudioEnabled={isAudioEnabled}
            isVideoEnabled={isVideoEnabled}
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
  );
};