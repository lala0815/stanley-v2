import { useState, useEffect } from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';
import AgoraRTM, { RtmClient } from 'agora-rtm-sdk';
import { agoraConfig } from '../config/agora';
import { AgoraError, handleAgoraError } from '../utils/errors';

export const useAgoraRTC = () => {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const rtcClient = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
      setClient(rtcClient);

      return () => {
        rtcClient.leave().catch(console.error);
      };
    } catch (err) {
      handleAgoraError(err);
    }
  }, []);

  const join = async (channelName: string) => {
    if (!client) {
      throw new AgoraError('RTC Client not initialized');
    }

    try {
      await client.join(
        agoraConfig.appId,
        channelName,
        agoraConfig.token || null,
        null
      );
      
      const [audioTrack, videoTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack()
      ]);

      await client.publish([audioTrack, videoTrack]);
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);
    } catch (err) {
      handleAgoraError(err);
    }
  };

  const leave = async () => {
    try {
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
      }
      await client?.leave();
    } catch (err) {
      handleAgoraError(err);
    }
  };

  return {
    client,
    localAudioTrack,
    localVideoTrack,
    error,
    join,
    leave,
  };
};

export const useAgoraRTM = () => {
  const [client, setClient] = useState<RtmClient | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const rtmClient = AgoraRTM.createInstance(agoraConfig.appId);
      setClient(rtmClient);

      return () => {
        rtmClient.logout().catch(console.error);
      };
    } catch (err) {
      handleAgoraError(err);
    }
  }, []);

  const sendMessage = async (message: string) => {
    if (!client) {
      throw new AgoraError('RTM Client not initialized');
    }
    try {
      await client.sendMessageToPeer({ text: message }, 'channel');
    } catch (err) {
      handleAgoraError(err);
    }
  };

  const receiveMessage = (callback: (message: string) => void) => {
    if (!client) {
      throw new AgoraError('RTM Client not initialized');
    }
    client.on('MessageFromPeer', ({ text }, peerId) => {
      callback(text);
    });
  };

  return {
    client,
    error,
    sendMessage,
    receiveMessage,
  };
};