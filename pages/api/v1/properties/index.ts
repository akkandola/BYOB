import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { toProperty } from "@/lib/mappers/property";
import { propertyInputSchema } from "@/lib/validation/property";
import type { ApiEnvelope, Property } from "@/types/property";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiEnvelope<Property[] | Property>>,
) {
  if (req.method === "GET") {
    return handleList(req, res);
  }
  if (req.method === "POST") {
    return handleCreate(req, res);
  }
  res.setHeader("Allow", ["GET", "POST"]);
  return res
    .status(405)
    .json({ success: false, error: `Method ${req.method} not allowed` });
}

async function handleList(
  _req: NextApiRequest,
  res: NextApiResponse<ApiEnvelope<Property[]>>,
) {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("properties")
      .select("id, name, property_type, address, notes, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, data: data.map(toProperty) });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : "Unexpected server error",
    });
  }
}

async function handleCreate(
  req: NextApiRequest,
  res: NextApiResponse<ApiEnvelope<Property>>,
) {
  const parsed = propertyInputSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid property";
    return res.status(400).json({ success: false, error: message });
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("properties")
      .insert([
        {
          name: parsed.data.name,
          property_type: parsed.data.propertyType,
          address: parsed.data.address || null,
          notes: parsed.data.notes || null,
        },
      ])
      .select("id, name, property_type, address, notes, created_at")
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(201).json({ success: true, data: toProperty(data) });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : "Unexpected server error",
    });
  }
}
