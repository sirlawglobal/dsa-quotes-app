import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import RandomQuote from "~/components/RandomQuote";
import { quoteService } from "~/services/quoteService";

export const meta: MetaFunction = () => {
  return [
    { title: "Random Quotes" },
    { name: "description", content: "Get inspired with random quotes" },
  ];
};

export async function loader() {
  const quote = await quoteService.getRandomQuote();
  return { quote: quote.data };
}

export default function Index() {
  const { quote } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Random Quotes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover inspiring quotes from great minds. Click the button below
            to get a new quote.
          </p>
          <Link
            to="/quotes"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            View All Quotes
          </Link>
        </header>

        <main className="max-w-4xl mx-auto">
          <RandomQuote quote={quote} />
        </main>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Built with Remix and Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}
