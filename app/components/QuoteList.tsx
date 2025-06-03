import { useState } from "react";
import { Link } from "@remix-run/react";
import type { Quote } from "~/services/quoteService";

interface QuoteListProps {
  quotes: Quote[];
  isDeleting: boolean;
  onDelete: (id: string) => Promise<void>;
}

export default function QuoteList({
  quotes,
  onDelete,
  isDeleting = false,
}: Readonly<QuoteListProps>) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {quotes.map((quote) => (
        <div
          key={quote.id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <blockquote className="text-lg italic text-gray-700 mb-3">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <p className="text-right text-gray-600">— {quote.author}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {quote.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="ml-4 flex space-x-2">
              <Link
                to={`/quotes/${quote.id}/edit`}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(quote.id)}
                disabled={deletingId === quote.id}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deletingId === quote.id && isDeleting
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
