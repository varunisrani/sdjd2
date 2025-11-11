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

  const getGridCols = () => {
    const cols = [];
    cols.push(1); // #
    if (!compact) cols.push(1); // Artwork
    cols.push(showAlbum ? 5 : 7); // Title (+ Artist if no album)
    if (showAlbum) cols.push(3); // Album
    if (showArtist && !showAlbum) cols.push(2); // Artist
    cols.push(showDuration ? 2 : 3); // Duration or empty
    cols.push(1); // Actions
    return `grid-cols-${cols.length}`;
  };

  const getHeaderCols = () => {
    if (!compact && showAlbum && showArtist && showDuration) {
      return 'grid-cols-12';
    } else if (!compact && !showAlbum && showArtist && showDuration) {
      return 'grid-cols-11';
    } else if (!compact && showAlbum && !showArtist && showDuration) {
      return 'grid-cols-11';
    } else if (compact && showAlbum && showArtist && showDuration) {
      return 'grid-cols-11';
    }
    return 'grid-cols-12';
  };

  return (
    <div className="rounded-lg" style={{ backgroundColor: 'var(--surface)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <span className="text-gray-400">{tracks.length} tracks</span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => tracks.length > 0 && onPlayAll()}
            className="music-btn music-btn-large bg-red-600 hover:bg-red-700"
            disabled={tracks.length === 0}
          >
            {currentTrackId === tracks[0]?.id && isPlaying ? (
              <Pause size={24} />
            ) : (
              <Play size={24} className="ml-1" />
            )}
          </button>

          <button
            onClick={onShufflePlay}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors"
          >
            Shuffle
          </button>
        </div>
      </div>

      {/* Track List Header */}
      <div className={`grid ${getHeaderCols()} gap-4 px-6 py-3 text-sm text-gray-400 font-medium border-b border-gray-800`}>
        <div className="flex items-center justify-center">#</div>
        {!compact && <div className="flex items-center justify-center"></div>}
        <div className="flex items-center">TITLE</div>
        {showAlbum && <div className="flex items-center">ALBUM</div>}
        {showArtist && !showAlbum && <div className="flex items-center">ARTIST</div>}
        {showDuration && <div className="flex items-center">DURATION</div>}
        <div></div>
      </div>

      {/* Track List */}
      <div className="divide-y divide-gray-800">
        {tracks.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={24} />
            </div>
            <h3 className="text-lg font-medium mb-2">No tracks found</h3>
            <p>Try searching for something else.</p>
          </div>
        ) : (
          tracks.map((track, index) => (
            <div
              key={track.id}
              className={`grid ${getHeaderCols()} gap-4 px-6 py-3 group hover:bg-gray-800 cursor-pointer transition-colors ${
                currentTrackId === track.id ? 'bg-gray-800' : ''
              }`}
              onMouseEnter={() => setSelectedTrack(track.id)}
              onMouseLeave={() => setSelectedTrack(null)}
            >
              <div className="flex items-center justify-center">
                {currentTrackId === track.id && isPlaying ? (
                  <div className="w-5 h-5 flex items-center justify-center">
                    <Pause size={16} className="text-red-600" />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 group-hover:hidden">
                      {index + 1}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackPlay(track);
                      }}
                      className="hidden group-hover:block"
                    >
                      <div className="w-5 h-5 flex items-center justify-center">
                        <Play size={16} className="text-red-600 ml-0.5" />
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {!compact && (
                <div className="flex items-center justify-center">
                  <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                    {track.artwork ? (
                      <img
                        src={track.artwork}
                        alt={track.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <Play size={12} className="text-white ml-0.5" />
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3 min-w-0">
                <div className="min-w-0">
                  <div className={`font-medium truncate ${
                    currentTrackId === track.id ? 'text-red-600' : 'text-white'
                  }`}>
                    {track.title}
                  </div>
                  {showArtist && (
                    <div className="text-sm text-gray-400 truncate">
                      {track.artist}
                    </div>
                  )}
                </div>
              </div>

              {showAlbum && (
                <div className="flex items-center">
                  <span className="text-sm text-gray-400 truncate">{track.album}</span>
                </div>
              )}

              {showDuration && (
                <div className="flex items-center">
                  <span className="text-sm text-gray-400">
                    {formatDuration(track.duration)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-center space-x-2">
                {selectedTrack === track.id && (
                  <>
                    {track.isLiked !== undefined && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLikeTrack(track.id);
                        }}
                        className={`p-1 transition-colors ${
                          track.isLiked
                            ? 'text-red-600'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Heart size={16} className={track.isLiked ? 'fill-current' : ''} />
                      </button>
                    )}

                    {track.isDownloaded !== undefined && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownloadTrack(track.id);
                        }}
                        className={`p-1 transition-colors ${
                          track.isDownloaded
                            ? 'text-green-600'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Download size={16} />
                      </button>
                    )}

                    <button
                      onClick={(e) => handleDropdownToggle(track.id, e)}
                      className="p-1 text-gray-400 hover:text-white transition-colors relative"
                    >
                      <MoreHorizontal size={16} />

                      {isDropdownOpen === track.id && (
                        <div className="absolute right-0 top-full mt-1 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 min-w-[140px] z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToPlaylist(track.id);
                              handleDropdownClose();
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center space-x-2"
                          >
                            <Plus size={14} />
                            <span>Add to Playlist</span>
                          </button>
                          {track.isLiked !== undefined && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onLikeTrack(track.id);
                                handleDropdownClose();
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center space-x-2"
                            >
                              <Heart size={14} className={track.isLiked ? 'fill-current' : ''} />
                              <span>{track.isLiked ? 'Remove from Liked' : 'Like'}</span>
                            </button>
                          )}
                          {track.isDownloaded !== undefined && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDownloadTrack(track.id);
                                handleDropdownClose();
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center space-x-2"
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