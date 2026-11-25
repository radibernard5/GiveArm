export type CauseStatus = "Draft" | "Active" | "Paused" | "Completed" | "Pending Approval" | "Rejected";
export type DonationStatus = "Completed" | "Pending" | "Refunded";
export type PayoutStatus = "Scheduled" | "Completed" | "Processing";

export interface AdminCause {
  id: string;
  title: string;
  category: string;
  summary: string;
  story: string;
  imageUrl: string;
  goal: number;
  raised: number;
  startDate: string;
  endDate: string;
  beneficiary: string;
  featured: boolean;
  status: CauseStatus;
  submittedBy?: string;
}

export interface AdminDonation {
  id: string;
  donorName: string;
  donorEmail: string;
  cause: string;
  amount: number;
  method: string;
  reference: string;
  status: DonationStatus;
  date: string;
}

export interface AdminDonor {
  id: string;
  name: string;
  email: string;
  totalGiven: number;
  donations: number;
  type: "Recurring" | "One-time";
  lastDonation: string;
  status: "Active" | "Inactive";
}

export interface AdminCreator {
  id: string;
  name: string;
  organization: string;
  email: string;
  verified: boolean;
  campaigns: number;
  status: "Active" | "Suspended";
}

export interface Payout {
  id: string;
  cause: string;
  beneficiary: string;
  available: number;
  fee: number;
  net: number;
  status: PayoutStatus;
  date: string;
}

