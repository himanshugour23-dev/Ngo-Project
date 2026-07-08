import { z } from "zod";

export const ngoSignupSchema = z.object({
  ngoName: z.string().min(3),
  email: z.string().email(),
  password: z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#])[A-Za-z\d@$!%*?&_#]+$/,
    "Password must contain uppercase, lowercase, number and special character"
  ),
  Address: z.string().min(5),
  city: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  registrationCertificate: z.string(),
  type: z.enum(["trust", "society", "section8"]),
  eightyGNumber: z.string().optional(),
  twelveGNumber: z.string().optional(),
  motto : z.string().max(300),
  yearOfEstablishment: z
    .string()
    .datetime()
    .optional(),
});

export const userSignupSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(6, "minimum 6 characters required"),
  city: z.string().min(2),
  latitude: z.number(),
  longitude: z.number(),
  skills: z.array(z.string()),
  preferredCategories: z.array(
    z.enum([
      "education",
      "health",
      "environment",
      "animalWelfare",
      "disasterRelief",
      "povertyAlleviation",
      "communityDevelopment",
      "artsAndCulture",
      "humanRights",
      "other",
    ])
  ),
});

export const communityNeedsSchema = z.object({
  peopleAffected : z.number().optional(),
  maxAffectedPeople : z.number().optional(),
  ProblemDescription : z.string(),
  ProblemCategory: z.enum([
  "education",
  "health",
  "environment",
  "animalWelfare",
  "disasterRelief",
  "povertyAlleviation",
  "communityDevelopment",
  "artsAndCulture",
  "humanRights",
  "other",
 ]), 
  location : z.string(),
  latitude : z.number().optional(),
  longitude : z.number().optional(),
  urgencyLevel : z.number().min(0).max(10),
  hasDeadline : z.boolean(),
  deadLine : z.date().optional(),
  images : z.array(z.string()),
  maxVolunteers : z.number().optional(),
})

