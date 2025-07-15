import { BookOpen, Bookmark, Search, Heart, Clock } from "lucide-react";
import WordSearch from "@/components/word-search";
import WordDefinition from "@/components/word-definition";
import RecentSearches from "@/components/recent-searches";
import { useState, useEffect } from "react";
import type { WordDefinition as WordDef } from "@shared/schema";

type ViewType = "search" | "favorites" | "history";

export default function Home() {
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [wordData, setWordData] = useState<WordDef | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>("search");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const handleWordSelect = (word: string, data?: WordDef) => {
    setSelectedWord(word);
    if (data) {
      setWordData(data);
    }
    setCurrentView("search");
  };

  const toggleFavorite = (word: string) => {
    setFavorites(prev => 
      prev.includes(word) 
        ? prev.filter(w => w !== word)
        : [...prev, word]
    );
  };

  const isFavorite = (word: string) => favorites.includes(word);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Touch/swipe gesture handling
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      // Only trigger if horizontal swipe is more prominent than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        // Swipe right from left edge to show sidebar
        if (startX < 50 && deltaX > 50 && !sidebarVisible) {
          setSidebarVisible(true);
        }
        // Swipe left to hide sidebar
        else if (deltaX < -50 && sidebarVisible) {
          setSidebarVisible(false);
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [sidebarVisible]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="text-white text-lg" size={20} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">WordWise</h1>
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bookmark className="text-gray-600" size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className={`max-w-4xl mx-auto px-4 py-8 pb-20 md:pb-8 transition-all duration-300 ${sidebarVisible ? 'md:ml-20' : 'md:ml-4'}`}>
        {currentView === "search" && (
          <>
            {/* Search Section */}
            <section className="mb-8">
              <WordSearch onWordSelect={handleWordSelect} />
            </section>

            {/* Word Definition */}
            {selectedWord && (
              <WordDefinition 
                word={selectedWord} 
                initialData={wordData}
                onWordSelect={handleWordSelect}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite(selectedWord)}
              />
            )}

            {/* Recent Searches */}
            <RecentSearches onWordSelect={handleWordSelect} />
          </>
        )}

        {currentView === "favorites" && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Favorite Words</h2>
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No favorite words yet</p>
                <p className="text-gray-400">Search for words and add them to favorites</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {favorites.map((word) => (
                  <button
                    key={word}
                    onClick={() => handleWordSelect(word)}
                    className="p-3 bg-surface rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all text-left"
                  >
                    <span className="text-gray-800 font-medium block truncate">{word}</span>
                    <Heart className="w-4 h-4 text-red-500 mt-1" />
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {currentView === "history" && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Search History</h2>
            <RecentSearches onWordSelect={handleWordSelect} />
          </section>
        )}
      </main>

      {/* Left Sidebar Navigation */}
      <nav className={`fixed left-0 top-1/2 transform -translate-y-1/2 bg-surface border border-gray-200 rounded-r-xl shadow-lg z-50 transition-all duration-300 ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col">
          <button 
            onClick={() => setCurrentView("search")}
            className={`flex flex-col items-center py-4 px-3 ${currentView === "search" ? "text-primary bg-blue-50" : "text-gray-500"} hover:bg-gray-50 transition-colors border-b border-gray-200`}
            title="Search"
          >
            <Search className="w-6 h-6 mb-1" />
            <span className="text-xs">Search</span>
          </button>
          <button 
            onClick={() => setCurrentView("favorites")}
            className={`flex flex-col items-center py-4 px-3 ${currentView === "favorites" ? "text-primary bg-blue-50" : "text-gray-500"} hover:bg-gray-50 transition-colors border-b border-gray-200`}
            title="Favorites"
          >
            <Heart className="w-6 h-6 mb-1" />
            <span className="text-xs">Favorites</span>
          </button>
          <button 
            onClick={() => setCurrentView("history")}
            className={`flex flex-col items-center py-4 px-3 ${currentView === "history" ? "text-primary bg-blue-50" : "text-gray-500"} hover:bg-gray-50 transition-colors`}
            title="History"
          >
            <Clock className="w-6 h-6 mb-1" />
            <span className="text-xs">History</span>
          </button>
        </div>
        
        {/* Swipe handle */}
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-primary text-white w-6 h-12 rounded-r-md flex items-center justify-center hover:bg-blue-600 transition-colors"
          title={sidebarVisible ? "Hide navigation" : "Show navigation"}
        >
          <div className={`transform transition-transform duration-300 ${sidebarVisible ? 'rotate-180' : ''}`}>
            ▶
          </div>
        </button>
      </nav>

      {/* Always visible toggle button when sidebar is hidden */}
      {!sidebarVisible && (
        <button 
          onClick={toggleSidebar}
          className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-primary text-white w-6 h-12 rounded-r-md flex items-center justify-center hover:bg-blue-600 transition-colors z-50"
          title="Show navigation"
        >
          <div>▶</div>
        </button>
      )}


    </div>
  );
}
