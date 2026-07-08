import { useState } from 'react'
import {Button} from '@/components/ui/button'
import { Badge } from "@/components/ui/badge";
import {Input} from './ui/input'
import {Textarea} from '@/components/ui/textarea'
import {Checkbox} from "@/components/ui/checkbox"
import { Select ,SelectTrigger,SelectValue ,SelectItem ,SelectContent} from '@/components/ui/select'
import {Mail,LocationEdit} from 'lucide-react'
import { toast } from "sonner";
import  { UserProfileData } from "@/app/user/profilePage/page"
interface UserDetailsProps {
  profile: UserProfileData | null;
  setProfile: React.Dispatch<
    React.SetStateAction<UserProfileData | null>
  >;
  isEditing: boolean;
  saving: boolean;
  setSaving: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  originalProfile: UserProfileData | null;
  setOriginalProfile: React.Dispatch<
    React.SetStateAction<UserProfileData | null>
  >;
}
function userDetails({profile,setProfile,isEditing,}: UserDetailsProps) {

      const [selectedSkill, setSelectedSkill] = useState("");
      const [selectedCategory, setSelectedCategory] = useState("");
    const skills = [
  "Teaching",
  "Tutoring",
  "Mentoring",
  "Public Speaking",
  "Content Writing",
  "Communication",
  "Leadership",
  "Teamwork",
  "Event Management",
  "Volunteer Coordination",
  "Community Outreach",
  "Fundraising",
  "Crowdfunding",
  "Donor Relations",
  "Project Management",
  "Social Media Management",
  "Digital Marketing",
  "Graphic Design",
  "Photography",
  "Videography",
  "Web Development",
  "App Development",
  "UI/UX Design",
  "Data Entry",
  "Data Analysis",
  "Research",
  "Documentation",
  "Translation",
  "Counselling",
  "Mental Health Support",
  "First Aid",
  "Healthcare Assistance",
  "Blood Donation Awareness",
  "Disaster Response",
  "Relief Distribution",
  "Food Distribution",
  "Logistics Management",
  "Environmental Awareness",
  "Tree Plantation",
  "Waste Management",
  "Animal Care",
  "Animal Rescue",
  "Child Welfare Support",
  "Women Empowerment Advocacy",
  "Elderly Care",
  "Legal Awareness",
  "Human Rights Advocacy",
  "Rural Development",
  "Training & Workshops",
  "Conflict Resolution",
  "Networking",
];
const categories = [
  "Education",
  "Healthcare",
  "Environment",
  "Animal Welfare",
  "Food Distribution",
  "Disaster Relief",
  "Women Empowerment",
  "Child Welfare",
  "Elderly Care",
  "Mental Health",
  "Community Development",
  "Blood Donation",
  "Fundraising",
  "Rural Development",
  "Human Rights",
];
const [isEditingEmail, setIsEditingEmail] =
  useState(false);

const [newEmail, setNewEmail] =useState(profile?.email ?? "");
const [emailLoading, setEmailLoading] =
  useState(false);

const handleEmailChange = async () => {
  try {
    setEmailLoading(true);

    const res = await fetch(
      "/api/user/change-email/request",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          newEmail,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.error ||
          "Failed to change email"
      );
    }

    toast.success(
      "Verification email sent to your new email address"
    );

    setIsEditingEmail(false);
  } catch (error: any) {
    toast.error(
      error.message ||
        "Failed to change email"
    );
  } finally {
    setEmailLoading(false);
  }
};

  return (
    <div>
      <section className="bg-gradient-to-r from-[#fff8f0] to-[#fffdf9]  p-6 md:p-8 shadow-sm w-full mx-auto ">
        
      <div className="space-y-8">
        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <div>
  <label className="font-semibold text-black">
    Name
  </label>

  {isEditing ? (
    <Input
      value={profile?.name ?? ""}
      onChange={(e) =>
        setProfile(prev =>
          prev
            ? {
                ...prev,
                name: e.target.value,
              }
            : prev
        )
      }
    />
  ) : (
    <p className="text-stone-600 mt-2">
      {profile?.name || "Not provided"}
    </p>
  )}
</div>
        {/* Email */}
        <div>
  <div className="flex items-center gap-3 mb-2">
    <label className="font-medium text-black ">
      <h1 className="font-semibold text-black">Email</h1>
    </label>

    {isEditing && !isEditingEmail && (
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          setIsEditingEmail(true)
        }
      >
        Edit Email
      </Button>
    )}
  </div>

  {isEditingEmail ? (
    <div className="space-y-3 text-black">
      <Input
        type="email"
        value={newEmail}
        onChange={(e) =>
          setNewEmail(e.target.value)
        }
      />

      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={handleEmailChange}
        >
          Save Email
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setNewEmail(
              profile?.email ?? ""
            );
            setIsEditingEmail(false);
          }}
        >
          Cancel
        </Button>
        
      </div>
    </div>
  ) : (
    <p className="text-stone-600 mt-2 ">
      {profile?.email}
    </p>
  )}
