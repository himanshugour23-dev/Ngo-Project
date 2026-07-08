'use client'
import { Heart, Briefcase, ListChecks, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { UserProfileData } from "@/app/user/profilePage/page";
export interface  props{
      profile: UserProfileData | null
}

export default function NavBar({profile}:props) {
  const router = useRouter()
  return (
    <TooltipProvider delayDuration={200}>
      <header className="sticky top-0 z-50 w-full border-b border-orange-200 bg-gradient-to-r from-orange-50 to-orange-50/30 shadow-[0_2px_16px_0_rgba(234,120,30,0.07)]">
  <div className="max-w-7xl mx-auto px-6 sm:px-10">
    <div className="flex items-center justify-between h-16">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <img
          src={
            profile?.image ||
            "https://thumbs.dreamstime.com/b/gray-circle-user-icon-profile-avatar-simple-symbol-358262950.jpg"
          }
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-orange-200 hover:border-orange-400 transition"
          onClick={() =>
            router.push("/user/profilePage")
          }
        />

        <Separator
          orientation="vertical"
          className="h-6 mx-1 bg-orange-200"
        />

        <div className="flex flex-col leading-none">
          <span className="text-[11px] uppercase tracking-[0.13em] font-semibold text-orange-700">
            NGO Platform
          </span>

          <span className="text-[17px] font-bold text-stone-900 leading-tight">
            Volunteer Profile
          </span>
        </div>
      </div>

      {/* DESKTOP NAV */}
      <nav className="hidden md:flex items-center gap-3">

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="relative flex items-center gap-2 h-10 px-4 rounded-xl text-orange-900 font-semibold text-sm hover:bg-orange-50 hover:border hover:border-orange-200"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-orange-50">
                <Briefcase className="w-3.5 h-3.5 text-orange-500" />
              </span>

              <span>Working Needs</span>

              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-orange-500 opacity-70" />
            </Button>
          </TooltipTrigger>

          <TooltipContent
            side="bottom"
            className="text-xs bg-stone-900 text-orange-50"
          >
            View your active volunteering tasks
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="relative flex items-center gap-2 h-10 px-5 rounded-xl
             text-white font-bold text-sm bg-gradient-to-br from-orange-500
              to-orange-600 shadow-md hover:shadow-lg"
              onClick={()=>router.push("/user/availableNeeds")}>
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-white/20">
                <ListChecks className="w-3.5 h-3.5 text-white" />
              </span>

              <span>See Available Needs</span>

              <Badge className="ml-0.5 px-1.5 py-0 h-4 text-[10px] rounded-full bg-white/25 text-white border-none">
                12
              </Badge>
            </Button>
          </TooltipTrigger>

          <TooltipContent
            side="bottom"
            className="text-xs bg-stone-900 text-orange-50"
          >
            Browse open NGO volunteering opportunities
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative w-9 h-9 rounded-xl text-orange-700 hover:bg-orange-50"
            >
              <Bell className="w-4 h-4" />

              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-orange-50 bg-orange-500" />
            </Button>
            
          </TooltipTrigger>

          <TooltipContent
            side="bottom"
            className="text-xs bg-stone-900 text-orange-50"
          >
            Notifications
          </TooltipContent>
        </Tooltip>
      </nav>

      {/* MOBILE MENU */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Briefcase className="mr-2 h-4 w-4" />
              Working Needs
            </DropdownMenuItem>

            <DropdownMenuItem  
            onClick={()=>router.push("/user/availableNeeds")}>
              <ListChecks className="mr-2 h-4 w-4" />
              Available Needs
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </div>
  </div>
</header>
    </TooltipProvider>
  );
}