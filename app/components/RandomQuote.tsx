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
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-xl transform transition-all duration-300 hover:shadow-2xl">
      {newQuote && (
        <div
          className={`transition-opacity duration-300 ${
            isRefreshing ? "opacity-50" : "opacity-100"
          }`}
        >
          <div className="relative">
            <div className="absolute -top-4 -left-4 text-6xl text-blue-100">
              &quot;
            </div>
            <blockquote className="text-2xl italic text-gray-700 mb-6 pl-8">
              {newQuote.text}
            </blockquote>
            <div className="absolute -bottom-4 -right-4 text-6xl text-blue-100 transform rotate-180">
              &quot;
            </div>
          </div>

          <p className="text-right text-gray-600 text-lg font-medium mb-6">
            — {newQuote.author}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {newQuote.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="w-full px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        {isRefreshing ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
  );
}
