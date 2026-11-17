import { describe, expect, test } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "./setup";
import LandingPage from "@/pages/index";

const PROPERTIES = [
  {
    id: "1",
    name: "Maple Street House",
    propertyType: "house",
    address: "14 Maple Street",
    notes: null,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Harbourview Flat",
    propertyType: "flat",
    address: null,
    notes: null,
    createdAt: "2026-01-02T00:00:00.000Z",
  },
];

describe("LandingPage", () => {
  test("renders real property field values from the API", async () => {
    server.use(
      http.get("/api/v1/properties", () =>
        HttpResponse.json({ success: true, data: PROPERTIES }),
      ),
    );

    render(<LandingPage />);

    expect(
      screen.getByRole("heading", { name: "Be Your Own Builder" }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Maple Street House")).toBeInTheDocument();
    expect(screen.getByText("14 Maple Street")).toBeInTheDocument();
    expect(screen.getByText("Harbourview Flat")).toBeInTheDocument();
    expect(screen.getByText("No address on file")).toBeInTheDocument();
    expect(screen.getByText("House")).toBeInTheDocument();
    expect(screen.getByText("Flat")).toBeInTheDocument();
  });

  test("shows an empty state when there are no properties", async () => {
    server.use(
      http.get("/api/v1/properties", () =>
        HttpResponse.json({ success: true, data: [] }),
      ),
    );

    render(<LandingPage />);

    expect(
      await screen.findByText(/no properties yet/i),
    ).toBeInTheDocument();
  });

  test("shows an error with retry, and retry recovers", async () => {
    let attempt = 0;
    server.use(
      http.get("/api/v1/properties", () => {
        attempt += 1;
        if (attempt === 1) {
          return HttpResponse.json(
            { success: false, error: "Database unavailable" },
            { status: 500 },
          );
        }
        return HttpResponse.json({ success: true, data: PROPERTIES });
      }),
    );

    render(<LandingPage />);

    expect(
      await screen.findByText("Database unavailable"),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /retry/i }));

    await waitFor(() =>
      expect(screen.getByText("Maple Street House")).toBeInTheDocument(),
    );
  });
});
