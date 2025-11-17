'use client';

import { useState } from 'react';
import { Play, Pause, MoreHorizontal, Plus, Heart, Download } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  url: string;
  artwork: string;
  genre?: string;
  year?: number;
  isLiked?: boolean;
  isDownloaded?: boolean;
}

interface TrackListProps {
  tracks: Track[];
  currentTrackId?: number;
  isPlaying?: boolean;
  onTrackSelect: (track: Track) => void;
  onPlayPause: () => void;
  onPlayAll: () => void;
  onShufflePlay: () => void;
  onAddToPlaylist: (trackId: number) => void;
  onLikeTrack: (trackId: number) => void;
  onDownloadTrack: (trackId: number) => void;
  title?: string;
  showAlbum?: boolean;
  showArtist?: boolean;
  showDuration?: boolean;
  compact?: boolean;
}

export default function TrackList({
  tracks,
  currentTrackId,
  isPlaying,
  onTrackSelect,
  onPlayPause,
  onPlayAll,
  onShufflePlay,
  onAddToPlaylist,
  onLikeTrack,
  onDownloadTrack,
  title = "Tracks",
  showAlbum = true,
  showArtist = true,
  showDuration = true,
  compact = false,
}: TrackListProps) {
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<number | null>(null);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleTrackPlay = (track: Track) => {
    if (currentTrackId === track.id && isPlaying) {
      onPlayPause();
    } else {
      onTrackSelect(track);
    }
  };

  const handleDropdownToggle = (trackId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(isDropdownOpen === trackId ? null : trackId);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(null);
  };

  return (
    <div className="rounded-lg" style={{ backgroundColor: 'var(--surface)' }}>
      {/* Header */}
      <div className="p-4 md:p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2 className="text-lg md:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
          <span className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>{tracks.length} tracks</span>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={() => tracks.length > 0 && onPlayAll()}
            className="touch-target w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-150"
            style={{ backgroundColor: 'var(--primary)' }}
            disabled={tracks.length === 0}
            aria-label="Play all"
          >
            {currentTrackId === tracks[0]?.id && isPlaying ? (
              <Pause size={20} className="text-white" />
            ) : (
              <Play size={20} className="ml-1 text-white" />
            )}
          </button>

          <button
            onClick={onShufflePlay}
            className="px-4 py-2 md:px-6 md:py-3 rounded-full transition-all duration-150 text-sm md:text-base font-medium"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            Shuffle
          </button>
        </div>
      </div>

      {/* Desktop Table Header - Hidden on Mobile */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-4 md:px-6 py-3 text-xs md:text-sm font-medium border-b" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-center">#</div>
        <div className="col-span-1"></div>
        <div className="col-span-4 flex items-center">TITLE</div>
        {showAlbum && <div className="col-span-3 flex items-center">ALBUM</div>}
        {showDuration && <div className="col-span-2 flex items-center">DURATION</div>}
        <div className="flex items-center justify-end"></div>
      </div>

      {/* Track List - Mobile-First Responsive */}
      <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
        {tracks.length === 0 ? (
          <div className="px-6 py-12 md:py-16 text-center" style={{ color: 'var(--text-secondary)' }}>
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4" style={{ backgroundColor: 'var(--surface)' }}>
              <Plus size={20} />
            </div>
            <h3 className="text-base md:text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>No tracks found</h3>
            <p className="text-sm">Try searching for something else.</p>
          </div>
        ) : (
          tracks.map((track, index) => (
            <div
              key={track.id}
              onClick={() => handleTrackPlay(track)}
              className={`
                px-3 py-3 md:px-4 md:py-3 lg:px-6
                min-h-[64px] md:min-h-[72px]
                flex lg:grid lg:grid-cols-12 gap-3 md:gap-4
                cursor-pointer transition-all duration-150
                hover:bg-opacity-50 active:bg-opacity-70
                group touch-target
                ${currentTrackId === track.id ? 'bg-opacity-30' : ''}
              `}
              style={{ backgroundColor: currentTrackId === track.id ? 'var(--track-hover)' : 'transparent' }}
              onMouseEnter={() => setSelectedTrack(track.id)}
              onMouseLeave={() => setSelectedTrack(null)}
            >
              {/* Mobile Layout: Artwork + Info | Desktop: Grid */}

              {/* Track Number / Play Button - Desktop Only */}
              <div className="hidden lg:flex items-center justify-center">
                {currentTrackId === track.id && isPlaying ? (
                  <div className="w-5 h-5 flex items-center justify-center">
                    <Pause size={16} style={{ color: 'var(--primary)' }} />
                  </div>
                ) : (
                  <>
                    <span className="group-hover:hidden" style={{ color: 'var(--text-secondary)' }}>
                      {index + 1}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackPlay(track);
                      }}
                      className="hidden group-hover:flex items-center justify-center w-5 h-5"
                    >
                      <Play size={16} style={{ color: 'var(--primary)' }} className="ml-0.5" />
                    </button>
                  </>
                )}
              </div>

              {/* Album Artwork */}
              <div className="flex-shrink-0 lg:col-span-1 flex items-center">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
                  {track.artwork ? (
                    <img
                      src={track.artwork}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Play size={14} className="text-white ml-0.5" />
                  )}
                </div>
              </div>

              {/* Track Info - Mobile: Stacked | Desktop: Grid */}
              <div className="flex-1 min-w-0 lg:col-span-4 flex flex-col justify-center">
                <div className={`font-medium truncate text-sm md:text-base mb-0.5 ${
                  currentTrackId === track.id ? 'text-primary' : ''
                }`}
                style={{ color: currentTrackId === track.id ? 'var(--primary)' : 'var(--text-primary)' }}>
                  {track.title}
                </div>
                <div className="truncate text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {track.artist}
                </div>
              </div>

              {/* Album - Desktop Only */}
              {showAlbum && (
                <div className="hidden lg:flex lg:col-span-3 items-center">
                  <span className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>{track.album}</span>
                </div>
              )}

              {/* Duration - Mobile: Right Side | Desktop: Grid */}
              {showDuration && (
                <div className="flex-shrink-0 lg:col-span-2 flex items-center justify-end lg:justify-start">
                  <span className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {formatDuration(track.duration)}
                  </span>
                </div>
              )}

              {/* Actions - Show on Hover/Touch */}
              <div className="flex-shrink-0 lg:col-span-1 flex items-center justify-end gap-1 md:gap-2">
                {(selectedTrack === track.id || currentTrackId === track.id) && (
                  <>
                    {track.isLiked !== undefined && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLikeTrack(track.id);
                        }}
                        className={`touch-target p-2 rounded-full transition-colors duration-150 ${
                          track.isLiked ? '' : 'hover:bg-opacity-10'
                        }`}
                        style={{ color: track.isLiked ? 'var(--primary)' : 'var(--text-secondary)' }}
                        aria-label={track.isLiked ? 'Unlike' : 'Like'}
                      >
                        <Heart size={16} className={track.isLiked ? 'fill-current' : ''} />
                      </button>
                    )}

                    <button
                      onClick={(e) => handleDropdownToggle(track.id, e)}
                      className="touch-target p-2 rounded-full transition-colors duration-150 hover:bg-opacity-10 relative"
                      style={{ color: 'var(--text-secondary)' }}
                      aria-label="More options"
                    >
                      <MoreHorizontal size={16} />

                      {isDropdownOpen === track.id && (
                        <div className="absolute right-0 top-full mt-1 rounded-lg shadow-xl py-2 min-w-[160px] z-10" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToPlaylist(track.id);
                              handleDropdownClose();
                            }}
                            className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors duration-150"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            <Plus size={14} />
                            <span>Add to Playlist</span>
                          </button>
                          {track.isDownloaded !== undefined && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDownloadTrack(track.id);
                                handleDropdownClose();
                              }}
                              className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors duration-150"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              <Download size={14} />
                              <span>{track.isDownloaded ? 'Remove Download' : 'Download'}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
