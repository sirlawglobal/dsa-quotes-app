import { useState } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import QuoteForm from "~/components/QuoteForm";
import { quoteService } from "~/services/quoteService";

export async function loader({ params }: LoaderFunctionArgs) {
  const quote = await quoteService.getQuoteById(params.id!);
  return json({ quote: quote.data });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const text = formData.get("text") as string;
  const author = formData.get("author") as string;
  const tags = (formData.get("tags") as string)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const quote = await quoteService.updateQuote(params.id!, {
    text,
    author,
    tags,
  });
  return json({ quote: quote.data });
}

export default function EditQuote() {
  const { quote } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (updatedQuote: {
    text: string;
    author: string;
    tags: string[];
  }) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("text", updatedQuote.text);
      formData.append("author", updatedQuote.author);
      formData.append("tags", updatedQuote.tags.join(", "));

      const response = await fetch(`/quotes/${quote.id}/edit`, {
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Edit Quote</h1>
          <p className="text-xl text-gray-600">Update your quote details</p>
        </header>

        <main className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <QuoteForm
              quote={quote}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
