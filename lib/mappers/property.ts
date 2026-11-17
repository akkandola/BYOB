import type { Property } from "@/types/property";
import type { Database } from "@/types/supabase";

type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];

export function toProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    name: row.name,
    propertyType: row.property_type,
    address: row.address,
    notes: row.notes,
    createdAt: row.created_at,
  };
}
