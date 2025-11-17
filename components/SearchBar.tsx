'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, Music, Users, Album } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'track' | 'album' | 'artist' | 'playlist';
  title: string;
  subtitle: string;
  artwork?: string;
  url?: string;
}

interface SearchBarProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  onResultSelect: (result: SearchResult) => void;
  placeholder?: string;
  showSuggestions?: boolean;
  showRecentSearches?: boolean;
  className?: string;
}

export default function SearchBar({
  onSearch,
  onResultSelect,
  placeholder = "Search tracks, artists, albums...",
  showSuggestions = true,
  showRecentSearches = true,
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedSearches = localStorage.getItem('recentSearches');
      if (savedSearches) {
        try {
          setRecentSearches(JSON.parse(savedSearches));
        } catch (e) {
          console.error('Failed to parse recent searches:', e);
        }
      }
    } catch (e) {
      console.error('localStorage access failed:', e);
    }
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      if (query.trim().length === 0) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await onSearch(query);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev =>
            prev < (showRecentSearches && results.length === 0 ? recentSearches.length - 1 : results.length - 1)
              ? prev + 1
              : prev
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
          break;
        case 'Enter':
          event.preventDefault();
          if (showRecentSearches && results.length === 0 && selectedIndex < recentSearches.length) {
            handleRecentSearch(recentSearches[selectedIndex]);
          } else if (selectedIndex < results.length) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, results, recentSearches, selectedIndex, showRecentSearches]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    onResultSelect(result);

    const newRecentSearches = [query.trim(), ...recentSearches.filter(s => s !== query.trim())].slice(0, 10);
    setRecentSearches(newRecentSearches);
    try {
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    } catch (e) {
      console.error('Failed to save recent searches:', e);
    }
  };

  const handleRecentSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('recentSearches');
    } catch (e) {
      console.error('Failed to clear recent searches:', e);
    }
  };

  const getIcon = (type: SearchResult['type']) => {
    const iconStyle = { color: 'var(--primary)' };
    const defaultStyle = { color: 'var(--text-secondary)' };

    switch (type) {
      case 'track':
        return <Music size={16} style={iconStyle} />;
      case 'album':
        return <Album size={16} style={iconStyle} />;
      case 'artist':
        return <Users size={16} style={iconStyle} />;
      case 'playlist':
        return <TrendingUp size={16} style={iconStyle} />;
      default:
        return <Search size={16} style={defaultStyle} />;
    }
  };

  const showDropdown = isOpen && (query.length > 0 || showRecentSearches);

  return (
    <div className={`relative w-full md:w-80 ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Search
          className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 transition-colors"
          style={{ color: isOpen ? 'var(--primary)' : 'var(--text-secondary)' }}
          size={20}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="search-input w-full h-11 md:h-10 pl-10 md:pl-12 pr-10 md:pr-12 text-base md:text-sm rounded-lg transition-all"
          style={{
            backgroundColor: 'var(--surface)',
            color: 'var(--text-primary)',
            border: `1px solid ${isOpen ? 'var(--primary)' : 'var(--border)'}`,
            outline: isOpen ? '3px solid var(--primary)' : 'none',
            outlineOffset: '2px'
          }}
          aria-label="Search tracks, artists, albums"
        />

        {query.length > 0 && (
          <button
            onClick={handleClearSearch}
            className="touch-target absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors hover:bg-opacity-10"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl overflow-y-auto z-50 max-h-[60vh] md:max-h-96 fade-in"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)'
          }}
        >
          {isLoading ? (
            <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
              <div
                className="animate-spin rounded-full h-6 w-6 mx-auto"
                style={{ borderWidth: '2px', borderColor: 'transparent', borderTopColor: 'var(--primary)' }}
              ></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : (
            <>
              {query.length === 0 && showRecentSearches && recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-3 md:px-4 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                    <span className="text-xs md:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Recent Searches</span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs transition-colors hover:opacity-80"
                      style={{ color: 'var(--text-secondary)' }}
                      aria-label="Clear all recent searches"
                    >
                      Clear all
                    </button>
                  </div>
                  {recentSearches.map((searchTerm, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearch(searchTerm)}
                      className={`touch-target w-full text-left px-3 md:px-4 py-3 transition-all duration-150 flex items-center gap-3 min-h-[48px]`}
                      style={{
                        backgroundColor: selectedIndex === index ? 'var(--track-hover)' : 'transparent',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--track-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedIndex === index ? 'var(--track-hover)' : 'transparent'}
                    >
                      <Clock size={16} style={{ color: 'var(--text-secondary)' }} />
                      <span className="text-sm md:text-base" style={{ color: 'var(--text-primary)' }}>{searchTerm}</span>
                    </button>
                  ))}
                </div>
              )}

              {query.length > 0 && results.length === 0 && !isLoading && (
                <div className="p-6 md:p-8 text-center" style={{ color: 'var(--text-secondary)' }}>
                  <Search size={32} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No results found for "{query}"</p>
                </div>
              )}

              {results.length > 0 && (
                <div>
                  {query.length > 0 && (
                    <div className="px-3 md:px-4 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                      <span className="text-xs md:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {results.length} results for "{query}"
                      </span>
                    </div>
                  )}
                  {results.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`touch-target w-full text-left px-3 md:px-4 py-3 transition-all duration-150 flex items-center gap-3 min-h-[48px]`}
                      style={{
                        backgroundColor: selectedIndex === index ? 'var(--track-hover)' : 'transparent',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--track-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedIndex === index ? 'var(--track-hover)' : 'transparent'}
                    >
                      <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--background)' }}>
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate text-sm md:text-base" style={{ color: 'var(--text-primary)' }}>{result.title}</div>
                        <div className="text-xs md:text-sm truncate" style={{ color: 'var(--text-secondary)' }}>{result.subtitle}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}