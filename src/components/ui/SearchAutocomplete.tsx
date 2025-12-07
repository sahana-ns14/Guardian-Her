// src/components/ui/SearchAutocomplete.tsx
import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { searchLocation, type SearchResult } from '../../lib/geocoding';

interface SearchAutocompleteProps {
    onSelect: (result: SearchResult) => void;
    placeholder?: string;
    userLocation?: { lat: number; lng: number };
}

export function SearchAutocomplete({ onSelect, placeholder = "Search location...", userLocation }: SearchAutocompleteProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const debounceTimer = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Debounced search
    useEffect(() => {
        if (query.length < 3) {
            setResults([]);
            return;
        }

        setIsLoading(true);

        // Clear previous timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Set new timer
        debounceTimer.current = setTimeout(async () => {
            try {
                const searchResults = await searchLocation(
                    query,
                    userLocation?.lat,
                    userLocation?.lng
                );
                setResults(searchResults);
                setShowResults(true);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 500); // 500ms debounce

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [query, userLocation]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (result: SearchResult) => {
        setQuery(result.name);
        setShowResults(false);
        onSelect(result);
    };

    const handleClear = () => {
        setQuery('');
        setResults([]);
        setShowResults(false);
    };

    return (
        <div ref={containerRef} className="relative flex-1">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => results.length > 0 && setShowResults(true)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-lavender-200 dark:border-charcoal-600 bg-white dark:bg-charcoal-900 text-charcoal-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-lavender-300 transition-all shadow-sm"
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" size={20} />
                )}
                {!isLoading && query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {showResults && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-charcoal-800 rounded-xl shadow-2xl border border-gray-200 dark:border-charcoal-600 max-h-80 overflow-y-auto z-50">
                    {results.map((result) => (
                        <button
                            key={result.id}
                            onClick={() => handleSelect(result)}
                            className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-charcoal-700 transition-colors text-left border-b border-gray-100 dark:border-charcoal-600 last:border-b-0"
                        >
                            <MapPin size={20} className="text-rose-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-charcoal-900 dark:text-white truncate">
                                    {result.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {result.displayName}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* No Results */}
            {showResults && query.length >= 3 && results.length === 0 && !isLoading && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-charcoal-800 rounded-xl shadow-2xl border border-gray-200 dark:border-charcoal-600 p-4 z-50">
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                        No locations found for "{query}"
                    </p>
                </div>
            )}
        </div>
    );
}
