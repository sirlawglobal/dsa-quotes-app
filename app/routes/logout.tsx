import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { authTokenCookie } from "../services/authService";

export const action: ActionFunction = async () => {
  // Clear the cookie
  return redirect("/auth/login", {
    headers: {
      "Set-Cookie": await authTokenCookie.serialize("", { maxAge: 0 }),
    },
  });
};

export const loader = async () => redirect("/");

export default function Logout() {
  return null;
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white border border-red-200 rounded-lg p-8 shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-700 mb-2">
          We couldn&apos;t log you out. Please try again.
        </p>
        <pre className="text-xs text-red-400 bg-red-50 rounded p-2 overflow-x-auto">
          {error.message}
        </pre>
      </div>
    </div>
  );
}
