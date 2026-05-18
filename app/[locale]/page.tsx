import { redirect } from "next/navigation";

/**
 * Root locale page — redirects to the dashboard.
 * In a real app with auth, this would check the session first.
 */
export default async function LocaleRootPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/login`);
}
