import { Form, json, useActionData, useNavigation } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { authTokenCookie, login as loginUser } from "../services/authService";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const user = await loginUser({ email, password });
    // Add token to cookies
    const token = user.data.token;
    if (token) {
      return json(
        { success: true, ...user },
        { headers: { "Set-Cookie": await authTokenCookie.serialize(token) } }
      );
    }
    return { success: true, ...user };
  } catch (error: unknown) {
    const err = error as { message?: string };
    return { error: err.message ?? "Login failed" };
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      {/* Left: Form */}
      <div className="flex-1 flex max-w-2xl flex-col justify-center px-12 py-10">
        <div className="flex flex-col items-center mb-8">
          {/* Logo Placeholder */}
          <div className="w-16 h-16 mb-6 flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center"></div>
          </div>
        </div>
        <Form method="post" className="w-full max-w-xs mx-auto px-10">
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-[11px] font-semibold text-gray-500 tracking-widest mb-1 uppercase"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-base placeholder-gray-400 px-0 py-2 mb-6"
              placeholder="arjunmakwana@gmail.com"
            />
            <label
              htmlFor="password"
              className="block text-[11px] font-semibold text-gray-500 tracking-widest mb-1 uppercase"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-base placeholder-gray-400 px-0 py-2"
              placeholder="***********"
            />
          </div>
          {actionData?.error && (
            <div className="rounded bg-red-50 p-2 mb-4">
              <div className="text-xs text-red-700">{actionData.error}</div>
            </div>
          )}
          <div className="flex gap-3 mb-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 text-sm font-semibold text-white transition disabled:opacity-50 shadow-none bg-blue-500"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
            <a
              href="/auth/register"
              className="flex-1 py-2 text-sm font-semibold text-blue-600 border border-blue-400 bg-white hover:bg-blue-50 text-center transition shadow-none"
              style={{ borderWidth: 1 }}
            >
              Create Account
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}
