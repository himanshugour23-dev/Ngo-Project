import { useRef } from "react";
import {Button} from '@/components/ui/button'
import { UserProfileData } from "@/app/user/profilePage/page";
import {toast} from "sonner"
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
interface UserProfileProps {
  profile: UserProfileData | null;
  setProfile: React.Dispatch<
    React.SetStateAction<UserProfileData | null>
  >;
  isEditing: boolean;
  saving: boolean;
  setIsEditing: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setSaving: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  originalProfile: UserProfileData | null;
  setOriginalProfile: React.Dispatch<
    React.SetStateAction<UserProfileData | null>
  >;
}
export default function UserProfile( {profile,setProfile,isEditing,saving,setSaving,setIsEditing,originalProfile,setOriginalProfile,
}: UserProfileProps)  {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const handleLogout = async () => {
      await authClient.signOut()
       router.push("/login");
  }
const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    "/api/user/upload-img",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    toast.error(
      data.message ||
      "Something went wrong while uploading image"
    );
    return;
  }

  setProfile((prev) =>
    prev
      ? {
          ...prev,
          image: data.imageUrl,
        }
      : prev
  );

  toast.success(
    "Image uploaded successfully!"
  );
};
  return (
      <div>
    <section className="bg-gradient-to-r from-[#fff8f0] to-[#fffdf9] text-white text-white">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">

        {/* Left Side */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
  src={
    profile?.image ||
          "https://thumbs.dreamstime.com/b/gray-circle-user-icon-profile-avatar-simple-symbol-358262950.jpg"
        }
        alt="Profile"
        width={128}
        height={128}
        className="w-32 h-32 rounded-full border-4 border-white object-cover cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      />

          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-black">{profile?.name}</h1>

            <p className="text-orange-300">
              Volunteer • {profile?.category}
            </p>

            <div className="flex gap-4 mt-3 justify-center md:justify-start">
              
              <div>
                <p className="font-bold text-xl text-[#dc851a]">{profile?.taskCompleted}</p>
                <p className="text-sm text-shadow-black text-[#dc851a]">TaskCompleted</p>
              </div>
            </div>
               <div>
                <p className=" flex justify-center items-center px-2 py-1 text-sm  text-black bg-gray-200 rounded-2xl border-2 border-gray-400 ">
                  {profile?.isActive ? "Active" : "Inactive"} </p>
              </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex gap-4 items-center pb-15">
          <Button
  disabled={saving}
  onClick={async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(
        `/api/user/${profile?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: profile?.name,
            bio: profile?.bio,
            skills: profile?.skills,
            preferredCategories:
              profile?.preferredCategories,
            isActive: profile?.isActive,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Update failed"
        );
      }

      toast.success(
        "Profile updated successfully"
      );

      setOriginalProfile(profile);
      setIsEditing(false);
    } catch (error: any) {
      toast.error(
        error.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  }}
>
  {saving
    ? "Saving..."
    : isEditing
    ? "Save Changes"
    : "Edit Profile"}
</Button>
    {isEditing && (
    <Button  
    className='text-black'
      variant="outline"
      disabled={saving}
      onClick={() => {
        setProfile(originalProfile);
        setIsEditing(false);
      }}
    >
      Cancel
    </Button>
  )}
   <Button
  variant="outline"
  className="w-20 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
  onClick={handleLogout}
>
  Logout
</Button>
</div>
      
      </div>
    </section>
    <input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  className="hidden"
  onChange={handleImageUpload}
/>
    </div>
  );
}
