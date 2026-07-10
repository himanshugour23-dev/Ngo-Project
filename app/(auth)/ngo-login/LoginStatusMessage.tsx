"use client";
import { useSearchParams } from "next/navigation";
const SUCCESS = {
  email_verified:
    "Your email has been verified successfully. You can now sign in.",
  already_verified: "Your email is already verified.",
};
const ERROR = {
  server_error: "Something went wrong. Please try again later.",
  user_not_found: "NGO account not found.",
  token_expired: "Verification link has expired.",
  invalid_token: "Invalid verification link.",
};

export default function LoginStatusMessage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const error = searchParams.get("error");
  if (!message && !error) return null;
  const text =
    (message && SUCCESS[message as keyof typeof SUCCESS]) ||
    (error && ERROR[error as keyof typeof ERROR]);
  if (!text) return null;
  return (
    <div
      className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium ${
        message
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {text}
    </div>
  );
}