'use client';

import { useState } from 'react';
import { Search, ListMusic, Home as HomeIcon, Play, Pause } from 'lucide-react';
import MusicPlayer from '@/components/MusicPlayer';
import TrackList from '@/components/TrackList';
import SearchBar from '@/components/SearchBar';

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  url: string;
  artwork: string;
}

export default function MusicApp() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track>({
    id: 1,
    title: "Red Theme",
    artist: "Doit Music",
    album: "The Collection",
    duration: 225,
    url: "/api/placeholder/audio",
    artwork: "/api/placeholder/300/300"
  });
  const [volume, setVolume] = useState(70);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'all' | 'one'>('none');

  const sampleTracks: Track[] = [
    { id: 1, title: "Red Theme", artist: "Doit Music", album: "The Collection", duration: 225, url: "/api/placeholder/audio", artwork: "/api/placeholder/300/300" },
    { id: 2, title: "Dark Nights", artist: "The Reds", album: "Mid Sessions", duration: 252, url: "/api/placeholder/audio", artwork: "/api/placeholder/300/300" },
    { id: 3, title: "Crimson Dreams", artist: "Ruby Band", album: "Color Theory", duration: 208, url: "/api/placeholder/audio", artwork: "/api/placeholder/300/300" },
    { id: 4, title: "Scarlet Flow", artist: "Fire Beats", album: "Heat Wave", duration: 236, url: "/api/placeholder/audio", artwork: "/api/placeholder/300/300" },
    { id: 5, title: "Ruby Tuesday", artist: "Rolling Code", album: "Classic Red", duration: 197, url: "/api/placeholder/audio", artwork: "/api/placeholder/300/300" },
  ];

  const playlists = [
    { id: 1, name: "Red Hot Hits", trackCount: 25 },
    { id: 2, name: "Dark Mode", trackCount: 18 },
    { id: 3, name: "Evening Vibes", trackCount: 32 },
    { id: 4, name: "Workout Energy", trackCount: 41 },
  ];

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const currentIndex = sampleTracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % sampleTracks.length;
    setCurrentTrack(sampleTracks[nextIndex]);
  };

  const handlePrevious = () => {
    const currentIndex = sampleTracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? sampleTracks.length - 1 : currentIndex - 1;
    setCurrentTrack(sampleTracks[prevIndex]);
  };

  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      setIsPlaying(true);
    } else if (repeatMode === 'all') {
      handleNext();
    } else {
      handleNext();
      if (sampleTracks.findIndex(t => t.id === currentTrack.id) === sampleTracks.length - 1) {
        setIsPlaying(false);
      }
    }
  };

  const handleSearch = async (query: string) => {
    return sampleTracks
      .filter(track =>
        track.title.toLowerCase().includes(query.toLowerCase()) ||
        track.artist.toLowerCase().includes(query.toLowerCase()) ||
        track.album.toLowerCase().includes(query.toLowerCase())
      )
      .map(track => ({
        id: track.id.toString(),
        type: 'track' as const,
        title: track.title,
        subtitle: `${track.artist} • ${track.album}`,
        artwork: track.artwork,
        url: track.url
      }));
  };

  const handleResultSelect = (result: any) => {
    const track = sampleTracks.find(t => t.id.toString() === result.id);
    if (track) {
      handleTrackSelect(track);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}>
      {/* Sidebar */}
      <div className="w-64 flex flex-col" style={{ backgroundColor: 'var(--player-bg)' }}>
        <div className="p-6 mb-8">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>Doit Music</h1>
        </div>

        <nav className="px-6 space-y-4 mb-8">
          <a href="#" className="flex items-center space-x-3 transition-colors hover:text-white" style={{ color: 'var(--text-secondary)' }}>
            <HomeIcon size={20} />
            <span>Home</span>
          </a>
          <a href="#" className="flex items-center space-x-3 transition-colors hover:text-white" style={{ color: 'var(--text-secondary)' }}>
            <Search size={20} />
            <span>Search</span>
          </a>
          <a href="#" className="flex items-center space-x-3" style={{ color: 'var(--primary)' }}>
            <ListMusic size={20} />
            <span>Your Library</span>
          </a>
        </nav>

        <div className="flex-1 px-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>Playlists</h3>
          <div className="space-y-2">
            {playlists.map(playlist => (
              <div key={playlist.id} className="text-sm cursor-pointer transition-colors hover:text-white" style={{ color: 'var(--text-secondary)' }}>
                {playlist.name}
                <span className="block text-xs" style={{ color: 'var(--border)' }}>{playlist.trackCount} tracks</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-6 flex items-center justify-between" style={{ backgroundColor: 'var(--surface)' }}>
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Welcome to Doit Music</h2>
          </div>
          <div className="flex items-center space-x-4">
            <SearchBar
              onSearch={handleSearch}
              onResultSelect={handleResultSelect}
              className="w-80"
            />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto pb-32">
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Recommended Tracks</h3>
            <TrackList
              tracks={sampleTracks}
              currentTrackId={currentTrack.id}
              isPlaying={isPlaying}
              onTrackSelect={handleTrackSelect}
              onPlayPause={handlePlayPause}
              onPlayAll={() => handleTrackSelect(sampleTracks[0])}
              onShufflePlay={() => {
                const shuffled = [...sampleTracks].sort(() => Math.random() - 0.5);
                handleTrackSelect(shuffled[0]);
              }}
              onAddToPlaylist={() => {}}
              onLikeTrack={() => {}}
              onDownloadTrack={() => {}}
              title="Red Theme Collection"
              showAlbum={true}
              showArtist={true}
              showDuration={true}
              compact={false}
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Activity</h3>
              <div className="space-y-3">
                <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--surface)' }}>
                  <h4 className="font-medium" style={{ color: 'var(--primary)' }}>New Playlist Created</h4>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>"Weekend Vibes" • 12 tracks</p>
                  <p className="text-xs mt-2" style={{ color: 'var(--border)' }}>2 hours ago</p>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--surface)' }}>
                  <h4 className="font-medium" style={{ color: 'var(--primary)' }}>Liked Track</h4>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>"Midnight City" • M83</p>
                  <p className="text-xs mt-2" style={{ color: 'var(--border)' }}>5 hours ago</p>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--surface)' }}>
                  <h4 className="font-medium" style={{ color: 'var(--primary)' }}>Followed Artist</h4>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>The Weeknd</p>
                  <p className="text-xs mt-2" style={{ color: 'var(--border)' }}>Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Music Player */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <MusicPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onTrackEnd={handleTrackEnd}
          volume={volume}
          onVolumeChange={setVolume}
          isShuffled={isShuffled}
          onToggleShuffle={() => setIsShuffled(!isShuffled)}
          repeatMode={repeatMode}
          onToggleRepeat={() => {
            const modes: ('none' | 'all' | 'one')[] = ['none', 'all', 'one'];
            const currentIndex = modes.indexOf(repeatMode);
            setRepeatMode(modes[(currentIndex + 1) % modes.length]);
          }}
        />
      </div>
    </div>
  );
}
