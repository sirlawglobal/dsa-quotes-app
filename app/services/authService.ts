import { createCookie } from "@remix-run/node";

export const authTokenCookie = createCookie("auth_token", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
});

const API_BASE_URL = 'https://dsa-basic-api.onrender.com';
export async function register({ username, email, password }: { username: string; email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message ?? "Registration failed");
    }
    return data;
}

export async function login({ email, password }: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message ?? "Login failed");
    }
    return data;
} 