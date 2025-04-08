"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { collegeList } from "@/content/collegeList";
import {
  FiUser,
  FiLock,
  FiMail,
  FiBook,
  FiAward,
  FiLink,
} from "react-icons/fi";

const researchInterests = [
  "Computer Science",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Biology",
  "Chemistry",
  "Physics",
  "Engineering",
  "Mathematics",
  "Environmental Science",
];

export default function SignupPage() {
  const router = useRouter();

  const [userType, setUserType] = useState<"student" | "professor">("student");
  const [formData, setFormData] = useState({
    userType: "student",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    collegeName: "",
    graduationYear: "",
    cgpa: "",
    position: "",
    googleScholar: "",
    otherLinks: "",
    interests: [] as string[],
  });

  // keep formData.userType in sync
  useEffect(() => {
    setFormData((prev) => ({ ...prev, userType }));
  }, [userType]);

  // college search dropdown
  const [collegeSearch, setCollegeSearch] = useState("");
  const [filteredColleges, setFilteredColleges] = useState(collegeList);
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const collegeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!collegeSearch.trim()) {
      setFilteredColleges(collegeList);
    } else {
      setFilteredColleges(
        collegeList.filter((c) =>
          c.toLowerCase().includes(collegeSearch.toLowerCase())
        )
      );
    }
  }, [collegeSearch]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        collegeDropdownRef.current &&
        !collegeDropdownRef.current.contains(e.target as Node)
      ) {
        setShowCollegeDropdown(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // enable/disable submit
  useEffect(() => {
    const required = [
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword,
      formData.collegeName,
      ...(userType === "student"
        ? [formData.graduationYear, formData.cgpa]
        : [formData.position]),
    ];
    setButtonDisabled(!required.every(Boolean));
  }, [formData, userType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/users/signup", formData);
      toast.success("Registration successful!");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center overflow-hidden text-black"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1564910443496-5fd2d76b47fa?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
      }}
    >
      <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to Research Connect
          </h1>
          <p className="text-gray-600">Create your academic profile</p>
        </div>

        <div className="flex gap-4 mb-8 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setUserType("student")}
            className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
              userType === "student"
                ? "bg-green-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setUserType("professor")}
            className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
              userType === "professor"
                ? "bg-green-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Professor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* name + college */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-400"
                value={formData.name}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>

            <div className="relative" ref={collegeDropdownRef}>
              <FiBook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search College"
                className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-400"
                value={collegeSearch}
                onChange={(e) => {
                  setCollegeSearch(e.target.value);
                  setShowCollegeDropdown(true);
                }}
                onFocus={() => setShowCollegeDropdown(true)}
              />
              {showCollegeDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredColleges.length > 0 ? (
                    filteredColleges.map((college, i) => (
                      <div
                        key={i}
                        className="p-3 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setFormData((f) => ({
                            ...f,
                            collegeName: college,
                          }));
                          setCollegeSearch(college);
                          setShowCollegeDropdown(false);
                        }}
                      >
                        {college}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-gray-500">No colleges found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* student vs professor fields */}
          {userType === "student" ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <FiAward className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  placeholder="Graduation Year"
                  className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-400"
                  value={formData.graduationYear}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      graduationYear: e.target.value,
                    }))
                  }
                  min={2000}
                  max={2050}
                />
              </div>
              <input
                type="number"
                step="0.01"
                placeholder="CGPA"
                className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-400"
                value={formData.cgpa}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, cgpa: e.target.value }))
                }
                min={0}
                max={10}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Position/Role"
                  className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-400"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, position: e.target.value }))
                  }
                />
              </div>
              <div className="relative">
                <FiLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  placeholder="Google Scholar Link"
                  className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-400"
                  value={formData.googleScholar}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      googleScholar: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          )}

          {/* research interests */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700 flex items-center gap-2">
              <FiBook className="text-green-600" />
              Research Interests
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {researchInterests.map((interest) => (
                <label
                  key={interest}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg"
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                    checked={formData.interests.includes(interest)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...formData.interests, interest]
                        : formData.interests.filter((i) => i !== interest);
                      setFormData((f) => ({ ...f, interests: next }));
                    }}
                  />
                  <span className="text-gray-600">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          {/* email + passwords */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-400"
                value={formData.email}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, email: e.target.value }))
                }
                required
              />
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-400"
                value={formData.password}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, password: e.target.value }))
                }
                required
                minLength={8}
              />
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-400"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    confirmPassword: e.target.value,
                  }))
                }
                required
                minLength={8}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={buttonDisabled || loading}
            className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all ${
              buttonDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 shadow-sm"
            }`}
          >
            {loading ? "Registering..." : "Create Account"}
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-green-600 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
