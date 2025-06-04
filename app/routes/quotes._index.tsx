import { useState } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import QuoteList from "~/components/QuoteList";
import { quoteService } from "~/services/quoteService";
import { authTokenCookie } from "~/services/authService";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const token = await authTokenCookie.parse(cookieHeader);

  if (!token) {
    return redirect("/auth/login");
  }

  const quotes = await quoteService.getAllQuotes(token);
  return json({ quotes: quotes.data, hasToken: !!token });
}

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const token = await authTokenCookie.parse(cookieHeader);

  const formData = await request.formData();
  const id = formData.get("id") as string;
  const intent = formData.get("intent") as string;

  if (intent === "delete") {
    if (!token) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      await quoteService.deleteQuote(id, token);
      return json({ success: true });
    } catch (error: unknown) {
      const err = error as { message?: string };
      return json({ error: err.message ?? "Failed to delete quote" });
    }
  }

  return json({ success: false });
}

export default function QuotesIndex() {
  const { quotes, hasToken } = useLoaderData<typeof loader>();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6">
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
            isEditable={hasToken}
          />
        </main>
      </div>
    </div>
  );
}
