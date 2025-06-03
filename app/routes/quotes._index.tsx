import { useState } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import QuoteList from "~/components/QuoteList";
import { quoteService } from "~/services/quoteService";

export async function loader() {
  const quotes = await quoteService.getAllQuotes();
  return json({ quotes: quotes.data });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const id = formData.get("id") as string;
  const intent = formData.get("intent") as string;

  if (intent === "delete") {
    await quoteService.deleteQuote(id);
    return json({ success: true });
  }

  return json({ success: false });
}

export default function QuotesIndex() {
  const { quotes } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const formData = new FormData();
      formData.append("id", id);
      formData.append("intent", "delete");

      const response = await fetch("/quotes", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        navigate("/quotes", { replace: true });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">All Quotes</h1>
          <p className="text-xl text-gray-600">
            Browse and manage your collection of quotes
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-end">
            <a
              href="/quotes/new"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add New Quote
            </a>
          </div>

          <QuoteList
            quotes={quotes}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </main>
      </div>
    </div>
  );
}
