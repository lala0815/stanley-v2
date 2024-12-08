export class AgoraError extends Error {
  constructor(message: string, public code?: number) {
    super(message);
    this.name = 'AgoraError';
  }
}

export const handleAgoraError = (error: unknown) => {
  if (error instanceof Error) {
    throw new AgoraError(error.message);
  }
  throw new AgoraError('An unknown error occurred with Agora services');
};