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
  const progressBarRef = useRef<HTMLDivElement>(null);

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
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !progressBarRef.current) return;

      const rect = progressBarRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setDragProgress(percentage);
    };

    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousemove', handleGlobalMouseMove);
    }

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
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

      {/* Mobile-First Responsive Music Player */}
      <div className="p-2 md:p-4 border-t" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-2 md:mb-3">
            <div
              ref={progressBarRef}
              className={`progress-bar cursor-pointer group ${isDragging ? 'dragging' : ''}`}
              onClick={handleProgressClick}
              onMouseDown={handleMouseDown}
              role="progressbar"
              aria-valuenow={Math.round(progressPercentage)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Music progress"
              tabIndex={0}
              style={{
                willChange: isDragging ? 'width' : 'auto',
                transition: isDragging ? 'none' : 'all 100ms ease-out'
              }}
            >
              <div
                className="progress-fill relative group-hover:opacity-90 transition-opacity"
                style={{
                  width: `${progressPercentage}%`,
                  willChange: isDragging ? 'width' : 'auto'
                }}
              >
                <div
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  style={{
                    backgroundColor: 'var(--primary)',
                    backfaceVisibility: 'hidden'
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Mobile: Vertical Layout | Desktop: Horizontal Layout */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-6">
            {/* Track Info */}
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gray-800 rounded flex-shrink-0 flex items-center justify-center">
                <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <Play size={12} className="text-white ml-0.5" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium truncate text-sm md:text-base" style={{ color: 'var(--text-primary)' }}>
                  {currentTrack.title}
                </h4>
                <p className="truncate text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Control Buttons - Mobile: Centered | Desktop: Inline */}
            <div className="flex items-center justify-center gap-2 md:gap-3 lg:gap-4">
              <button
                onClick={onToggleShuffle}
                className={`touch-target p-2 rounded-full transition-all duration-150 ${isShuffled ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
                aria-label="Toggle shuffle"
                style={{ color: isShuffled ? 'var(--primary)' : undefined }}
              >
                <Shuffle size={18} />
              </button>

              <button
                onClick={onPrevious}
                className="touch-target music-btn music-btn-small"
                aria-label="Previous track"
              >
                <SkipBack size={16} />
              </button>

              <button
                onClick={onPlayPause}
                className="touch-target w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-150"
                style={{ backgroundColor: 'var(--primary)' }}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </button>

              <button
                onClick={onNext}
                className="touch-target music-btn music-btn-small"
                aria-label="Next track"
              >
                <SkipForward size={16} />
              </button>

              <button
                onClick={onToggleRepeat}
                className="touch-target p-2 rounded-full transition-all duration-150 hover:text-primary"
                aria-label={`Repeat: ${repeatMode}`}
              >
                {getRepeatIcon()}
              </button>
            </div>

            {/* Volume Control - Mobile: Full Width Below | Desktop: Right Side */}
            <div className="flex items-center gap-2 md:gap-3 lg:min-w-[160px]">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="touch-target p-2 text-gray-400 hover:text-primary transition-colors duration-150"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <div className="flex-1 lg:w-24">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => onVolumeChange(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer touch-target"
                  style={{
                    background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${volume}%, var(--border) ${volume}%, var(--border) 100%)`,
                    minHeight: '44px'
                  }}
                  aria-label="Volume"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}