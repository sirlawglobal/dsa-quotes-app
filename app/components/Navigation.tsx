import { Link, useLocation, Form, json } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authTokenCookie } from "~/services/authService";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const token = await authTokenCookie.parse(cookieHeader);

  return json({ hasToken: !!token });
}

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Q
              </span>
              <span className="text-lg font-medium text-gray-800">Quotes</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`text-base font-medium px-3 py-2 rounded-md ${
                  isActive("/")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Random Quote
              </Link>
              <Link
                to="/quotes"
                className={`text-base font-medium px-3 py-2 rounded-md ${
                  isActive("/quotes")
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                All Quotes
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/quotes/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Quote
            </Link>
            <Link
              to="/auth/login"
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-blue-700 text-sm font-medium rounded-md shadow-sm hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </Link>
            <Form method="post" action="/logout">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </Form>
          </div>
        </div>
      </div>
    </nav>
  );
}
