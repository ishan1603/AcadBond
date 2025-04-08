// helpers/getDataFromToken.ts
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export interface TokenData {
  id: string;
  email: string;
  userType: "student" | "professor";
}

export default function getDataFromToken(request: NextRequest): TokenData {
  try {
    const token = request.cookies.get("token")?.value || "";
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as TokenData;
    return decoded;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
