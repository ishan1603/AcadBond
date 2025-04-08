// app/api/users/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import connectDB from "@/dbConfig/dbConfig";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    console.log("Attempting to connect to DB...");
    await connectDB();
    console.log("DB connected successfully");

    // Get token from cookies
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;
    console.log("Token from cookies:", token ? "exists" : "missing");

    if (!token) {
      console.log("No token found in cookies");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    console.log("Verifying JWT...");
    if (!process.env.TOKEN_SECRET) {
      console.error("TOKEN_SECRET is not defined");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }
    // Verify JWT
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET) as {
      id: string;
    };
    console.log("JWT decoded successfully, user ID:", decoded.id);

    // Find user in database
    console.log("Searching for user in DB...");
    const user = await User.findById(decoded.id).select(
      "-password -isAdmin -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry"
    );

    if (!user) {
      console.log("User not found in database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User found, preparing response...");
    // Structure response data
    const userData = {
      name: user.name,
      email: user.email,
      userType: user.userType,
      collegeName: user.collegeName,
      graduationYear: user.graduationYear,
      cgpa: user.cgpa,
      position: user.position,
      googleScholar: user.googleScholar,
      otherLinks: user.otherLinks,
      interests: user.interests,
    };

    return NextResponse.json({ data: userData });
  } catch (error: any) {
    console.error("Error in /api/users/me:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
