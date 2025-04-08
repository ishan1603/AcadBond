// app/profile/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Mail,
  Building,
  User,
  BookOpen,
  Calendar,
  Award,
  Link2,
  LogOut,
} from "lucide-react";

interface UserData {
  name?: string;
  email?: string;
  userType?: "student" | "professor";
  collegeName?: string;
  graduationYear?: number;
  cgpa?: number;
  position?: string;
  googleScholar?: string;
  otherLinks?: string[];
  interests?: string[];
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
  isLink?: boolean;
  capitalize?: boolean;
}

const InfoItem = ({
  icon,
  label,
  value,
  isLink,
  capitalize,
}: InfoItemProps) => (
  <div className="flex items-start space-x-3">
    <span className="text-green-500 mt-1">{icon}</span>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      {isLink && value ? (
        <a
          href={value.toString()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className={`text-gray-900 ${capitalize ? "capitalize" : ""}`}>
          {value || "N/A"}
        </p>
      )}
    </div>
  </div>
);

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user data...");
        const response = await fetch("/api/users/me", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        console.log("Response status:", response.status);

        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON response:", text.slice(0, 100));
          throw new Error(`Invalid response: ${text.slice(0, 100)}`);
        }

        const data = await response.json();
        console.log("Response data:", data);

        if (!response.ok) {
          console.error("Error in response:", data.error);
          throw new Error(data.error || "Failed to fetch user");
        }

        setUser(data.data);
      } catch (err: any) {
        console.error("Error fetching user:", err);
        setError(err.message);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/users/logout", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        router.push("/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
      setError("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center p-4 max-w-md">
          {error} - Redirecting to login...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-200 flex items-center justify-center">
      <div className="max-w-3xl mx-auto w-full">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          {/* Profile Header with Logout Button */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 relative">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-20 w-20 rounded-full bg-green-600 flex items-center justify-center shadow-lg">
                  <User className="h-10 w-10 text-green-100" />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {user?.name || "No Name"}
                </h1>
                <p className="text-green-100 flex items-center text-sm md:text-base">
                  <Building className="h-5 w-5 mr-2" />
                  {user?.collegeName || "No college specified"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="absolute top-6 right-6 flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              {isLoggingOut ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">Logout</span>
                </>
              )}
            </button>
          </div>

          {/* Profile Content */}
          <div className="p-6 space-y-8">
            {/* Basic Information Section */}
            <section className="space-y-6">
              <div className="flex items-center pb-2 border-b-2 border-green-100">
                <User className="h-6 w-6 mr-2 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Basic Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  icon={<Mail className="h-6 w-6" />}
                  label="Email"
                  value={user?.email}
                />
                <InfoItem
                  icon={<GraduationCap className="h-6 w-6" />}
                  label="Role"
                  value={user?.userType}
                  capitalize
                />
              </div>
            </section>

            {/* Conditional Sections */}
            {user?.userType === "student" ? (
              <section className="space-y-6">
                <div className="flex items-center pb-2 border-b-2 border-green-100">
                  <BookOpen className="h-6 w-6 mr-2 text-green-500" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Academic Details
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem
                    icon={<Calendar className="h-6 w-6" />}
                    label="Graduation Year"
                    value={user?.graduationYear}
                  />
                  <InfoItem
                    icon={<Award className="h-6 w-6" />}
                    label="CGPA"
                    value={user?.cgpa?.toFixed(2)}
                  />
                </div>
              </section>
            ) : (
              user?.userType === "professor" && (
                <section className="space-y-6">
                  <div className="flex items-center pb-2 border-b-2 border-green-100">
                    <Award className="h-6 w-6 mr-2 text-green-500" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Professional Details
                    </h2>
                  </div>
                  <div className="space-y-6">
                    <InfoItem
                      icon={<User className="h-6 w-6" />}
                      label="Position"
                      value={user?.position}
                    />
                    <InfoItem
                      icon={<Link2 className="h-6 w-6" />}
                      label="Google Scholar"
                      value={user?.googleScholar}
                      isLink
                    />
                    {user?.otherLinks?.map((link, index) => (
                      <InfoItem
                        key={index}
                        icon={<Link2 className="h-6 w-6" />}
                        label={`Link ${index + 1}`}
                        value={link}
                        isLink
                      />
                    ))}
                  </div>
                </section>
              )
            )}

            {/* Interests Section */}
            {user?.interests && user.interests.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center pb-2 border-b-2 border-green-100">
                  <BookOpen className="h-6 w-6 mr-2 text-green-500" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Interests
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {user.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-green-50 text-green-800 rounded-full text-sm font-medium transition-all hover:bg-green-100 hover:scale-105"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
