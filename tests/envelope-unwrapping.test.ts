import { describe, expect, test } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "./setup";
import {
  createProperty,
  getProperties,
  getProperty,
} from "@/services/propertyService";

const SAMPLE_ROW = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "Maple Street House",
  propertyType: "house",
  address: "14 Maple Street",
  notes: null,
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("API envelope unwrapping", () => {
  test("getProperties returns the unwrapped array, not the envelope", async () => {
    server.use(
      http.get("/api/v1/properties", () =>
        HttpResponse.json({ success: true, data: [SAMPLE_ROW] }),
      ),
    );

    const properties = await getProperties();

    expect(Array.isArray(properties)).toBe(true);
    expect(properties).toHaveLength(1);
    expect(properties[0]).not.toHaveProperty("success");
    expect(properties[0]).toEqual(SAMPLE_ROW);
  });

  test("createProperty returns the unwrapped object, not the envelope", async () => {
    server.use(
      http.post("/api/v1/properties", () =>
        HttpResponse.json({ success: true, data: SAMPLE_ROW }, { status: 201 }),
      ),
    );

    const property = await createProperty({
      name: "Maple Street House",
      propertyType: "house",
    });

    expect(property).not.toHaveProperty("success");
    expect(property).toEqual(SAMPLE_ROW);
  });

  test("getProperty returns the unwrapped object, not the envelope", async () => {
    server.use(
      http.get("/api/v1/properties/11111111-1111-1111-1111-111111111111", () =>
        HttpResponse.json({ success: true, data: SAMPLE_ROW }),
      ),
    );

    const property = await getProperty(SAMPLE_ROW.id);

    expect(property).not.toHaveProperty("success");
    expect(property).toEqual(SAMPLE_ROW);
  });

  test("a failed envelope surfaces the server error message", async () => {
    server.use(
      http.get("/api/v1/properties", () =>
        HttpResponse.json(
          { success: false, error: "Database unavailable" },
          { status: 500 },
        ),
      ),
    );

    await expect(getProperties()).rejects.toThrow("Database unavailable");
  });
});
