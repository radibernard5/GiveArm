import { NextResponse } from "next/server";
import { supabase } from "@/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("causes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const causes = (data || [])
      .filter((c: any) => !c.status || c.status === "Active")
      .map((c: any) => {
        const goal = Number(c.goal ?? c.goalAmount ?? 0);
        const raised = Number(c.raised ?? c.raisedAmount ?? 0);
        const progressPercentage = goal > 0 ? Math.min(100, (raised / goal) * 100) : 0;
        return {
          id: String(c.id),
          slug: c.slug ?? String(c.id),
          title: c.title ?? "",
          category: c.category ?? "Community",
          summary: c.summary ?? c.description ?? "",
          description: c.story ?? c.description ?? c.summary ?? "",
          goalAmount: goal,
          raisedAmount: raised,
          goalGhs: goal,
          raisedGhs: raised,
          currency: c.currency ?? "GHS",
          image: c.image_url ?? c.imageUrl ?? "",
          imageUrl: c.image_url ?? c.imageUrl ?? "",
          progressPercentage: Number(progressPercentage.toFixed(2)),
          donorCount: Number(c.donor_count ?? 0),
        };
      });

    return NextResponse.json({ causes });
  } catch (error) {
    console.error("GET /api/causes error", error);
    return NextResponse.json({ error: "Failed to fetch causes" }, { status: 500 });
  }
}
