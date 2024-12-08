import React, { forwardRef } from 'react';

interface VideoPlayerProps {
  className?: string;
}

export const VideoPlayer = forwardRef<HTMLDivElement, VideoPlayerProps>(
  ({ className = '' }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full h-full bg-gray-800 rounded-lg overflow-hidden ${className}`}
        style={{ minHeight: '480px' }}
      />
    );
  }
);