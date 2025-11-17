'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, Music, Users, Album } from 'lucide-react';
import styles from './SearchBar.module.css';

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
    <div className={`${styles.searchContainer} ${className}`} ref={dropdownRef}>
      <div style={{ position: 'relative' }}>
        <Search
          className={`${styles.searchIcon} ${isOpen ? styles.searchIconFocused : ''}`}
          size={20}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={styles.searchInput}
          aria-label="Search tracks, artists, albums"
        />

        {query.length > 0 && (
          <button
            onClick={handleClearSearch}
            className={styles.clearButton}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className={styles.dropdown}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>Searching...</p>
            </div>
          ) : (
            <>
              {query.length === 0 && showRecentSearches && recentSearches.length > 0 && (
                <div>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionTitle}>Recent Searches</span>
                    <button
                      onClick={clearRecentSearches}
                      className={styles.clearAllButton}
                      aria-label="Clear all recent searches"
                    >
                      Clear all
                    </button>
                  </div>
                  {recentSearches.map((searchTerm, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearch(searchTerm)}
                      className={`${styles.resultItem} ${selectedIndex === index ? styles.resultItemSelected : ''}`}
                    >
                      <div className={styles.resultIcon}>
                        <Clock size={16} style={{ color: 'var(--text-secondary)' }} />
                      </div>
                      <div className={styles.resultContent}>
                        <div className={styles.resultTitle}>{searchTerm}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {query.length > 0 && results.length === 0 && !isLoading && (
                <div className={styles.emptyState}>
                  <Search size={32} className={styles.emptyIcon} />
                  <p className={styles.emptyText}>No results found for "{query}"</p>
                </div>
              )}

              {results.length > 0 && (
                <div>
                  {query.length > 0 && (
                    <div className={styles.sectionHeader}>
                      <span className={styles.sectionTitle}>
                        {results.length} results for "{query}"
                      </span>
                    </div>
                  )}
                  {results.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`${styles.resultItem} ${selectedIndex === index ? styles.resultItemSelected : ''}`}
                    >
                      <div className={styles.resultIcon}>
                        {getIcon(result.type)}
                      </div>
                      <div className={styles.resultContent}>
                        <div className={styles.resultTitle}>{result.title}</div>
                        <div className={styles.resultSubtitle}>{result.subtitle}</div>
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