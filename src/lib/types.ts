export type Currency = "GHS" | "USD";
export type Frequency = "one-time" | "monthly";
export type PaymentMethod = "momo" | "card";

export interface Cause {
  id: string;
  slug?: string;
  title: string;
  summary?: string;
  description?: string;
  category: string;
  image?: string;
  imageUrl?: string;
  raisedGhs?: number;
  goalGhs?: number;
  raisedUsd?: number;
  goalUsd?: number;
  raisedAmount?: number;
  goalAmount?: number;
  currency?: Currency | string;
  progressPercentage?: number;
  donorCount?: number;
  donors?: number;
}

export interface DonationRequest {
  causeName: string;
  causeId?: string | null;
}
