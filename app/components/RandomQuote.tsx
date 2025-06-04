import { useState, useEffect } from "react";
import { quoteService, Quote } from "~/services/quoteService";

interface RandomQuoteProps {
  quote: Quote | null;
}

export default function RandomQuote({ quote }: Readonly<RandomQuoteProps>) {
  const [newQuote, setNewQuote] = useState<Quote | null>(quote ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRandomQuote = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await quoteService.getRandomQuote();
      setNewQuote(response.data);
    } catch (err) {
      setError("Failed to fetch quote");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRandomQuote();
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (quote) {
      setNewQuote(quote);
    }
  }, [quote]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
        <p className="text-red-600 mb-2">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      {newQuote && (
        <div
          className={`transition-opacity duration-200 ${
            isRefreshing ? "opacity-50" : "opacity-100"
          }`}
        >
          <div className="p-6">
            <div className="relative">
              <div className="absolute -top-2 -left-2 text-4xl text-blue-100">
                &quot;
              </div>
              <blockquote className="text-xl italic text-gray-700 mb-3 pl-6">
                {newQuote.text}
              </blockquote>
              <div className="absolute -bottom-2 -right-2 text-4xl text-blue-100 transform rotate-180">
                &quot;
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-wrap gap-1">
                {newQuote.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-right text-gray-600 text-sm font-medium">
                — {newQuote.author}
              </p>
            </div>
          </div>

          <div className="px-6 pb-6">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isRefreshing ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "Get New Quote"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
