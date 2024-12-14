import React, { useEffect, useRef, useState } from "react";
import { useAgoraRTC } from "../../hooks/useAgora";
import { ChatMessage } from "./ChatMessage";
import { ViewersList } from "./ViewersList";
import { StreamControls } from "./StreamControls";
import { VideoPlayer } from "./VideoPlayer";

interface StreamerDashboardProps {
  channelName: string; // Ensure channelName is passed
}

export const StreamerDashboard: React.FC<StreamerDashboardProps> = ({
  channelName,
}) => {
  const [isVideoEnabled, setVideoEnabled] = useState(true);
  const [isAudioEnabled, setAudioEnabled] = useState(true);

  const { localAudioTrack, localVideoTrack, join, leave, client } =
    useAgoraRTC();
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!channelName) {
      console.error("StreamerDashboard: channelName is invalid or undefined.");
      return;
    }

    const startStream = async () => {
      try {
        await join(channelName);
        if (videoRef.current && localVideoTrack) {
          localVideoTrack.play(videoRef.current);
          if (client) {
            await client.publish([localVideoTrack]); // Publish video
          }
        }
      } catch (error) {
        console.error("Failed to start stream:", error);
      }
    };

    startStream();

    return () => {
      leave();
      localVideoTrack?.stop();
      localVideoTrack?.close();
      localAudioTrack?.stop();
      localAudioTrack?.close();
    };
  }, [channelName, join, leave, localVideoTrack, localAudioTrack, client]);

  const handleToggleVideo = async () => {
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(!isVideoEnabled);
      setVideoEnabled(!isVideoEnabled);
    }
  };

  const handleToggleAudio = async () => {
    if (localAudioTrack) {
      localAudioTrack.setEnabled(!isAudioEnabled);
      setAudioEnabled(!isAudioEnabled);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <div className="flex-1 p-4">
        <div className="relative h-full">
          <VideoPlayer ref={videoRef} />
          <StreamControls
            onToggleAudio={handleToggleAudio}
            onToggleVideo={handleToggleVideo}
            isAudioEnabled={isAudioEnabled}
            isVideoEnabled={isVideoEnabled}
          />
        </div>
      </div>
      <div className="w-80 bg-gray-800 p-4 flex flex-col">
        <ViewersList viewers={[]} />
        <ChatMessage channelName={channelName} currentUser="Streamer" />
      </div>
    </div>
  );
};
