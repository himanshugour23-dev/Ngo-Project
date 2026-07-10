"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Heart } from "lucide-react";
// import HomeNav from "@/components/HomeNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import HomeNav from "@/components/HomeNav";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import LoginStatusMessage from "./LoginStatusMessage";
import { Suspense } from "react";
export default function LoginPage() {
const router = useRouter();
const [password, setPassword] = useState("");
const [email, setEmail] = useState("");
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
  const { data, error } = await authClient.signIn.email({
    email,
    password,
  });
  if (error) {
    toast.error(error.message);
    return;
  }
  toast.success("Logged in successfully!");
  console.log("Login successful:", data);
  router.push("/user/profilePage");
} catch (err) {
  console.error(err);
  toast.error("Something went wrong");
} finally {
  setLoading(false);
}

};

return (
  
      <div
      className="min-h-screen flex"
      style={{
      background: "#faf8f4",
      fontFamily: "'Nunito', sans-serif",
      }}
      >
      <HomeNav/>

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
        Welcome back
      </h1>

      <p className="mt-2 text-[#6b7e6d]">
  Sign in to your ngoSupport account as Volunteer
      </p>

      <div className="mt-5">
        <Suspense fallback={null}>
          <LoginStatusMessage />
        </Suspense>
      </div>

      <form
        onSubmit={handleLogin}
        className="mt-6 space-y-4"
      >
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
            background:
              "linear-gradient(135deg,#2d6a4f 0%,#1b4332 100%)",
          }}
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <p className="text-center mt-6">
        New here?{" "}
        <Link
          href="/signup"
          className="font-bold text-[#2d6a4f]"
        >
          Create Account
        </Link>
      </p>
    </div>
  </div>
</div>
);
}