export const initialCauses: AdminCause[] = [
  { id: "C-001", title: "Solar Borehole Project for Rural Schools", category: "Community", summary: "Clean water access for rural schools.", story: "Installing solar-powered boreholes to provide safe drinking water for students and families.", imageUrl: "https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?auto=format&fit=crop&w=900&q=80", goal: 75000, raised: 48200, startDate: "2026-01-10", endDate: "2026-08-30", beneficiary: "Kpando Community Trust", featured: true, status: "Active" },
  { id: "C-002", title: "Back-to-School Kits & Tech Labs for Youth", category: "Education", summary: "School supplies and digital labs for students.", story: "Providing kits, laptops, and STEM mentorship to underserved youth.", imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80", goal: 100000, raised: 63500, startDate: "2026-02-01", endDate: "2026-09-15", beneficiary: "Bright Future Foundation", featured: true, status: "Active" },
  { id: "C-003", title: "Maternal Health & Rural Clinic Equipment", category: "Healthcare", summary: "Essential equipment for rural clinics.", story: "Supporting maternal care with medical supplies and clinic equipment.", imageUrl: "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=900&q=80", goal: 90000, raised: 35800, startDate: "2026-03-05", endDate: "2026-10-20", beneficiary: "Rural Care Alliance", featured: false, status: "Active" },
  { id: "C-004", title: "Emergency Flood Relief for Northern Communities", category: "Emergency Relief", summary: "Immediate relief for flood-affected families.", story: "Food, shelter, and medical aid for families displaced by flooding.", imageUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=80", goal: 120000, raised: 18200, startDate: "2026-11-01", endDate: "2027-01-31", beneficiary: "Northern Relief Network", featured: false, status: "Pending Approval", submittedBy: "Northern Relief Network" },
  { id: "C-005", title: "Tree Planting & Clean Community Drive", category: "Environment", summary: "Community-led reforestation campaign.", story: "Planting trees and organizing clean-up drives in urban communities.", imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80", goal: 45000, raised: 45000, startDate: "2025-06-01", endDate: "2026-02-28", beneficiary: "Green Accra Initiative", featured: false, status: "Completed" },
];

export const initialDonations: AdminDonation[] = [
  { id: "D-1001", donorName: "Ama Serwaa", donorEmail: "ama.serwaa@email.com", cause: "Solar Borehole Project for Rural Schools", amount: 500, method: "MTN MoMo", reference: "GA-PSK-1001", status: "Completed", date: "2026-11-24" },
  { id: "D-1002", donorName: "Anonymous", donorEmail: "anonymous@givearm.org", cause: "Back-to-School Kits & Tech Labs for Youth", amount: 250, method: "Visa", reference: "GA-PSK-1002", status: "Completed", date: "2026-11-23" },
  { id: "D-1003", donorName: "Kwame Asante", donorEmail: "kwame.asante@email.com", cause: "Maternal Health & Rural Clinic Equipment", amount: 1000, method: "Mastercard", reference: "GA-PSK-1003", status: "Pending", date: "2026-11-23" },
  { id: "D-1004", donorName: "Efua Mensah", donorEmail: "efua.mensah@email.com", cause: "Solar Borehole Project for Rural Schools", amount: 150, method: "Telecel Cash", reference: "GA-PSK-1004", status: "Completed", date: "2026-11-22" },
  { id: "D-1005", donorName: "Daniel Ofori", donorEmail: "daniel.ofori@email.com", cause: "Back-to-School Kits & Tech Labs for Youth", amount: 750, method: "Bank Transfer", reference: "GA-PSK-1005", status: "Refunded", date: "2026-11-20" },
  { id: "D-1006", donorName: "Nana Yaa", donorEmail: "nana.yaa@email.com", cause: "Maternal Health & Rural Clinic Equipment", amount: 300, method: "MTN MoMo", reference: "GA-PSK-1006", status: "Completed", date: "2026-11-19" },
];

export const initialDonors: AdminDonor[] = [
  { id: "U-001", name: "Ama Serwaa", email: "ama.serwaa@email.com", totalGiven: 4200, donations: 8, type: "Recurring", lastDonation: "2026-11-24", status: "Active" },
  { id: "U-002", name: "Kwame Asante", email: "kwame.asante@email.com", totalGiven: 3100, donations: 5, type: "One-time", lastDonation: "2026-11-23", status: "Active" },
  { id: "U-003", name: "Efua Mensah", email: "efua.mensah@email.com", totalGiven: 950, donations: 3, type: "Recurring", lastDonation: "2026-11-22", status: "Active" },
  { id: "U-004", name: "Daniel Ofori", email: "daniel.ofori@email.com", totalGiven: 750, donations: 1, type: "One-time", lastDonation: "2026-11-20", status: "Inactive" },
];

export const initialCreators: AdminCreator[] = [
  { id: "CR-001", name: "Kofi Adjei", organization: "Kpando Community Trust", email: "kofi@kpandotrust.org", verified: true, campaigns: 2, status: "Active" },
  { id: "CR-002", name: "Sarah Boateng", organization: "Bright Future Foundation", email: "sarah@brightfuture.org", verified: true, campaigns: 3, status: "Active" },
  { id: "CR-003", name: "Musa Ibrahim", organization: "Northern Relief Network", email: "musa@northernrelief.org", verified: false, campaigns: 1, status: "Active" },
];

export const initialPayouts: Payout[] = [
  { id: "P-001", cause: "Solar Borehole Project for Rural Schools", beneficiary: "Kpando Community Trust", available: 48200, fee: 1446, net: 46754, status: "Scheduled", date: "2026-11-30" },
  { id: "P-002", cause: "Back-to-School Kits & Tech Labs for Youth", beneficiary: "Bright Future Foundation", available: 63500, fee: 1905, net: 61595, status: "Processing", date: "2026-11-28" },
  { id: "P-003", cause: "Tree Planting & Clean Community Drive", beneficiary: "Green Accra Initiative", available: 45000, fee: 1350, net: 43650, status: "Completed", date: "2026-10-15" },
];

export const donationChart = [
  { month: "Jun", amount: 18500 },
  { month: "Jul", amount: 22400 },
  { month: "Aug", amount: 26800 },
  { month: "Sep", amount: 24100 },
  { month: "Oct", amount: 31200 },
  { month: "Nov", amount: 35600 },
];
