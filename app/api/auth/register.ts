import { NextApiRequest, NextApiResponse } from "next";

import { generateToken, generateVerificationToken } from "../../../lib/auth";
import { sendVerificationEmail } from "../../../lib/email";
import { connect } from "@/lib/mongodb";
import { registerSchema } from "@/lib/validation";
import User from "@/model/User";
import mongoose from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connect();

    const validatedData = registerSchema.parse(req.body);
    const { name, email, password, role } = validatedData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const verificationToken = generateVerificationToken();
    const user = new User({ name, email, password, role, verificationToken });
    await user.save();

    const token = generateToken(
      (user._id as mongoose.Types.ObjectId).toString()
    );

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
}
