"use client";

import { useTranslations } from "next-intl";

export function SendReminderDialog() {
  const t = useTranslations("Dashboard");

  return (
    <div className="p-4 border rounded shadow bg-white">
      <h3 className="font-bold">Send Reminder</h3>
      {/* Placeholder for form */}
    </div>
  );
}
