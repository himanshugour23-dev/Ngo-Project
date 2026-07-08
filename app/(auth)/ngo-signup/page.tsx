"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { Eye, EyeOff, Building2, CheckCircle2, Upload, X } from "lucide-react";
import AuthHero from "@/components/AuthHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import HomeNav from "@/components/HomeNav";
const NGO_TYPES = [
  { value: "trust", label: "Trust" },
  { value: "society", label: "Society" },
  { value: "section8", label: "Section 8 Company" },
];

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#])[A-Za-z\d@$!%*?&_#]+$/;

function PasswordChecks({ password }: { password: string }) {
  const checks = [
    { label: "At least 8 characters", pass: password.length >= 8 },
    { label: "Contains a number", pass: /\d/.test(password) },
    { label: "Contains uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", pass: /[a-z]/.test(password) },
    {
      label: "Contains special character (@$!%*?&_#)",
      pass: /[@$!%*?&_#]/.test(password),
    },
  ];
  return (
    <div className="space-y-1">
      {checks.map(({ label, pass }) => (
        <div key={label} className="flex items-center gap-2 text-sm">
          <CheckCircle2
            size={15}
            className={pass ? "text-[#2d6a4f]" : "text-gray-300"}
          />
          <span className={pass ? "text-[#2d6a4f]" : "text-gray-400"}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function NgoSignupPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [motto,setMotto] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [certFile, setCertFile] = useState<File | null>(null);

  const [ngoName, setNgoName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [eightyGNumber, setEightyGNumber] = useState("");
  const [twelveGNumber, setTwelveGNumber] = useState("");
  const [yearOfEstablishment, setYearOfEstablishment] = useState("");

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP or PDF files are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    setCertFile(file);
    e.target.value = "";
  }

  async function uploadCertificate(file: File): Promise<string> {
    const data = new FormData();
    data.append("file", file);

    const res = await fetch("/api/ngo/upload", {
      method: "POST",
      body: data,
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || json.error || "Upload failed");

    // API returns { url }
    return json.url as string;
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();

    // Client-side validation matching schema exactly
    if (ngoName.trim().length < 3) {
      toast.error("NGO name must be at least 3 characters");
      return;
    }
    if (address.trim().length < 5) {
      toast.error("Address must be at least 5 characters");
      return;
    }
    if(motto.trim().length > 300){
      toast.error("Motto must be less than 300 characters");
      return ; 
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!PASSWORD_REGEX.test(password)) {
      toast.error(
        "Password must contain uppercase, lowercase, number and special character (@$!%*?&_#)"
      );
      return;
    }
    if (!certFile) {
      toast.error("Please select your registration certificate");
      return;
    }

    // yearOfEstablishment → ISO datetime string
    let yearIso: string | undefined;
    if (yearOfEstablishment) {
      const yr = parseInt(yearOfEstablishment);
      if (isNaN(yr) || yr < 1900 || yr > new Date().getFullYear()) {
        toast.error("Please enter a valid year of establishment");
        return;
      }
      yearIso = new Date(yr, 0, 1).toISOString();
    }

    setLoading(true);
    try {
      // Step 1 — upload certificate
      let certUrl: string;
      try {
        toast.loading("Uploading certificate...", { id: "cert" });
        certUrl = await uploadCertificate(certFile);
        toast.dismiss("cert");
      } catch (err: any) {
        toast.dismiss("cert");
        toast.error(err.message || "Certificate upload failed");
        return;
      }

      // Step 2 — register NGO
      const res = await fetch("/api/ngo/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ngoName,
          email,
          password,
          Address: address,
          motto,
          city,
          type,
          registrationCertificate: certUrl,
          eightyGNumber: eightyGNumber || undefined,
          twelveGNumber: twelveGNumber || undefined,
          yearOfEstablishment: yearIso,
          latitude: 0,
          longitude: 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Signup failed");
        return;
      }

      // Step 3 — send verification email
      try {
        const verifyRes = await fetch("/api/ngo/email-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) {
          toast.warning(
            verifyData.message ||
              verifyData.error ||
              "Registered but verification email could not be sent."
          );
        } else {
          toast.success("NGO registered! Verification email sent.");
        }
      } catch {
        toast.warning("Registered but verification email could not be sent.");
      }

      router.push("/ngo-login");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#faf8f4", fontFamily: "'Nunito', sans-serif" }}
    >

          <AuthHero />
      
      <div className="flex-1 flex justify-center items-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
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
            Register your NGO
          </h1>
          <p className="mt-2 text-[#6b7e6d]">
            Join ngoSupport and connect with volunteers
          </p>

          <form onSubmit={handleSignUp} className="mt-8 space-y-4">

            <Input
              value={ngoName}
              onChange={(e) => setNgoName(e.target.value)}
              placeholder="NGO Name"
              className="w-full p-3 rounded-xl border"
              required
            />

            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Official Email Address"
              className="w-full p-3 rounded-xl border"
              required
            />

            {/* Password */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-3 rounded-xl border pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full p-3 rounded-xl border pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <PasswordChecks password={password} />

            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              className="w-full p-3 rounded-xl border"
              required
            />

            <Input
              value = {motto} 
              onChange={(e)=>setMotto(e.target.value)}
              placeholder="Motto Of your Ngo " 
              className= "w-full p-3 rounded-xl border"
              required
            />

            <Input
              value="indore"
              // onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              disabled
              className="w-full p-3 rounded-xl border"
              required
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full p-3 rounded-xl border text-sm bg-white text-[#1c2b1e]"
              style={{ borderColor: "#e2e8f0" }}
            >
              <option value="" disabled>Select NGO Type</option>
              {NGO_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>

            <Input
              type="number"
              value={yearOfEstablishment}
              onChange={(e) => setYearOfEstablishment(e.target.value)}
              placeholder="Year of Establishment (e.g. 2005)"
              min={1900}
              max={new Date().getFullYear()}
              className="w-full p-3 rounded-xl border"
            />

            <Input
              value={eightyGNumber}
              onChange={(e) => setEightyGNumber(e.target.value)}
              placeholder="80G Number (optional)"
              className="w-full p-3 rounded-xl border"
            />

            <Input
              value={twelveGNumber}
              onChange={(e) => setTwelveGNumber(e.target.value)}
              placeholder="12G Number (optional)"
              className="w-full p-3 rounded-xl border"
            />

            {/* Certificate picker */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg,application/pdf"
                className="hidden"
                onChange={handleFileSelect}
              />
              {certFile ? (
                <div className="flex items-center justify-between p-3 rounded-xl border border-green-200 bg-green-50">
                  <span className="text-sm text-[#2d6a4f] font-medium truncate mr-2">
                    ✓ {certFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCertFile(null)}
                    className="text-gray-400 hover:text-red-500 flex-shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-3 rounded-xl border border-dashed border-gray-300 flex items-center justify-center gap-2 text-sm text-[#6b7e6d] hover:border-[#2d6a4f] hover:text-[#2d6a4f] transition-colors"
                >
                  <Upload size={16} />
                  Upload Registration Certificate *
                </button>
              )}
              <p className="text-xs text-[#6b7e6d] mt-1 ml-1">
                JPG, PNG, WEBP or PDF · max 10MB
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold"
              style={{
                background: "linear-gradient(135deg,#2d6a4f 0%,#1b4332 100%)",
              }}
            >
              {loading ? "Registering..." : "Register NGO"}
            </Button>
          </form>

          <p className="text-xs text-center mt-4 text-[#6b7e6d]">
            Your account will be reviewed by an admin before access is granted.
          </p>

          <p className="text-center mt-4">
            Already registered?{" "}
            <Link href="/ngo/login" className="font-bold text-[#2d6a4f]">
              Sign In
            </Link>
          </p>

          <p className="text-center mt-2 text-sm text-[#6b7e6d]">
            Are you a volunteer?{" "}
            <Link href="/signup" className="font-semibold text-[#d4890a]">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}