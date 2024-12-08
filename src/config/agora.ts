import { z } from 'zod';

const envSchema = z.object({
  VITE_AGORA_APP_ID: z.string().min(1, 'Agora App ID is required'),
});

export const agoraConfig = {
  appId: '7a270518f2e24906a2b0beda9bfd3b31',
  token: null, // Using null for testing - in production, implement token server
  uid: 0, // Set to 0 to let Agora assign one
} as const;

export type AgoraConfig = typeof agoraConfig;