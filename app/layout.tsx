import type { ReactNode } from "react";

/**
 * Root layout — required by Next.js App Router.
 * This is a passthrough; the real layout with html/body lives in app/[locale]/layout.tsx
 * so next-intl can set lang and dir on <html>.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
