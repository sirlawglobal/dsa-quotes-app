import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import Navigation from "~/components/Navigation";

import styles from "./styles.css?url";

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href={styles} />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-gray-50">
        <div className="h-full flex flex-col">
          <Navigation />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-4">
              <Outlet />
            </div>
          </main>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-gray-50">
        <div className="h-full flex flex-col items-center justify-center min-h-screen">
          <div className="bg-white border border-red-200 rounded-lg p-8 shadow-md text-center max-w-lg mx-auto mt-24">
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-700 mb-2">
              An unexpected error occurred. Please try again or contact support
              if the problem persists.
            </p>
            <pre className="text-xs text-red-400 bg-red-50 rounded p-2 overflow-x-auto mb-4">
              {error.message}
            </pre>
            <a
              href="/"
              className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go Home
            </a>
          </div>
        </div>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
