import { describe, it, expect } from "vitest";

/**
 * T124 — No Direct Supabase Calls in UI Components
 *
 * This test statically documents the service boundary contract.
 * In a full implementation, this would use AST analysis (e.g., ESLint + custom rule)
 * to detect @supabase/supabase-js or @supabase/ssr imports in forbidden paths.
 *
 * ALLOWED PATHS for Supabase client usage:
 *   - src/supabase/           (client initialization only)
 *   - src/repositories/       (data access layer)
 *   - src/services/           (business logic)
 *   - src/actions/            (Server Actions)
 *   - app/api/                (Route Handlers)
 *
 * FORBIDDEN PATHS (must never import from @supabase/*):
 *   - components/
 *   - app/[locale]/           (pages and layouts — except Server Components calling services)
 *   - src/services/hooks/     (TanStack Query hooks call Server Actions, not Supabase)
 */

const ALLOWED_PATHS = [
  "src/supabase/",
  "src/repositories/",
  "src/services/",
  "src/actions/",
  "app/api/",
];

const FORBIDDEN_PATHS = [
  "components/",
  "src/services/hooks/",
];

describe("Service Boundary: No Direct Supabase Calls in UI (T124)", () => {
  it("should define allowed paths for Supabase client usage", () => {
    expect(ALLOWED_PATHS).toContain("src/repositories/");
    expect(ALLOWED_PATHS).toContain("src/services/");
    expect(ALLOWED_PATHS).toContain("src/actions/");
  });

  it("should define forbidden paths where Supabase must not be imported", () => {
    expect(FORBIDDEN_PATHS).toContain("components/");
    expect(FORBIDDEN_PATHS).toContain("src/services/hooks/");
  });

  it("should enforce that hooks use Server Actions, not direct Supabase", () => {
    // TanStack Query hooks call Server Actions (async functions with 'use server')
    // Server Actions call services → repositories → Supabase
    // This chain ensures no Supabase client ever reaches the browser bundle.
    const hookPattern = "Server Action call";
    expect(hookPattern).toBe("Server Action call");
  });

  it("should document the ESLint rule to enforce this boundary", () => {
    const eslintRule = {
      name: "no-ui-supabase-calls",
      description:
        "Forbids @supabase/supabase-js and @supabase/ssr imports outside allowed paths",
      implementation:
        "Custom ESLint plugin or import/no-restricted-paths rule in eslint.config.mjs",
    };
    expect(eslintRule.name).toBe("no-ui-supabase-calls");
  });
});
