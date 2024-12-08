import { useState, useEffect } from 'react';
import AgoraRTC, { ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import type { IAgoraRTCClient } from 'agora-rtc-sdk-ng';

export const useAgoraStream = (client: IAgoraRTCClient | null) => {
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const createLocalTracks = async () => {
    try {
      const [audioTrack, videoTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack()
      ]);

      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      if (client) {
        await client.publish([audioTrack, videoTrack]);
      }

      return { audioTrack, videoTrack };
    } catch (error) {
      console.error('Failed to create local tracks:', error);
      throw error;
    }
  };

  const toggleAudio = async () => {
    if (localAudioTrack) {
      localAudioTrack.setEnabled(!isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
      localVideoTrack.setEnabled(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const releaseLocalTracks = () => {
    localAudioTrack?.close();
    localVideoTrack?.close();
    setLocalAudioTrack(null);
    setLocalVideoTrack(null);
  };

  useEffect(() => {
    return () => {
      releaseLocalTracks();
    };
  }, []);

  return {
    localAudioTrack,
    localVideoTrack,
    isAudioEnabled,
    isVideoEnabled,
    createLocalTracks,
    releaseLocalTracks,
    toggleAudio,
    toggleVideo
  };
};