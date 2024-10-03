import { NextResponse } from "next/server";

import { generateToken, generateVerificationToken } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import { connect } from "@/lib/mongodb";
import { registerSchema } from "@/lib/validation";
import User from "@/model/User";

export async function POST(request: Request) {
  try {
    await connect();

    const body = await request.json();
    const validatedData = registerSchema.parse(body);
    const { name, email, password, role } = validatedData;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    const verificationToken = generateVerificationToken();
    const user = new User({ name, email, password, role, verificationToken });
    await user.save();

    const token = generateToken(user._id);

    await sendVerificationEmail(email, verificationToken);

    console.log(User.name, "User registered successfully");
    return NextResponse.json(
      { message: "User registered successfully", token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Error registering user" },
      { status: 500 }
    );
  }
}
