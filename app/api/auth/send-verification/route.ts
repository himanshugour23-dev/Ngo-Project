import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }
  try {
    console.log("Sending email to:", email);
    await auth.api.sendVerificationEmail({
      body: { email, callbackURL: "/login" },
    });
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Send verification error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}