import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { toProperty } from "@/lib/mappers/property";
import type { ApiEnvelope, Property } from "@/types/property";

// PGRST116: no row matched .single(); 22P02: malformed uuid passed to .eq("id", ...)
const NOT_FOUND_CODES = new Set(["PGRST116", "22P02"]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiEnvelope<Property>>,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ success: false, error: `Method ${req.method} not allowed` });
  }

  const { id } = req.query;
  if (typeof id !== "string" || id.length === 0) {
    return res.status(400).json({ success: false, error: "Invalid property id" });
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("properties")
      .select("id, name, property_type, address, notes, created_at")
      .eq("id", id)
      .single();

    if (error) {
      if (NOT_FOUND_CODES.has(error.code)) {
        return res
          .status(404)
          .json({ success: false, error: "Property not found" });
      }
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, data: toProperty(data) });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : "Unexpected server error",
    });
  }
}
