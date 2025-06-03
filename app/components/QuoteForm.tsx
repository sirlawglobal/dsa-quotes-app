import { useState, useEffect } from "react";
import type { Quote } from "~/services/quoteService";

interface QuoteFormProps {
  quote?: Quote;
  onSubmit: (quote: Omit<Quote, "id">) => Promise<void>;
  isSubmitting?: boolean;
}

export default function QuoteForm({
  quote,
  onSubmit,
  isSubmitting = false,
}: Readonly<QuoteFormProps>) {
  const [formData, setFormData] = useState({
    text: quote?.text ?? "",
    author: quote?.author ?? "",
    tags: quote?.tags.join(", ") ?? "",
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (quote) {
      setFormData({
        text: quote.text,
        author: quote.author,
        tags: quote.tags.join(", "),
      });
    }
  }, [quote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      await onSubmit({
        text: formData.text,
        author: formData.author,
        tags,
      });
    } catch (err) {
      setError("Failed to save quote. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      )}

      <div>
        <label
          htmlFor="text"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Quote Text
        </label>
        <textarea
          id="text"
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter the quote text..."
        />
      </div>

      <div>
        <label
          htmlFor="author"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Author
        </label>
        <input
          type="text"
          id="author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter the author's name..."
        />
      </div>

      <div>
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter tags separated by commas..."
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : quote ? "Update Quote" : "Create Quote"}
        </button>
      </div>
    </form>
  );
}
