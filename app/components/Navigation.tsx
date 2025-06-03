import { Link, useLocation } from "@remix-run/react";

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`text-lg font-medium ${
                isActive("/")
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Random Quote
            </Link>
            <Link
              to="/quotes"
              className={`text-lg font-medium ${
                isActive("/quotes")
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              All Quotes
            </Link>
          </div>
          <Link
            to="/quotes/new"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add New Quote
          </Link>
        </div>
      </div>
    </nav>
  );
}
