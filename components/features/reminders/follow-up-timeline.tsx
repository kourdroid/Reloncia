"use client";

import { useTranslations } from "next-intl";

export function FollowUpTimeline({ events }: { events: any[] }) {
  const t = useTranslations("Dashboard");

  return (
    <div className="p-4 mt-4 border rounded shadow bg-white">
      <h3 className="font-bold">Timeline</h3>
      {/* Placeholder for timeline */}
    </div>
  );
}
