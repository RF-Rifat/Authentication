/* eslint-disable @typescript-eslint/ban-ts-comment */
import { connect } from "@/lib/mongodb";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  console.log("token",token)
  if (!token) {
    return NextResponse.json({ message: "Invalid token" }, { status: 400 });
  }

  try {
    await connect();

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    user.isEmailVerified = true;
    //@ts-ignore
    user.verificationToken = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { message: "Error verifying email" },
      { status: 500 }
    );
  }
}
