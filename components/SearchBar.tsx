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
    switch (type) {
      case 'track':
        return <Music size={16} className="text-red-600" />;
      case 'album':
        return <Album size={16} className="text-red-600" />;
      case 'artist':
        return <Users size={16} className="text-red-600" />;
      case 'playlist':
        return <TrendingUp size={16} className="text-red-600" />;
      default:
        return <Search size={16} className="text-gray-400" />;
    }
  };

  const showDropdown = isOpen && (query.length > 0 || showRecentSearches);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Search
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
            isOpen ? 'text-red-600' : 'text-gray-400'
          }`}
          size={20}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={`w-full bg-gray-800 text-white pl-12 pr-12 py-3 rounded-full focus:outline-none focus:ring-2 transition-all ${
            isOpen ? 'ring-2 ring-red-600' : 'focus:ring-red-600'
          }`}
        />

        {query.length > 0 && (
          <button
            onClick={handleClearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : (
            <>
              {query.length === 0 && showRecentSearches && recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
                    <span className="text-sm font-medium text-gray-400">Recent Searches</span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  {recentSearches.map((searchTerm, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearch(searchTerm)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors flex items-center space-x-3 ${
                        selectedIndex === index ? 'bg-gray-700' : ''
                      }`}
                    >
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-gray-300">{searchTerm}</span>
                    </button>
                  ))}
                </div>
              )}

              {query.length > 0 && results.length === 0 && !isLoading && (
                <div className="p-8 text-center text-gray-400">
                  <Search size={32} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No results found for "{query}"</p>
                </div>
              )}

              {results.length > 0 && (
                <div>
                  {query.length > 0 && (
                    <div className="px-4 py-2 border-b border-gray-700">
                      <span className="text-sm font-medium text-gray-400">
                        {results.length} results for "{query}"
                      </span>
                    </div>
                  )}
                  {results.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors flex items-center space-x-3 ${
                        selectedIndex === index ? 'bg-gray-700' : ''
                      }`}
                    >
                      <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">{result.title}</div>
                        <div className="text-sm text-gray-400 truncate">{result.subtitle}</div>
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