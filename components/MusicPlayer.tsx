'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  url: string;
  artwork: string;
}

interface MusicPlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onTrackEnd: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  isShuffled: boolean;
  onToggleShuffle: () => void;
  repeatMode: 'none' | 'all' | 'one';
  onToggleRepeat: () => void;
}

const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'data:';
  } catch {
    return false;
  }
};

export default function MusicPlayer({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onTrackEnd,
  volume,
  onVolumeChange,
  isShuffled,
  onToggleShuffle,
  repeatMode,
  onToggleRepeat,
}: MusicPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      onTrackEnd();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isDragging, onTrackEnd]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    const audio = audioRef.current;
    if (audio && currentTrack.duration) {
      const newTime = (percentage / 100) * currentTrack.duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setDragProgress(percentage);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragProgress((currentTime / currentTrack.duration) * 100);
  };

  const handleMouseUp = () => {
    if (isDragging && currentTrack.duration) {
      const audio = audioRef.current;
      if (audio) {
        const newTime = (dragProgress / 100) * currentTrack.duration;
        audio.currentTime = newTime;
        setCurrentTime(newTime);
      }
    }
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = handleMouseUp;
    const handleGlobalMouseMove = handleProgressDrag;

    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mousemove', handleGlobalMouseMove);
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, dragProgress, currentTime, currentTrack.duration]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = isDragging ? dragProgress : (currentTime / currentTrack.duration) * 100;

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'all':
        return <Repeat size={20} className="text-red-600" />;
      case 'one':
        return <div className="relative"><Repeat size={20} className="text-red-600" /><span className="absolute -top-1 -right-1 text-xs text-red-600">1</span></div>;
      default:
        return <Repeat size={20} className="text-gray-400" />;
    }
  };

  return (
    <>
      <audio ref={audioRef} src={isValidUrl(currentTrack.url) ? currentTrack.url : ''} />

      <div className="p-4 border-t" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-3">
            <div
              className="progress-bar cursor-pointer group"
              onClick={handleProgressClick}
              onMouseDown={handleMouseDown}
              role="progressbar"
              aria-valuenow={Math.round(progressPercentage)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Music progress"
              tabIndex={0}
            >
              <div
                className="progress-fill relative group-hover:opacity-90 transition-opacity"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 transition-all" style={{ backgroundColor: 'var(--primary)' }} />
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Track Info */}
              <div className="flex items-center space-x-3 min-w-0 max-w-xs">
                <div className="w-12 h-12 bg-gray-800 rounded flex-shrink-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <Play size={12} className="text-white ml-0.5" />
                  </div>
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-white truncate">{currentTrack.title}</h4>
                  <p className="text-sm text-gray-400 truncate">{currentTrack.artist}</p>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={onToggleShuffle}
                  className={`p-2 rounded-full transition-colors ${isShuffled ? 'text-red-600' : 'text-gray-400 hover:text-white'}`}
                >
                  <Shuffle size={18} />
                </button>

                <button
                  onClick={onPrevious}
                  className="music-btn music-btn-small"
                >
                  <SkipBack size={16} />
                </button>

                <button
                  onClick={onPlayPause}
                  className="music-btn bg-red-600 hover:bg-red-700"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                </button>

                <button
                  onClick={onNext}
                  className="music-btn music-btn-small"
                >
                  <SkipForward size={16} />
                </button>

                <button
                  onClick={onToggleRepeat}
                  className="p-2 rounded-full transition-colors hover:text-white"
                >
                  {getRepeatIcon()}
                </button>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <div className="w-24">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => onVolumeChange(Number(e.target.value))}
                  className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${volume}%, #4b5563 ${volume}%, #4b5563 100%)`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}