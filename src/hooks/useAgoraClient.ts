import { useState, useEffect } from 'react';
import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import { agoraConfig } from '../config/agora';

export const useAgoraClient = (role: 'host' | 'audience' = 'audience') => {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);

  useEffect(() => {
    const rtcClient = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
    setClient(rtcClient);

    return () => {
      rtcClient.leave().catch(console.error);
    };
  }, []);

  const join = async (channelName: string) => {
    if (!client) return;
    
    try {
      await client.setClientRole(role);
      await client.join(
        agoraConfig.appId,
        channelName,
        null,
        null
      );
    } catch (error) {
      console.error('Failed to join channel:', error);
      throw error;
    }
  };

  const leave = async () => {
    if (!client) return;
    try {
      await client.leave();
    } catch (error) {
      console.error('Failed to leave channel:', error);
    }
  };

  return { client, join, leave };
};