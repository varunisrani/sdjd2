'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat } from 'lucide-react';
import styles from './MusicPlayer.module.css';

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
    const handleGlobalMouseUp = () => {
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

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const progressBar = document.querySelector('[role="progressbar"]');
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

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'all':
        return <Repeat size={20} style={{ color: 'var(--primary)' }} />;
      case 'one':
        return (
          <div className={styles.repeatButton}>
            <Repeat size={20} style={{ color: 'var(--primary)' }} />
            <span className={styles.repeatBadge} style={{ color: 'var(--primary)' }}>1</span>
          </div>
        );
      default:
        return <Repeat size={20} />;
    }
  };

  return (
    <>
      <audio ref={audioRef} src={isValidUrl(currentTrack.url) ? currentTrack.url : ''} />

      {/* Mobile-First Responsive Music Player */}
      <div className={styles.player}>
        <div className={styles.playerContent}>
          {/* Progress Bar */}
          <div className={styles.progressSection}>
            <div
              className={`${styles.progressBar} ${isDragging ? styles.dragging : ''}`}
              onClick={handleProgressClick}
              onMouseDown={handleMouseDown}
              role="progressbar"
              aria-valuenow={Math.round(progressPercentage)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Music progress"
              tabIndex={0}
              style={{
                willChange: isDragging ? 'width' : 'auto'
              }}
            >
              <div
                className={styles.progressFill}
                style={{
                  width: `${progressPercentage}%`,
                  willChange: isDragging ? 'width' : 'auto'
                }}
              >
                <div className={styles.progressThumb} />
              </div>
            </div>
            <div className={styles.timeDisplay}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Mobile: Vertical Layout | Desktop: Horizontal Layout */}
          <div className={styles.mainLayout}>
            {/* Track Info */}
            <div className={styles.trackInfo}>
              <div className={styles.artwork}>
                <div className={styles.artworkIcon}>
                  <Play size={12} style={{ color: 'white', marginLeft: '0.125rem' }} />
                </div>
              </div>
              <div className={styles.trackDetails}>
                <h4 className={styles.trackTitle}>
                  {currentTrack.title}
                </h4>
                <p className={styles.trackArtist}>
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Control Buttons - Mobile: Centered | Desktop: Inline */}
            <div className={styles.controls}>
              <button
                onClick={onToggleShuffle}
                className={`${styles.controlButton} ${isShuffled ? styles.active : ''}`}
                aria-label="Toggle shuffle"
              >
                <Shuffle size={18} />
              </button>

              <button
                onClick={onPrevious}
                className={`${styles.controlButton} ${styles.small}`}
                aria-label="Previous track"
              >
                <SkipBack size={16} />
              </button>

              <button
                onClick={onPlayPause}
                className={styles.playButton}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '0.125rem' }} />}
              </button>

              <button
                onClick={onNext}
                className={`${styles.controlButton} ${styles.small}`}
                aria-label="Next track"
              >
                <SkipForward size={16} />
              </button>

              <button
                onClick={onToggleRepeat}
                className={styles.controlButton}
                aria-label={`Repeat: ${repeatMode}`}
              >
                {getRepeatIcon()}
              </button>
            </div>

            {/* Volume Control - Mobile: Full Width Below | Desktop: Right Side */}
            <div className={styles.volumeSection}>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={styles.volumeButton}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <div className={styles.volumeSliderContainer}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => onVolumeChange(Number(e.target.value))}
                  className={styles.volumeSlider}
                  style={{
                    background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${volume}%, var(--border) ${volume}%, var(--border) 100%)`
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