'use client';

import { useState } from 'react';
import { Play, Pause, MoreHorizontal, Plus, Trash2, Edit3, Heart } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  url: string;
  artwork: string;
}

interface Playlist {
  id: number;
  name: string;
  description?: string;
  tracks: Track[];
  artwork?: string;
  isLiked?: boolean;
  totalDuration: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PlaylistProps {
  playlist: Playlist;
  currentTrackId?: number;
  isPlaying?: boolean;
  onTrackSelect: (track: Track) => void;
  onPlayPause: () => void;
  onRemoveTrack: (trackId: number) => void;
  onEditPlaylist: () => void;
  onDeletePlaylist: () => void;
  onLikePlaylist: (playlistId: number) => void;
}

export default function Playlist({
  playlist,
  currentTrackId,
  isPlaying,
  onTrackSelect,
  onPlayPause,
  onRemoveTrack,
  onEditPlaylist,
  onDeletePlaylist,
  onLikePlaylist,
}: PlaylistProps) {
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handleTrackPlay = (track: Track) => {
    if (currentTrackId === track.id && isPlaying) {
      onPlayPause();
    } else {
      onTrackSelect(track);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg">
      {/* Playlist Header */}
      <div className="bg-gray-800 p-8 rounded-t-lg">
        <div className="flex items-center space-x-6">
          <div className="w-48 h-48 bg-gray-700 rounded-lg flex items-center justify-center shadow-xl">
            {playlist.artwork ? (
              <img
                src={playlist.artwork}
                alt={playlist.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus size={32} className="text-white" />
                </div>
                <span className="text-gray-400 text-sm">No Cover</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-sm text-gray-400">Playlist</span>
              {playlist.isLiked && (
                <Heart size={16} className="text-red-600 fill-current" />
              )}
            </div>
            <h1 className="text-4xl font-bold mb-2">{playlist.name}</h1>
            {playlist.description && (
              <p className="text-gray-400 mb-4">{playlist.description}</p>
            )}

            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <span>{playlist.tracks.length} tracks</span>
              <span>•</span>
              <span>{formatDuration(playlist.totalDuration)}</span>
              <span>•</span>
              <span>Updated {formatDate(playlist.updatedAt)}</span>
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={() => playlist.tracks.length > 0 && handleTrackPlay(playlist.tracks[0])}
                className="music-btn music-btn-large bg-red-600 hover:bg-red-700"
                disabled={playlist.tracks.length === 0}
              >
                {currentTrackId === playlist.tracks[0]?.id && isPlaying ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} className="ml-1" />
                )}
              </button>

              <button
                onClick={() => onLikePlaylist(playlist.id)}
                className={`p-3 rounded-full transition-colors ${
                  playlist.isLiked
                    ? 'text-red-600 bg-red-600 bg-opacity-20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Heart size={20} className={playlist.isLiked ? 'fill-current' : ''} />
              </button>

              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors relative"
              >
                <MoreHorizontal size={20} />

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 min-w-[160px] z-10">
                    <button
                      onClick={() => {
                        onEditPlaylist();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center space-x-2"
                    >
                      <Edit3 size={14} />
                      <span>Edit Playlist</span>
                    </button>
                    <button
                      onClick={() => {
                        onDeletePlaylist();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <Trash2 size={14} />
                      <span>Delete Playlist</span>
                    </button>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="divide-y divide-gray-800">
        <div className="grid grid-cols-12 gap-4 px-8 py-3 text-sm text-gray-400 font-medium">
          <div className="col-span-1">#</div>
          <div className="col-span-5">TITLE</div>
          <div className="col-span-3">ALBUM</div>
          <div className="col-span-2">DURATION</div>
          <div className="col-span-1"></div>
        </div>

        {playlist.tracks.length === 0 ? (
          <div className="px-8 py-16 text-center text-gray-400">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={24} />
            </div>
            <h3 className="text-lg font-medium mb-2">This playlist is empty</h3>
            <p>Add some tracks to get started!</p>
          </div>
        ) : (
          playlist.tracks.map((track, index) => (
            <div
              key={track.id}
              className={`grid grid-cols-12 gap-4 px-8 py-3 group hover:bg-gray-800 cursor-pointer transition-colors ${
                currentTrackId === track.id ? 'bg-gray-800' : ''
              }`}
              onMouseEnter={() => setSelectedTrack(track.id)}
              onMouseLeave={() => setSelectedTrack(null)}
            >
              <div className="col-span-1 flex items-center justify-center">
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

              <div className="col-span-5 flex items-center space-x-3">
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
                <div className="min-w-0">
                  <div className={`font-medium truncate ${
                    currentTrackId === track.id ? 'text-red-600' : 'text-white'
                  }`}>
                    {track.title}
                  </div>
                  <div className="text-sm text-gray-400 truncate">
                    {track.artist}
                  </div>
                </div>
              </div>

              <div className="col-span-3 flex items-center">
                <span className="text-sm text-gray-400 truncate">{track.album}</span>
              </div>

              <div className="col-span-2 flex items-center">
                <span className="text-sm text-gray-400">
                  {formatDuration(track.duration)}
                </span>
              </div>

              <div className="col-span-1 flex items-center justify-center">
                {selectedTrack === track.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveTrack(track.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}