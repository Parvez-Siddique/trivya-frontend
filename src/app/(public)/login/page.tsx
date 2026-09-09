
"use client";

import { Lock, Eye, EyeOff, User, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/(public)/login/action";

export default function LoginSection() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    // Clear error when user starts typing again
    if (error) {
      setError("");
    }
  };

  const signInUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!formData.username.trim()) {
      setError("Please enter your username.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser(formData);

      if (!response.success) {
        setError(response.error || "Invalid username or password.");
        return;
      }

      router.push("/product");

    } catch (error) {
      console.error("Login error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while logging in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full bg-[#f8f5ef] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold tracking-wide text-[#25351f]">
            Trivya
          </h1>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-8 md:p-10">

          <form onSubmit={signInUser}>

            {/* Username */}
            <div className="mb-5">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                User Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  disabled={loading}
                  className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-[#526b48] focus:bg-white disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-12 text-sm outline-none transition focus:border-[#526b48] focus:bg-white disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="mt-3 text-sm text-red-500">
                {error}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer mt-5 w-full h-12 rounded-xl bg-[#25351f] text-white text-sm font-medium transition hover:bg-[#34482d] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>

        </div>

        {/* Bottom text */}
        <p className="text-center text-xs text-gray-400 mt-7">
          © 2026 Trivya. All rights reserved.
        </p>

      </div>
    </section>
  );
}