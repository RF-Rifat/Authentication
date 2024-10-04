import { NextResponse } from "next/server";
import { generateToken } from "@/lib/auth";
import { connect } from "@/lib/mongodb";
import { loginSchema } from "@/lib/validation";
import User from "@/model/User";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await connect();

    const body = await request.json();
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;
    console.log(email, password);

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!user.isEmailVerified) {
      return NextResponse.json(
        { message: "Please verify your email before logging in" },
        { status: 401 }
      );
    }

    const token = generateToken(
      (user._id as mongoose.Types.ObjectId).toString()
    );

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Error logging in" }, { status: 500 });
  }
}
