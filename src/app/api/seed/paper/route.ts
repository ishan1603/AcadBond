// app/api/users/seed/papers/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/dbConfig/dbConfig";
import ResearchPaper from "@/models/researchPaperModel";
import User from "@/models/userModel";

export async function GET() {
  try {
    await connectDB();

    // Prevent accidental runs in production
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, error: "Seeding disabled in production" },
        { status: 403 }
      );
    }

    // Find a professor (must exist in database first)
    const professor = await User.findOne({ userType: "professor" });
    if (!professor) {
      return NextResponse.json(
        { success: false, error: "No professor found in database" },
        { status: 400 }
      );
    }

    // Sample papers data matching your schema
    const samplePapers = [
      {
        title: "Machine Learning in Climate Modeling",
        abstract:
          "Exploring deep learning techniques for climate prediction...",
        authors: [professor._id],
        topics: ["AI", "Climate Science", "Machine Learning"],
        publishedDate: new Date("2024-03-15"),
        journal: "Journal of Computational Science",
        doi: "10.1234/abcd.5678",
        pdfUrl: "/papers/ml-climate.pdf",
        citationCount: 25,
      },
      {
        title: "Quantum-resistant Cryptography",
        abstract:
          "Developing new cryptographic algorithms for quantum computing era...",
        authors: [professor._id],
        topics: ["Quantum Computing", "Security", "Cryptography"],
        publishedDate: new Date("2024-02-20"),
        journal: "IEEE Security Transactions",
        doi: "10.5678/efgh.9012",
        pdfUrl: "/papers/quantum-crypto.pdf",
        citationCount: 18,
      },
      {
        title: "Biodegradable Polymer Composites",
        abstract:
          "Study of sustainable materials for packaging applications...",
        authors: [professor._id],
        topics: ["Materials Science", "Sustainability", "Chemistry"],
        publishedDate: new Date("2024-01-10"),
        journal: "Advanced Materials Review",
        pdfUrl: "/papers/polymers.pdf",
      },
    ];

    // Clear existing papers and insert new ones
    await ResearchPaper.deleteMany({});
    await ResearchPaper.insertMany(samplePapers);

    return NextResponse.json({
      success: true,
      message: `${samplePapers.length} sample papers created successfully`,
      data: samplePapers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
