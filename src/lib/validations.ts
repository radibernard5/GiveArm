import { z } from "zod";

export const initializeDonationSchema = z.object({
  donorName: z.string().trim().min(2, "Full name is required"),
  donorEmail: z.string().trim().email("Valid email is required"),
  donorPhone: z.string().trim().optional().or(z.literal("")),
  amount: z.number().positive("Amount must be greater than 0"),
  currency: z.enum(["GHS", "USD"]).default("GHS"),
  paymentChannel: z.enum(["mobile_money", "card"]),
  momoNetwork: z.enum(["mtn", "vod", "atl"]).optional(),
  frequency: z.enum(["one_time", "monthly"]).default("one_time"),
  causeId: z.string().trim().optional().nullable(),
  causeName: z.string().trim().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email("Valid email is required"),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Valid email is required"),
  subject: z.string().trim().min(2, "Subject is required"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

export type InitializeDonationInput = z.infer<typeof initializeDonationSchema>;
