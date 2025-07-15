import { useQuery } from "@tanstack/react-query";
import type { SearchHistory } from "@shared/schema";

interface RecentSearchesProps {
  onWordSelect: (word: string) => void;
}

export default function RecentSearches({ onWordSelect }: RecentSearchesProps) {
  const { data: recentSearches = [] } = useQuery<SearchHistory[]>({
    queryKey: ["/api/recent-searches"],
  });

  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Searches</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {recentSearches.map((search) => (
          <button
            key={search.id}
            onClick={() => onWordSelect(search.word)}
            className="p-3 bg-surface rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all text-left"
          >
            <span className="text-gray-800 font-medium block truncate">{search.word}</span>
            {search.partOfSpeech && (
              <span className="text-gray-500 text-sm block">{search.partOfSpeech}</span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
