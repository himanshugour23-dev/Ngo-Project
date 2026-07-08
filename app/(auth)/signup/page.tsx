"use client";
import { useState } from "react";
import Link from "next/link";
import {Eye,EyeOff,Heart,CheckCircle2,} from "lucide-react";
import AuthHero from "@/components/AuthHero";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import {Input} from "@/components/ui/input"
export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
    });
    if (error) {
      console.log(error.message,"error  while signing up ");
      return;
    }
    const res = await fetch("/api/user/send-verification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    toast.warning(
      "Account created, but verification email could not be sent."
    );
    return;
  }

  toast.success(
    "Account created! Verification email has been sent."
  );
  };
  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "#faf8f4",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <AuthHero />
      <div className="flex-1 flex justify-center items-center px-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "#d4890a" }}
            >
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#2d6a4f",
                fontWeight: 700,
              }}
              
            >
              <Link
              href="/">
              ngoSupport
              </Link>
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.85rem",
              fontWeight: 700,
              color: "#1c2b1e",
            }}
          >
            Register as volunteer
          </h1>
          <p className="mt-2 text-[#6b7e6d]">
            Create your account and start making impact
          </p>
          <form
            onSubmit={handleSignUp}
            className="mt-8 space-y-4"
          >
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full p-3 rounded-xl border"
              required
            />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full p-3 rounded-xl border"
              required
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 rounded-xl border pr-12"
                required
              />
              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>

            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm Password"
                className="w-full p-3 rounded-xl border pr-12"
                required
              />

              <Button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showConfirm ? <EyeOff /> : <Eye />}
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} />
                At least 8 characters
              </div>

              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} />
                Contains a number
              </div>

              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} />
                Contains uppercase letter
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold"
              style={{
                background:
                  "linear-gradient(135deg,#2d6a4f 0%,#1b4332 100%)",
              }}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#2d6a4f]"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}