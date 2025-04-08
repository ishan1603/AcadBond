// app/api/users/dashboard/route.ts
import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import ResearchPaper from "@/models/researchPaperModel";
import getDataFromToken, { TokenData } from "@/helpers/getDataFromToken";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication with proper typing
    const tokenData: TokenData = await getDataFromToken(request);

    if (tokenData.userType !== "student") {
      return NextResponse.json(
        { success: false, error: "Students only access" },
        { status: 403 }
      );
    }

    // Rest of your code remains the same
    const papers = await ResearchPaper.find({}).select("title topics").lean();

    return NextResponse.json({
      success: true,
      data: papers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
