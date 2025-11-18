'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Heart, MoreHorizontal, ArrowLeft } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  url: string;
  artwork: string;
  isLiked?: boolean;
}

interface NowPlayingProps {
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
  onLikeTrack: (trackId: number) => void;
  onBack: () => void;
  queue?: Track[];
  onQueueReorder?: (fromIndex: number, toIndex: number) => void;
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

export default function NowPlaying({
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
  onLikeTrack,
  onBack,
  queue = [],
  onQueueReorder,
}: NowPlayingProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [isLiked, setIsLiked] = useState(currentTrack.isLiked || false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setIsRotating(isPlaying);
  }, [isPlaying]);

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
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const progressBar = document.querySelector('[data-progress-bar]') as HTMLElement;
      if (!progressBar) return;

      const rect = progressBar.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setDragProgress(percentage);
    };

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

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    onLikeTrack(currentTrack.id);
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'all':
        return <Repeat size={20} className="text-black" />;
      case 'one':
        return <div className="relative"><Repeat size={20} className="text-black" /><span className="absolute -top-1 -right-1 text-xs text-black">1</span></div>;
      default:
        return <Repeat size={20} className="text-black/60" />;
    }
  };

  return (
    <>
      <audio ref={audioRef} src={isValidUrl(currentTrack.url) ? currentTrack.url : ''} />

      <div className="min-h-screen text-black" style={{ background: 'linear-gradient(to bottom right, var(--background), var(--surface), var(--player-bg))' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-black/60 hover:text-black transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <div className="text-center">
            <span className="text-sm text-black/60">NOW PLAYING FROM YOUR LIBRARY</span>
            <div className="font-medium">Liked Songs</div>
          </div>

          <button className="text-black/60 hover:text-black transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 max-w-4xl mx-auto">
          {/* Album Artwork */}
          <div className="mb-8">
            <div className={`w-96 h-96 bg-white rounded-lg shadow-2xl overflow-hidden ${
              isRotating ? 'animate-spin' : ''
            }`}
              style={{
                animationDuration: '8s',
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite'
              }}>
              {currentTrack.artwork ? (
                <img
                  src={currentTrack.artwork}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                    <Play size={48} className="text-black ml-2" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Track Info */}
          <div className="text-center mb-8 max-w-2xl">
            <h1 className="text-4xl font-bold mb-2">{currentTrack.title}</h1>
            <p className="text-xl text-black/60 mb-4">{currentTrack.artist}</p>
            <p className="text-black/60">{currentTrack.album}</p>
          </div>

          {/* Like Button */}
          <button
            onClick={handleLikeToggle}
            className="mb-8 p-2 transition-colors"
          >
            <Heart
              size={24}
              className={isLiked ? 'text-black fill-current' : 'text-black/60 hover:text-black'}
            />
          </button>

          {/* Progress Bar */}
          <div className="w-full max-w-2xl mb-8">
            <div
              className="progress-bar cursor-pointer group mb-2"
              onClick={handleProgressClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleProgressDrag}
              data-progress-bar
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
            <div className="flex justify-between text-xs text-black/60">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center space-x-6 mb-8">
            <button
              onClick={onToggleShuffle}
              className={`p-2 rounded-full transition-colors ${isShuffled ? 'text-black' : 'text-black/60 hover:text-black'}`}
            >
              <Shuffle size={20} />
            </button>

            <button
              onClick={onPrevious}
              className="p-3 hover:scale-105 transition-transform"
            >
              <SkipBack size={24} className="text-black" />
            </button>

            <button
              onClick={onPlayPause}
              className="p-5 bg-black hover:bg-black/90 rounded-full hover:scale-105 transition-all shadow-lg"
            >
              {isPlaying ? <Pause size={28} className="text-white" /> : <Play size={28} className="ml-1 text-white" />}
            </button>

            <button
              onClick={onNext}
              className="p-3 hover:scale-105 transition-transform"
            >
              <SkipForward size={24} className="text-black" />
            </button>

            <button
              onClick={onToggleRepeat}
              className="p-2 rounded-full transition-colors hover:text-black"
            >
              {getRepeatIcon()}
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-3 w-full max-w-xs">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-black/60 hover:text-black transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="w-full h-1 bg-white rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #000000 0%, #000000 ${volume}%, #e5e5e5 ${volume}%, #e5e5e5 100%)`
                }}
              />
            </div>
          </div>
        </div>

        {/* Queue Section */}
        {queue.length > 0 && (
          <div className="bg-white border-t border-black/10 p-6">
            <h3 className="text-lg font-semibold mb-4">Up Next</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {queue.slice(0, 10).map((track, index) => (
                <div key={track.id} className="flex items-center space-x-3 p-2 hover:bg-black/5 rounded cursor-pointer">
                  <span className="text-black/60 text-sm w-6">{index + 1}</span>
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                    {track.artwork ? (
                      <img src={track.artwork} alt={track.title} className="w-full h-full object-cover rounded" />
                    ) : (
                      <Play size={12} className="text-black ml-0.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-black">{track.title}</div>
                    <div className="text-sm text-black/60 truncate">{track.artist}</div>
                  </div>
                  <span className="text-sm text-black/60">{formatTime(track.duration)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}