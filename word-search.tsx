import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";

interface Suggestion {
  word: string;
  partOfSpeech?: string;
}

interface WordSearchProps {
  onWordSelect: (word: string) => void;
}

export default function WordSearch({ onWordSelect }: WordSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions
  const { data: suggestions = [] } = useQuery<Suggestion[]>({
    queryKey: ["/api/suggestions", debouncedSearchTerm],
    enabled: debouncedSearchTerm.length >= 2,
  });

  // Show suggestions when we have them and input is focused
  useEffect(() => {
    setShowSuggestions(inputFocused && suggestions.length > 0 && searchTerm.length >= 2);
  }, [inputFocused, suggestions.length, searchTerm.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking
    setTimeout(() => {
      setInputFocused(false);
      setShowSuggestions(false);
    }, 200);
  };

  const handleSuggestionClick = (word: string) => {
    setSearchTerm(word);
    setShowSuggestions(false);
    onWordSelect(word);
    inputRef.current?.blur();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onWordSelect(searchTerm.trim());
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for any English word..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
          >
            <Search size={20} />
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionRef}
          className="absolute top-full left-0 right-0 bg-surface mt-2 rounded-lg shadow-lg border border-gray-200 z-10 max-h-64 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion.word)}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <span className="text-gray-800">{suggestion.word}</span>
              {suggestion.partOfSpeech && (
                <span className="text-sm text-gray-500 ml-2">{suggestion.partOfSpeech}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
