"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
    } catch (error: any) {
      setError(true);
      console.error("Verification error:", error.response?.data);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1564910443496-5fd2d76b47fa?q=80&w=1935&auto=format&fit=crop')] px-4">
      <div className="bg-white bg-opacity-90 shadow-xl rounded-3xl p-10 max-w-md w-full text-center">
        {verified ? (
          <>
            <h2 className="text-3xl font-semibold text-green-600 mb-3">
              Email Verified
            </h2>
            <p className="text-gray-700 mb-6">
              Your email has been successfully verified. You can now sign in.
            </p>
            <Link
              href="/login"
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition duration-200 font-medium"
            >
              Go to Login
            </Link>
          </>
        ) : error ? (
          <>
            <h2 className="text-2xl font-semibold text-red-600 mb-3">
              Verification Failed
            </h2>
            <p className="text-gray-700 mb-6">
              Something went wrong while verifying your email. Try again or
              contact support.
            </p>
            <Link
              href="/login"
              className="inline-block bg-gray-600 text-white px-6 py-2 rounded-xl hover:bg-gray-700 transition duration-200 font-medium"
            >
              Back to Login
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-xl font-medium text-gray-800">
              Verifying your email...
            </h2>
          </>
        )}
      </div>
    </div>
  );
}
