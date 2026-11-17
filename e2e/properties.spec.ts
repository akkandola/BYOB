import { test, expect } from "@playwright/test";

const EXISTING = {
  id: "1",
  name: "Maple Street House",
  propertyType: "house",
  address: "14 Maple Street",
  notes: null,
  createdAt: "2026-01-01T00:00:00.000Z",
};

test("landing shows properties -> create new -> open detail -> Home Manager stub", async ({
  page,
}) => {
  let properties = [EXISTING];

  await page.route("**/api/v1/properties", async (route) => {
    const request = route.request();
    if (request.method() === "GET") {
      return route.fulfill({ json: { success: true, data: properties } });
    }
    if (request.method() === "POST") {
      const body = request.postDataJSON();
      const created = {
        id: "2",
        name: body.name,
        propertyType: body.propertyType,
        address: body.address || null,
        notes: body.notes || null,
        createdAt: "2026-01-02T00:00:00.000Z",
      };
      properties = [created, ...properties];
      return route.fulfill({ status: 201, json: { success: true, data: created } });
    }
    return route.continue();
  });

  await page.route("**/api/v1/properties/2", async (route) => {
    return route.fulfill({
      json: { success: true, data: properties.find((p) => p.id === "2") },
    });
  });

  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Be Your Own Builder" }),
  ).toBeVisible();
  await expect(page.getByText("Maple Street House")).toBeVisible();

  await page.getByRole("link", { name: "New property" }).click();
  await expect(page).toHaveURL(/\/properties\/new$/);

  await page.getByLabel("Name").fill("Harbourview Flat");
  await page.getByLabel("Type").click();
  await page.getByRole("option", { name: "Flat" }).click();
  await page.getByRole("button", { name: "Save property" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText("Harbourview Flat")).toBeVisible();
  await expect(page.getByText("Maple Street House")).toBeVisible();

  await page.getByText("Harbourview Flat").click();
  await expect(page).toHaveURL(/\/properties\/2$/);
  await expect(
    page.getByRole("heading", { name: "Harbourview Flat" }),
  ).toBeVisible();

  await page.getByText("Home Manager").click();
  await expect(page).toHaveURL(/\/properties\/2\/home-manager$/);
  await expect(page.getByText(/coming soon/i)).toBeVisible();

  await page.getByRole("link", { name: "← Back to property" }).click();
  await expect(page).toHaveURL(/\/properties\/2$/);
});

test("/properties no longer exists as a standalone list page", async ({
  page,
}) => {
  await page.route("**/api/v1/properties", (route) =>
    route.fulfill({ json: { success: true, data: [EXISTING] } }),
  );

  const response = await page.goto("/properties");
  expect(response?.status()).toBe(404);
});
