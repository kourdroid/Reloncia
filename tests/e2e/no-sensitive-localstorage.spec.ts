import { test, expect } from "@playwright/test";

/**
 * T125 — No sensitive state in localStorage
 *
 * Verifies that role, tenant, cabinet, entitlement, and session state
 * are never persisted in localStorage. These must live server-side only.
 */
test.describe("No Sensitive State in localStorage (T125)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/fr/dashboard");
  });

  const FORBIDDEN_KEYS = [
    "role",
    "tenantId",
    "cabinetId",
    "entitlements",
    "session",
    "supabase.auth.token",
    "accessToken",
    "refreshToken",
    "userId",
  ];

  for (const key of FORBIDDEN_KEYS) {
    test(`should NOT store '${key}' in localStorage`, async ({ page }) => {
      const value = await page.evaluate(
        (k) => localStorage.getItem(k),
        key
      );
      expect(value).toBeNull();
    });
  }

  test("should not have any auth-related data in localStorage", async ({ page }) => {
    const localStorageKeys = await page.evaluate(() =>
      Object.keys(localStorage)
    );
    const authRelatedKeys = localStorageKeys.filter(
      (k) =>
        k.toLowerCase().includes("auth") ||
        k.toLowerCase().includes("token") ||
        k.toLowerCase().includes("role") ||
        k.toLowerCase().includes("tenant") ||
        k.toLowerCase().includes("cabinet")
    );
    // Supabase SSR stores session in httpOnly cookies, not localStorage
    expect(authRelatedKeys).toHaveLength(0);
  });
});
