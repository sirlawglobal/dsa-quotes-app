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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {quotes.map((quote) => (
        <div
          key={quote.id}
          className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <blockquote className="text-base italic text-gray-700 mb-2">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <p className="text-right text-sm text-gray-600 mb-2">
                — {quote.author}
              </p>
              <div className="flex flex-wrap gap-1">
                {quote.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-3 flex space-x-2">
              <Link
                to={`/quotes/${quote.id}/edit`}
                className="flex-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(quote.id)}
                disabled={deletingId === quote.id}
                className="flex-1 px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
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
