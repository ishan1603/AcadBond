// app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ResearchPaper {
  title: string;
  topics: string[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await fetch("/api/users/dashboard", {
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch papers");
        }

        const data = await response.json();
        setPapers(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1564910443496-5fd2d76b47fa?q=80&w=1935&auto=format&fit=crop')",
      }}
    >
      {/* Plain Green Navbar */}
      <nav className="bg-green-700 h-16 shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex space-x-6">
            <Link
              href="/dashboard"
              className="text-white hover:text-green-100 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/profile"
              className="text-white hover:text-green-100 transition-colors font-medium"
            >
              Profile
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-white">AcadBond</h1>
        </div>
      </nav>

      {/* Background Image Section */}
      <div
        className="relative min-h-[400px] bg-cover bg-center w-full h-full"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1564910443496-5fd2d76b47fa?q=80&w=1935&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Research Papers Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 -mt-48 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Research Opportunities
          </h1>

          {error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {papers.map((paper, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-green-50"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">
                      {paper.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {paper.topics.map((topic, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                    <button
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      onClick={() => {
                        /* Add functionality later */
                      }}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
