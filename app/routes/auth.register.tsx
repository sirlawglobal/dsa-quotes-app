import { useState } from "react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import {
  authTokenCookie,
  register as registerUser,
} from "../services/authService";
import { json } from "@remix-run/node";

interface PasswordStrength {
  score: number;
  feedback: string;
}

function calculatePasswordStrength(password: string): PasswordStrength {
  if (password.length < 8) {
    return { score: 0, feedback: "Password must be at least 8 characters" };
  }

  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 12) {
    score += 1;
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add uppercase letters");
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add lowercase letters");
  }

  // Number check
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add numbers");
  }

  // Special character check
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add special characters");
  }

  return {
    score,
    feedback: feedback.length > 0 ? feedback.join(", ") : "Strong password",
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const user = await registerUser({ username, email, password });
    console.log(user);
    // Auto-login after registration
    const token = user.data.token;
    if (token) {
      return json(
        { success: true, ...user },
        {
          headers: {
            "Set-Cookie": await authTokenCookie.serialize(token),
          },
        }
      );
    }
    return { error: "No token received from login." };
  } catch (error: unknown) {
    const err = error as { message?: string };
    return { error: err.message ?? "Registration failed" };
  }
};

export default function Register() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: "",
  });
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      case 4:
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

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
        <Form method="post" className="w-full max-w-xs mx-auto">
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-[11px] font-semibold text-gray-500 tracking-widest mb-1 uppercase"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="block w-full bg-transparent border-0 border-b border-gray-300 focus:border-blue-500 focus:ring-0 text-base placeholder-gray-400 px-0 py-2 mb-6"
              placeholder="Your username"
            />
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
              placeholder="your@email.com"
            />
            <label
              htmlFor="password"
              className="block text-[11px] font-semibold text-gray-500 tracking-widest mb-1 uppercase"
            >
              Password
            </label>
            <div className="flex items-center gap-2">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={handlePasswordChange}
                className="block w-full bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 text-base placeholder-gray-400 px-0 pt-2 pr-10"
                placeholder="***********"
              />
              <button
                type="button"
                tabIndex={0}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="px-2 text-gray-400 hover:text-blue-600 focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  // Eye-off SVG
                  <svg
                    width="21px"
                    height="21px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 12C4 12 5.6 7 12 7M12 7C18.4 7 20 12 20 12M12 7V4M18 5L16 7.5M6 5L8 7.5M15 13C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13C9 11.3431 10.3431 10 12 10C13.6569 10 15 11.3431 15 13Z"
                      stroke="#464455"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  // Eye SVG
                  <svg
                    width="21px"
                    height="21px"
                    viewBox="0 0 21 21"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      fill="none"
                      fillRule="evenodd"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      transform="translate(2 10)"
                    >
                      <path d="m0 .5c2.53705308 3.66666667 5.37038642 5.5 8.5 5.5 3.1296136 0 5.9629469-1.83333333 8.5-5.5" />
                      <path d="m2.5 3.423-2 2.077" />
                      <path d="m14.5 3.423 2 2.077" />
                      <path d="m10.5 6 1 2.5" />
                      <path d="m6.5 6-1 2.5" />
                    </g>
                  </svg>
                )}
              </button>
            </div>
            <div className="mt-2">
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    password
                      ? getStrengthColor(passwordStrength.score)
                      : "bg-gray-300"
                  }`}
                  style={{
                    width: password
                      ? `${(passwordStrength.score / 5) * 100}%`
                      : "0%",
                  }}
                />
              </div>
              <p
                className={`mt-1 text-xs ${
                  passwordStrength.score >= 3
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {password
                  ? passwordStrength.feedback
                  : "Password must be at least 8 characters"}
              </p>
            </div>
          </div>
          {actionData?.error && (
            <div className="rounded bg-red-50 p-2 mb-4">
              <div className="text-xs text-red-700">{actionData.error}</div>
            </div>
          )}
          <div className="flex gap-3 mb-6">
            <button
              type="submit"
              disabled={isSubmitting || passwordStrength.score < 3}
              className="flex-1 py-2 text-sm font-semibold text-white transition disabled:opacity-50 shadow-none bg-blue-500"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
            <a
              href="/auth/login"
              className="flex-1 py-2 text-sm font-semibold text-blue-600 border border-blue-400 bg-white hover:bg-blue-50 text-center transition shadow-none"
              style={{ borderWidth: 1 }}
            >
              Login
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}