</div>
</div>
        {/* City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 mb-2 text-black font-semibold">
            <LocationEdit className="w-5 h-5" />
            {profile?.city ?? "Indore"}
          </label>
        </div>

        {/* Active */}
        <div>
  <label className="font-semibold text-black">
    Availability
  </label>

  {isEditing ? (
    <div className="flex items-center gap-3 mt-2">
      <Checkbox
        checked={profile?.isActive ?? false}
        onCheckedChange={(checked) =>
          setProfile((prev) =>
            prev
              ? {
                  ...prev,
                  isActive: Boolean(checked),
                }
              : prev
          )
        }
      />

      <span className="text-black">
        Available for volunteering
      </span>
    </div>
  ) : (
    <Badge
      className={
        profile?.isActive
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }
    >
      {profile?.isActive
        ? "Available"
        : "Unavailable"}
    </Badge>
  )}
</div>
</div>
        {/* Bio */}
        <div>
  <label className="font-semibold text-black">
    Bio
  </label>
  {isEditing ? (
    <Textarea
      value={profile?.bio ?? ""}
      onChange={(e) =>
        setProfile(prev =>
          prev
            ? {
                ...prev,
                bio: e.target.value,
              }
            : prev
        )
      }
    />
  ) : (
    <p className="text-gray-700 whitespace-pre-wrap">
      {profile?.bio || "No bio added"}
    </p>
  )}
</div>

        {/* Skills */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-3">
  <h3 className="text-black font-semibold">
    Skills
  </h3>

  {isEditing && (
    <div className="flex flex-col sm:flex-row gap-2">
      <Select onValueChange={setSelectedSkill}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Select a skill" />
        </SelectTrigger>

        <SelectContent>
          {skills.map((skill) => (
            <SelectItem
              key={skill}
              value={skill}
            >
              {skill}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        type="button"
        onClick={() => {
          if (
            selectedSkill &&
            profile &&
            !profile.skills.includes(selectedSkill)
          ) {
            setProfile({
              ...profile,
              skills: [
                ...profile.skills,
                selectedSkill,
              ],
            });
          }
        }}
      >
        Add
      </Button>
    </div>
  )}

  <div className="flex flex-wrap gap-2">
    {profile?.skills.map((skill) => (
      <Badge
        key={skill}
        className={`px-3 py-1 ${
          isEditing
            ? "cursor-pointer"
            : ""
        }`}
        onClick={() => {
          if (!isEditing || !profile)
            return;

          setProfile({
            ...profile,
            skills: profile.skills.filter(
              (s) => s !== skill
            ),
          });
        }}
      >
        {skill}
        {isEditing && " ✕"}
      </Badge>
    ))}
  </div>
</div>

        {/* Categories */}
        {/* Preferred Categories */}

<div className="space-y-3">
  <h3 className="text-black font-semibold">
    Preferred Categories
  </h3>

  {isEditing && (
    <div className="flex flex-col sm:flex-row gap-2">
      <Select onValueChange={setSelectedCategory}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>

        <SelectContent>
          {categories.map((category) => (
            <SelectItem
              key={category}
              value={category}
            >
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        type="button"
        onClick={() => {
          if (
            selectedCategory &&
            profile &&
            !profile.preferredCategories.includes(
              selectedCategory
            )
          ) {
            setProfile({
              ...profile,
              preferredCategories: [
                ...profile.preferredCategories,
                selectedCategory,
              ],
            });
          }
        }}
      >
        Add
      </Button>
    </div>
  )}

  <div className="flex flex-wrap gap-2">
    {profile?.preferredCategories.map(
      (category) => (
        <Badge
          key={category}
          className={`bg-orange-100 text-orange-900 px-3 py-1 ${
            isEditing ? "cursor-pointer" : ""
          }`}
          onClick={() => {
            if (!isEditing || !profile)
              return;

            setProfile({
              ...profile,
              preferredCategories:
                profile.preferredCategories.filter(
                  (c) => c !== category
                ),
            });
          }}
        >
          {category}
          {isEditing && " ✕"}
        </Badge>
      )
    )}
  </div>
</div>
</div>
      </div>

    </section>
    </div>
  )
}

export default userDetails