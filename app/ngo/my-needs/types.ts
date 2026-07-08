// app/ngo/my-needs/types.ts

export type NeedItem = {
  id: string;
  ProblemDescription: string;
  ProblemCategory: string;
  images: string[];
  deadLine: string | null;
  location: string | null;
  urgencyLevel: number;
  voulenteersWorking: number;
  maxVolunteers: number;
  status: string;
};