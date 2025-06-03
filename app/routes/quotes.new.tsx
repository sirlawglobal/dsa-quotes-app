import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import QuoteForm from "~/components/QuoteForm";
import { quoteService } from "~/services/quoteService";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const text = formData.get("text") as string;
  const author = formData.get("author") as string;
  const tags = (formData.get("tags") as string)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const quote = await quoteService.createQuote({ text, author, tags });
  return json({ quote: quote.data });
}

export default function NewQuote() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (quote: {
    text: string;
    author: string;
    tags: string[];
  }) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("text", quote.text);
      formData.append("author", quote.author);
      formData.append("tags", quote.tags.join(", "));

      const response = await fetch("/quotes/new", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        navigate("/quotes");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Add New Quote
          </h1>
          <p className="text-xl text-gray-600">
            Share your favorite quote with the world
          </p>
        </header>

        <main className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <QuoteForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </div>
        </main>
      </div>
    </div>
  );
}
