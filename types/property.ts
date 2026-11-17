export const PROPERTY_TYPES = [
  "house",
  "flat",
  "townhouse",
  "bungalow",
  "other",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  house: "House",
  flat: "Flat",
  townhouse: "Townhouse",
  bungalow: "Bungalow",
  other: "Other",
};

export interface Property {
  id: string;
  name: string;
  propertyType: PropertyType;
  address: string | null;
  notes: string | null;
  createdAt: string;
}

export interface NewProperty {
  name: string;
  propertyType: PropertyType;
  address?: string;
  notes?: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  error: string;
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;
