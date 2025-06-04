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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
              Random Quotes
            </h1>
            <p className="text-base text-gray-600 max-w-xl mx-auto mb-6">
              Discover inspiring quotes from great minds. Click the button below
              to get a new quote.
            </p>
            <Link
              to="/quotes"
              className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm"
            >
              View All Quotes
            </Link>
          </header>

          <main className="w-full max-w-2xl">
            <RandomQuote quote={quote} />
          </main>

          <footer className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Built with{" "}
              <span className="text-blue-600 font-medium">Remix</span> and{" "}
              <span className="text-blue-600 font-medium">Tailwind CSS</span>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
