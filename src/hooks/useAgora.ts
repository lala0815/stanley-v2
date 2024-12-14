import { useState, useEffect } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import AgoraRTM, { RtmClient } from "agora-rtm-sdk";
import { agoraConfig } from "../config/agora";
import { AgoraError, handleAgoraError } from "../utils/errors";

export const useAgoraRTC = () => {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localAudioTrack, setLocalAudioTrack] =
    useState<IMicrophoneAudioTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] =
    useState<ICameraVideoTrack | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const rtcClient = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
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
      throw new AgoraError("RTC Client not initialized");
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
        AgoraRTC.createCameraVideoTrack(),
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

import { RtmChannel, RtmMessage } from "agora-rtm-sdk";

export const useAgoraRTM = () => {
  const [client, setClient] = useState<RtmClient | null>(null);
  const [channel, setChannel] = useState<RtmChannel | null>(null);
  const [isChannelReady, setIsChannelReady] = useState(false);
  const [joinedChannelName, setJoinedChannelName] = useState<string | null>(
    null
  );
  const [hasListener, setHasListener] = useState(false); // Track listener registration

  useEffect(() => {
    const initializeRTM = async () => {
      try {
        const rtmClient = AgoraRTM.createInstance(agoraConfig.appId);
        setClient(rtmClient);

        // Log in to Agora RTM
        await rtmClient.login({ uid: String(Date.now()) });
        console.log("RTM client logged in.");
      } catch (err) {
        console.error("Failed to initialize RTM client:", err);
      }
    };

    initializeRTM();

    return () => {
      client?.logout().catch(console.error);
      channel?.leave().catch(console.error);
    };
  }, []);

  const joinChannel = async (channelName: string) => {
    if (!client) {
      console.error("RTM Client is not initialized.");
      return;
    }
    if (!channelName) {
      console.error("Invalid channel name provided for RTM.");
      return;
    }
    if (joinedChannelName === channelName) {
      console.log(`Already joined RTM channel: ${channelName}`);
      return;
    }

    try {
      const rtmChannel = client.createChannel(channelName);
      await rtmChannel.join();
      setChannel(rtmChannel);
      setJoinedChannelName(channelName);
      setIsChannelReady(true);
      setHasListener(false); // Reset listener flag for the new channel
      console.log(`Successfully joined RTM channel: ${channelName}`);
    } catch (err) {
      console.error("Failed to join RTM channel:", err);
      setIsChannelReady(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!channel) {
      throw new Error("RTM Channel not joined");
    }

    try {
      await channel.sendMessage({ text: message });
      console.log("Message sent:", message);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const registerMessageListener = (
    callback: (message: string, senderId: string) => void
  ) => {
    if (!channel) {
      console.error("RTM Channel is not joined. Cannot register listener.");
      return;
    }

    if (hasListener) {
      console.log("Listener already registered. Skipping...");
      return;
    }

    const listener = (message: RtmMessage, senderId: string) => {
      if (message.messageType === "TEXT") {
        callback(message.text as string, senderId);
      } else {
        console.warn("Non-text message received:", message);
      }
    };

    // Register the listener
    channel.on("ChannelMessage", listener);
    setHasListener(true);
    console.log("Message listener registered for channel.");
  };

  return {
    client,
    channel,
    isChannelReady,
    joinChannel,
    sendMessage,
    registerMessageListener,
  };
};
