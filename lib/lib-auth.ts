import jwt from "'jsonwebtoken'";
import crypto from "'crypto'";
import { NextApiRequest } from "'next'";

const JWT_SECRET = process.env.JWT_SECRET || "'your-secret-key'";

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "'1d'" });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
}

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("'hex'");
}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("'hex'");
}

export function getTokenFromRequest(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("'Bearer '")) {
    return authHeader.substring(7);
  }
  return null;
}