import React from 'react';
import YouTube from 'react-youtube';
import { SearchResult } from '../types';
import { X } from 'lucide-react';

interface VideoPlayerProps {
  video: SearchResult | null;
  onClose: () => void;
}

export default function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  if (!video) return null;

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      start: video.startTime,
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-5xl bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full max-h-[80vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className="bg-indigo-600 text-white text-xs font-mono px-2 py-1 rounded-md font-medium tracking-wide">
              {Math.floor(video.startTime / 60)}:{Math.floor(video.startTime % 60).toString().padStart(2, '0')}
            </span>
            <h3 className="text-gray-200 font-medium truncate max-w-md">
              正在播放: {video.videoId}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Container */}
        <div className="flex-1 relative bg-black w-full h-full min-h-0">
          <YouTube 
            videoId={video.videoId} 
            opts={opts} 
            className="absolute inset-0 w-full h-full"
            iframeClassName="w-full h-full border-0"
          />
        </div>

        {/* Subtitle Context */}
        <div className="p-6 bg-gray-900 border-t border-gray-800">
          <p className="text-gray-300 text-lg leading-relaxed font-serif italic border-l-4 border-indigo-500 pl-4">
            "{video.text}"
          </p>
        </div>
      </div>
    </div>
  );
}
