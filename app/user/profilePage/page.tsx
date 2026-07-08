'use client'
import NavBar from "@/components/NavBar";
import UserProfile from "@/components/UserProfile";
import UserDetails from "@/components/UserDetails";
import { useState , useEffect} from "react";
import {toast} from "sonner"
import { authClient } from "@/lib/auth-client";
import {useRouter} from "next/navigation";
export  interface UserProfileData {
  id: string;
  name: string;
  email: string;
  bio: string;
  skills: string[];
  preferredCategories: string[];
  isActive: boolean;
  image: string | null;
  city : string
  taskCompleted : number
  category : string[] 
}

export default function profilePage() {
  const router = useRouter();
  
   const [profile , setProfile] = useState<UserProfileData | null>(null);
  const [originalProfile, setOriginalProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
     fetchProfile() ; 
  },[])
async function fetchProfile() {
  try {
    setLoading(true);

    const res = await fetch(
      "/api/user/me"
    );

    if (!res.ok) {
      router.push("/login");
      return;
    }

    const data = await res.json();

    setProfile(data);
    setOriginalProfile(data);
  } catch (error) {
    toast.error(
      "Failed to load profile"
    );
  } finally {
    setLoading(false);
  }
}
  if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      Loading...
    </div>
  );
}
  console.log("fetchProfile");
  return (
    <div className="w-full mx-auto px-4 min-h-screen bg-gradient-to-r from-[#fff8f0] to-[#fffdf9]">
    <NavBar 
      profile={profile}
      />
    <UserProfile 
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      profile={profile}
      saving={saving}
      setSaving={setSaving}
      originalProfile={originalProfile}
      setOriginalProfile={setOriginalProfile}
      setProfile={setProfile}
     />
    <UserDetails 
           profile={profile}
          setProfile={setProfile}
          isEditing={isEditing}
          saving={saving}
          setSaving={setSaving}
          originalProfile={originalProfile}
          setOriginalProfile={setOriginalProfile}
    />
    </div>
  );
}

