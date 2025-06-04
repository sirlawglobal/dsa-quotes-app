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
