"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type ReportGeneratorProps = {
  companyId: string;
};

export function ReportGenerator({ companyId }: ReportGeneratorProps) {
  const t = useTranslations("Reports");

  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [isGenerating, setIsGenerating] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const MONTHS_FR = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - i);

  async function handleGenerate() {
    setIsGenerating(true);
    setSignedUrl(null);
    setError(null);

    try {
      const res = await fetch(
        `/api/export/${companyId}?month=${month}&year=${year}`
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      const data = await res.json();
      setSignedUrl(data.signedUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("reportError"));
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold">{t("generate")}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Sélectionnez le mois et l&apos;année pour générer le rapport PDF.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="report-month-select" className="text-sm font-medium">
            {t("month")}
          </label>
          <select
            id="report-month-select"
            data-testid="report-month-select"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-md border bg-background px-3 py-2 text-sm min-w-[140px]"
          >
            {MONTHS_FR.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="report-year-select" className="text-sm font-medium">
            {t("year")}
          </label>
          <select
            id="report-year-select"
            data-testid="report-year-select"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-md border bg-background px-3 py-2 text-sm min-w-[100px]"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {t("generating")}
              </>
            ) : (
              t("generate")
            )}
          </button>
        </div>
      </div>

      {/* Download Link */}
      {signedUrl && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 flex items-center justify-between">
          <span className="text-sm text-green-800 font-medium">{t("reportReady")}</span>
          <a
            href={signedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-green-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            {t("download")}
          </a>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Le lien de téléchargement expire après 1 heure. Confidentiel — ne pas redistribuer.
      </p>
    </div>
  );
}
