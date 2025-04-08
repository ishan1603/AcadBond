"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/users/login", user);

      if (data.success) {
        toast.success("Login successful");
        setTimeout(() => router.push("/profile"), 1500);
      }
    } catch (error: any) {
      const msg = error.response?.data?.error || "Login failed";
      toast.error(msg);
      if (error.response?.status === 400) {
        setUser({ email: "", password: "" });
      }
    } finally {
      setLoading(false);
      // Removed the forced redirect here
    }
  };
  useEffect(() => {
    setButtonDisabled(!(user.email && user.password));
  }, [user]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1564910443496-5fd2d76b47fa?q=80&w=1935&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-white/90 rounded-2xl p-8 shadow-xl backdrop-blur-sm border border-gray-200">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">
            Welcome Back{loading && "..."}
          </h1>
          <p className="text-gray-600">Please sign in to continue</p>
        </div>

        <div className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <div className="relative border border-gray-300 shadow rounded-lg">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                id="email"
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative border border-gray-300 shadow rounded-lg">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="w-full pl-10 pr-12 py-3 bg-gray-100 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div className="flex justify-end text-sm">
            <Link
              href="/forgotpassword"
              className="text-emerald-600 hover:text-emerald-700"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            onClick={onLogin}
            disabled={buttonDisabled || loading}
            className={`w-full py-3 rounded-lg font-medium text-white transition-all ${
              buttonDisabled || loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.01]"
            } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing In...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Signup link */}
          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-emerald-600 hover:text-emerald-700"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
