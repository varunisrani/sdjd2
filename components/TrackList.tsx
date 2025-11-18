'use client';

import { useState } from 'react';
import { Play, Pause, MoreHorizontal, Plus, Heart, Download } from 'lucide-react';
import styles from './TrackList.module.css';

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
    <div className={styles.trackList}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h2 className={styles.headerTitle}>{title}</h2>
          <span className={styles.trackCount}>{tracks.length} tracks</span>
        </div>

        <div className={styles.headerActions}>
          <button
            onClick={() => tracks.length > 0 && onPlayAll()}
            className={styles.playAllButton}
            disabled={tracks.length === 0}
            aria-label="Play all"
          >
            {currentTrackId === tracks[0]?.id && isPlaying ? (
              <Pause size={20} className="text-black" />
            ) : (
              <Play size={20} className="ml-1 text-black" />
            )}
          </button>

          <button
            onClick={onShufflePlay}
            className={styles.shuffleButton}
          >
            Shuffle
          </button>
        </div>
      </div>

      {/* Desktop Table Header - Hidden on Mobile */}
      <div className={styles.tableHeader}>
        <div className={styles.tableHeaderCellCenter}>#</div>
        <div className={styles.tableHeaderCell}></div>
        <div className={styles.tableHeaderCell}>TITLE</div>
        {showAlbum && <div className={styles.tableHeaderCell}>ALBUM</div>}
        {showDuration && <div className={styles.tableHeaderCell}>DURATION</div>}
        <div className={styles.tableHeaderCellEnd}></div>
      </div>

      {/* Track List - Mobile-First Responsive */}
      <div className={styles.table}>
        {tracks.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Plus size={20} />
            </div>
            <h3 className={styles.emptyTitle}>No tracks found</h3>
            <p className={styles.emptyText}>Try searching for something else.</p>
          </div>
        ) : (
          tracks.map((track, index) => (
            <div
              key={track.id}
              onClick={() => handleTrackPlay(track)}
              className={`${styles.trackRow} ${currentTrackId === track.id ? styles.trackRowActive : ''}`}
              onMouseEnter={() => setSelectedTrack(track.id)}
              onMouseLeave={() => setSelectedTrack(null)}
            >
              {/* Mobile Layout: Artwork + Info | Desktop: Grid */}

              {/* Track Number / Play Button - Desktop Only */}
              <div className={styles.playButtonCell}>
                {currentTrackId === track.id && isPlaying ? (
                  <div className={styles.pauseIcon}>
                    <Pause size={16} style={{ color: 'var(--primary)' }} />
                  </div>
                ) : (
                  <>
                    <span className={styles.trackNumber}>
                      {index + 1}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackPlay(track);
                      }}
                      className={styles.playButton}
                    >
                      <Play size={16} style={{ color: 'var(--primary)' }} className="ml-0.5" />
                    </button>
                  </>
                )}
              </div>

              {/* Album Artwork */}
              <div className={styles.artworkCell}>
                <div className={styles.artwork}>
                  {track.artwork ? (
                    <img
                      src={track.artwork}
                      alt={track.title}
                      className={styles.artworkImage}
                    />
                  ) : (
                    <Play size={14} className={`text-black ml-0.5 ${styles.artworkPlaceholder}`} />
                  )}
                </div>
              </div>

              {/* Track Info - Mobile: Stacked | Desktop: Grid */}
              <div className={styles.trackInfo}>
                <div className={`${styles.trackTitle} ${currentTrackId === track.id ? styles.trackTitleActive : ''}`}>
                  {track.title}
                </div>
                <div className={styles.trackArtist}>
                  {track.artist}
                </div>
              </div>

              {/* Album - Desktop Only */}
              {showAlbum && (
                <div className={styles.albumColumn}>
                  <span className={styles.albumText}>{track.album}</span>
                </div>
              )}

              {/* Duration - Mobile: Right Side | Desktop: Grid */}
              {showDuration && (
                <div className={styles.durationColumn}>
                  <span className={styles.duration}>
                    {formatDuration(track.duration)}
                  </span>
                </div>
              )}

              {/* Actions - Show on Hover/Touch */}
              <div className={styles.actionsColumn}>
                {(selectedTrack === track.id || currentTrackId === track.id) && (
                  <>
                    {track.isLiked !== undefined && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLikeTrack(track.id);
                        }}
                        className={`${styles.actionButton} ${track.isLiked ? styles.actionButtonLiked : ''}`}
                        aria-label={track.isLiked ? 'Unlike' : 'Like'}
                      >
                        <Heart size={16} className={track.isLiked ? 'fill-current' : ''} />
                      </button>
                    )}

                    <button
                      onClick={(e) => handleDropdownToggle(track.id, e)}
                      className={`${styles.actionButton} ${styles.dropdownButton}`}
                      aria-label="More options"
                    >
                      <MoreHorizontal size={16} />

                      {isDropdownOpen === track.id && (
                        <div className={styles.dropdownMenu}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToPlaylist(track.id);
                              handleDropdownClose();
                            }}
                            className={styles.dropdownMenuItem}
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
                              className={styles.dropdownMenuItem}
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
