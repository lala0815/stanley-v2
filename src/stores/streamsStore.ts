import { create } from 'zustand';

interface Stream {
  id: string;
  title: string;
  hostName: string;
  thumbnailUrl: string;
  viewerCount: number;
  channelName: string;
}

interface StreamsState {
  streams: Stream[];
  addStream: (stream: Stream) => void;
  removeStream: (id: string) => void;
  updateViewerCount: (id: string, count: number) => void;
}

export const useStreamsStore = create<StreamsState>((set) => ({
  streams: [
    {
      id: '1',
      title: 'Welcome to My First Stream!',
      hostName: 'JohnDoe',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618609378039-b572f64c5b42?w=800&auto=format&fit=crop&q=60',
      viewerCount: 42,
      channelName: 'host-channel',
    },
    {
      id: '2',
      title: 'Live Coding Session',
      hostName: 'TechGuru',
      thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=60',
      viewerCount: 156,
      channelName: 'coding-channel',
    },
  ],
  addStream: (stream) =>
    set((state) => ({ streams: [...state.streams, stream] })),
  removeStream: (id) =>
    set((state) => ({ streams: state.streams.filter((s) => s.id !== id) })),
  updateViewerCount: (id, count) =>
    set((state) => ({
      streams: state.streams.map((s) =>
        s.id === id ? { ...s, viewerCount: count } : s
      ),
    })),
}));