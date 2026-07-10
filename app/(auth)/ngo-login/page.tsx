"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import HomeNav from "@/components/HomeNav";
import LoginStatusMessage from "./LoginStatusMessage";
import { Suspense } from "react";
export default function NgoLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/ngo/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
const data = await res.json();
console.log("Response:", data);
if (!res.ok) {
  if ( res.status === 401 && data.error === "First Logout as user to login as NGO"
  ) {
    toast.error(data.error);
    router.push("/profilePage");
    return;
  }

  toast.error(data.error || data.message ||"Login failed");
  return;
}
toast.success("Logged in successfully!");
console.log("Before redirect");
console.log(data.isVerified);
      if (!data.isVerified) {
        router.push("/ngo/verify-pending");
      }
      else {
        router.push("/ngo/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center px-6"
      style={{ background: "#faf8f4", fontFamily: "'Nunito', sans-serif" }}
    >
      <HomeNav/>
      <div className="w-full max-w-md">

        <div className="flex items-center gap-2 mb-8">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "#d4890a" }}
          >
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#2d6a4f",
              fontWeight: 700,
            }}
          >
            ngoSupport
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
          NGO Sign In
        </h1>

        <p className="mt-2 text-[#6b7e6d]">
          Sign in to your ngoSupport account as an Organisation
        </p>
          <div className="mt-5">
          <Suspense fallback={null}>
            <LoginStatusMessage />
          </Suspense>
        </div>
        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="NGO Email Address"
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
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold"
            style={{
              background: "linear-gradient(135deg,#2d6a4f 0%,#1b4332 100%)",
            }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <p className="text-xs text-center mt-4 text-[#6b7e6d]">
          New NGO accounts require admin verification before access is granted.
        </p>

        <p className="text-center mt-4">
          Not registered?{" "}
          <Link href="/ngo-signup" className="font-bold text-[#2d6a4f]">
            Register your NGO
          </Link>
        </p>

        <p className="text-center mt-2 text-sm text-[#6b7e6d]">
          Are you a volunteer?{" "}
          <Link href="/login" className="font-semibold text-[#d4890a]">
            Sign in here
          </Link>
        </p>

      </div>
    </div>
  );
}