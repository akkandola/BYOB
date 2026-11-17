import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "./setup";
import PropertyDetailPage from "@/pages/properties/[id]/index";

vi.mock("next/router", () => ({
  useRouter: () => ({ query: { id: "1" } }),
}));

const PROPERTY = {
  id: "1",
  name: "Maple Street House",
  propertyType: "house",
  address: "14 Maple Street",
  notes: "Primary residence",
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("PropertyDetailPage", () => {
  test("renders the property header and both action tiles", async () => {
    server.use(
      http.get("/api/v1/properties/1", () =>
        HttpResponse.json({ success: true, data: PROPERTY }),
      ),
    );

    render(<PropertyDetailPage />);

    expect(
      await screen.findByRole("heading", { name: "Maple Street House" }),
    ).toBeInTheDocument();
    expect(screen.getByText("14 Maple Street")).toBeInTheDocument();
    expect(screen.getByText("Primary residence")).toBeInTheDocument();
    expect(screen.getByText("Home Manager")).toBeInTheDocument();
    expect(screen.getByText("DIY Projects")).toBeInTheDocument();
  });

  test("shows a not-found message for a 404 response", async () => {
    server.use(
      http.get("/api/v1/properties/1", () =>
        HttpResponse.json(
          { success: false, error: "Property not found" },
          { status: 404 },
        ),
      ),
    );

    render(<PropertyDetailPage />);

    expect(
      await screen.findByText(/doesn't exist or may have been removed/i),
    ).toBeInTheDocument();
  });
});
