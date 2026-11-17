import { describe, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "./setup";
import NewPropertyPage from "@/pages/properties/new";

const push = vi.fn();
vi.mock("next/router", () => ({
  useRouter: () => ({ push }),
}));

describe("NewPropertyPage", () => {
  test("shows field errors and does not submit when required fields are missing", async () => {
    render(<NewPropertyPage />);

    await userEvent.click(screen.getByRole("button", { name: /save property/i }));

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Select a property type")).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  test("submits valid input and redirects to the landing page", async () => {
    server.use(
      http.post("/api/v1/properties", async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        expect(body.name).toBe("Maple Street House");
        expect(body.propertyType).toBe("house");
        return HttpResponse.json(
          {
            success: true,
            data: {
              id: "1",
              name: body.name,
              propertyType: body.propertyType,
              address: null,
              notes: null,
              createdAt: "2026-01-01T00:00:00.000Z",
            },
          },
          { status: 201 },
        );
      }),
    );

    render(<NewPropertyPage />);

    await userEvent.type(screen.getByLabelText("Name"), "Maple Street House");
    await userEvent.click(screen.getByLabelText("Type"));
    await userEvent.click(await screen.findByRole("option", { name: "House" }));
    await userEvent.click(screen.getByRole("button", { name: /save property/i }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/"));
  });

  test("shows the server error and keeps entered input on failure", async () => {
    server.use(
      http.post("/api/v1/properties", () =>
        HttpResponse.json(
          { success: false, error: "Database unavailable" },
          { status: 500 },
        ),
      ),
    );

    render(<NewPropertyPage />);

    await userEvent.type(screen.getByLabelText("Name"), "Maple Street House");
    await userEvent.click(screen.getByLabelText("Type"));
    await userEvent.click(await screen.findByRole("option", { name: "House" }));
    await userEvent.click(screen.getByRole("button", { name: /save property/i }));

    expect(await screen.findByText("Database unavailable")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Maple Street House");
    expect(push).not.toHaveBeenCalled();
  });
});
