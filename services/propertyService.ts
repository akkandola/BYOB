import { AxiosError } from "axios";
import api from "@/lib/api";
import type { ApiEnvelope, NewProperty, Property } from "@/types/property";

function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof AxiosError) {
    const envelope = err.response?.data as ApiEnvelope<unknown> | undefined;
    if (envelope && envelope.success === false) return envelope.error;
  }
  return fallback;
}

/**
 * Fetches all properties, newest first.
 */
export async function getProperties(): Promise<Property[]> {
  try {
    const response = await api.get<ApiEnvelope<Property[]>>("/properties");
    if (!response.data.success) throw new Error(response.data.error);
    return response.data.data; // double unwrap: axios .data, then envelope .data
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Failed to load properties"));
  }
}

/**
 * Fetches a single property by id.
 */
export async function getProperty(id: string): Promise<Property> {
  try {
    const response = await api.get<ApiEnvelope<Property>>(`/properties/${id}`);
    if (!response.data.success) throw new Error(response.data.error);
    return response.data.data; // double unwrap: axios .data, then envelope .data
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Failed to load property"));
  }
}

/**
 * Creates a new property.
 */
export async function createProperty(input: NewProperty): Promise<Property> {
  try {
    const response = await api.post<ApiEnvelope<Property>>(
      "/properties",
      input,
    );
    if (!response.data.success) throw new Error(response.data.error);
    return response.data.data; // double unwrap: axios .data, then envelope .data
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Failed to create property"));
  }
}
