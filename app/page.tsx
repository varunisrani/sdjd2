'use client';

import { useState } from 'react';
import { Search, ListMusic, Home as HomeIcon, Play, Pause } from 'lucide-react';
import MusicPlayer from '@/components/MusicPlayer';
import TrackList from '@/components/TrackList';
import SearchBar from '@/components/SearchBar';
import styles from './page.module.css';

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
    <div className={styles.appContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.sidebarTitle}>Doit Music</h1>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navList}>
            <a href="#" className={styles.navLink}>
              <HomeIcon size={20} />
              <span>Home</span>
            </a>
            <a href="#" className={styles.navLink}>
              <Search size={20} />
              <span>Search</span>
            </a>
            <a href="#" className={`${styles.navLink} ${styles.navLinkActive}`}>
              <ListMusic size={20} />
              <span>Your Library</span>
            </a>
          </div>
        </nav>

        <div className={styles.playlistSection}>
          <h3 className={styles.playlistTitle}>Playlists</h3>
          <div className={styles.playlistList}>
            {playlists.map(playlist => (
              <div key={playlist.id} className={styles.playlistItem}>
                {playlist.name}
                <span className={styles.playlistMeta}>{playlist.trackCount} tracks</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <h2 className={styles.headerTitle}>Welcome to Doit Music</h2>
          </div>
          <div className={styles.headerActions}>
            <SearchBar
              onSearch={handleSearch}
              onResultSelect={handleResultSelect}
              className="w-80"
            />
          </div>
        </header>

        {/* Content Area */}
        <div className={styles.contentArea}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Recommended Tracks</h3>
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

          <div className={styles.grid}>
            <div>
              <h3 className={styles.sectionTitle}>Recent Activity</h3>
              <div className={styles.activityList}>
                <div className={styles.activityCard}>
                  <h4 className={styles.activityCardTitle}>New Playlist Created</h4>
                  <p className={styles.activityCardSubtitle}>"Weekend Vibes" • 12 tracks</p>
                  <p className={styles.activityCardMeta}>2 hours ago</p>
                </div>
                <div className={styles.activityCard}>
                  <h4 className={styles.activityCardTitle}>Liked Track</h4>
                  <p className={styles.activityCardSubtitle}>"Midnight City" • M83</p>
                  <p className={styles.activityCardMeta}>5 hours ago</p>
                </div>
                <div className={styles.activityCard}>
                  <h4 className={styles.activityCardTitle}>Followed Artist</h4>
                  <p className={styles.activityCardSubtitle}>The Weeknd</p>
                  <p className={styles.activityCardMeta}>Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Music Player */}
      <div className={styles.playerContainer}>
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
