// app/ngo/needs/[id]/requests/types.ts

export type VolunteerUser = {
  id: string;
  name: string;
  email: string;
  city: string | null;
  skills: string[];
  rating: number | null;
  taskCompleted: number;
  preferredCategories: string[];
};

export type RequestItem = {
  id: string;
  approvalStatus: string;
  createdAt: string;
  user: VolunteerUser;
};