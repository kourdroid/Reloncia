import type { Metadata } from "next";
import { headers } from "next/headers";
import {
  ArrowUpRight,
  BadgeCheck,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Download,
  FileCheck2,
  FileSpreadsheet,
  Mail,
  MessageSquareText,
  ScanLine,
  Sparkles,
  TrendingUp,
} from "lucide-react";

type Locale = "fr" | "en" | "ar";

const content = {
  fr: {
    language: "EN",
    languageHref: "/en",
    nav: ["La méthode", "Le résultat", "Pour qui"],
    contact: "Demander une démo",
    eyebrow: "Recouvrement augmenté · Maroc",
    title: "Les impayés ne devraient jamais être une zone d’ombre.",
    intro:
      "Reloncia donne aux cabinets comptables une vue claire, documentée et actionnable de chaque créance client.",
    primary: "Demander une démo",
    secondary: "Découvrir la méthode",
    note: "Un aperçu produit — conçu pour les cabinets comptables et PME marocaines.",
    dashboardLabel: "Aperçu produit",
    dashboardTitle: "Portefeuille à traiter",
    dashboardMeta: "18 sociétés · Mai 2026",
    outstanding: "Encours à suivre",
    overdue: "Échéances dépassées",
    action: "À relancer cette semaine",
    actions: ["Import vérifié", "Priorités claires", "Relances tracées"],
    methodLabel: "Reloncia, en pratique",
    proofTitle: "De l’information dispersée à une action qui laisse une trace.",
    proofText:
      "Une seule lecture de votre portefeuille suffit pour savoir où agir, avec qui, et pourquoi maintenant.",
    flow: [
      ["Centraliser", "Importez vos fichiers et contrôlez la qualité avant de les exploiter."],
      ["Prioriser", "Faites émerger les montants, retards et échéances qui comptent vraiment."],
      ["Documenter", "Gardez une preuve claire de chaque relance, rapport et décision."],
    ],
    resultTitle: "Un pilotage plus calme. Une trésorerie mieux défendue.",
    resultText:
      "Reloncia transforme le suivi des créances en rituel opérationnel pour les équipes qui veulent anticiper plutôt que rattraper.",
    valueLabel: "La valeur, en un regard",
    bento: {
      portfolioTitle: "Une vue cabinet, société par société.",
      portfolioText: "Repérez immédiatement où se concentre l’encours et ouvrez la bonne conversation client.",
      riskTitle: "Les échéances critiques remontent avant l’urgence.",
      riskText: "Montant, ancienneté et seuil 69-21 réunis dans une priorité lisible.",
      timelineTitle: "Chaque relance devient une preuve.",
      timelineText: "Canal, date, destinataire et résultat restent attachés à la facture.",
      importTitle: "Vos fichiers deviennent exploitables.",
      importText: "Colonnes rapprochées, doublons détectés, lignes contrôlées avant validation.",
      reportTitle: "Le reporting est prêt à partager.",
      reportText: "Une synthèse mensuelle claire pour le cabinet, la direction et le client.",
      ready: "Données contrôlées",
      report: "Rapport mai 2026",
    },
    audienceLabel: "Pour les professionnels du chiffre",
    audienceTitle: "Pensé pour les équipes qui portent la confiance financière.",
    audiences: ["Cabinets comptables", "Directions financières", "PME en croissance"],
    finalTitle: "Faites de chaque impayé un plan d’action.",
    finalText: "Voyez comment Reloncia peut structurer le suivi de vos créances.",
    conversationLabel: "Commencer la conversation",
    emailSubject: "Demande de démo Reloncia",
    footer: "Reloncia · Recouvrement d’impayés, avec méthode.",
  },
  en: {
    language: "FR",
    languageHref: "/fr",
    nav: ["The method", "The outcome", "For whom"],
    contact: "Request a demo",
    eyebrow: "Smarter receivables · Morocco",
    title: "Outstanding invoices should never be a blind spot.",
    intro:
      "Reloncia gives accounting firms a clear, documented and actionable view of every client receivable.",
    primary: "Request a demo",
    secondary: "Discover the method",
    note: "A product preview — designed for Moroccan accounting firms and SMEs.",
    dashboardLabel: "Product preview",
    dashboardTitle: "Portfolio to act on",
    dashboardMeta: "18 companies · May 2026",
    outstanding: "Outstanding balance",
    overdue: "Overdue invoices",
    action: "To follow up this week",
    actions: ["Checked import", "Clear priorities", "Tracked follow-ups"],
    methodLabel: "Reloncia in practice",
    proofTitle: "From scattered information to action with a record.",
    proofText:
      "One view of your portfolio is enough to know where to act, with whom, and why now.",
    flow: [
      ["Centralise", "Import files and check data quality before using it."],
      ["Prioritise", "Surface the amounts, delays and deadlines that genuinely matter."],
      ["Document", "Keep clear evidence of every follow-up, report and decision."],
    ],
    resultTitle: "Calmer operations. Better-defended cash flow.",
    resultText:
      "Reloncia turns receivables tracking into an operating rhythm for teams that want to anticipate, not catch up.",
    valueLabel: "The value, at a glance",
    bento: {
      portfolioTitle: "A firm-wide view, company by company.",
      portfolioText: "See where outstanding balances concentrate and open the right client conversation.",
      riskTitle: "Critical deadlines surface before they become urgent.",
      riskText: "Amount, ageing and Law 69-21 thresholds become one readable priority.",
      timelineTitle: "Every follow-up becomes evidence.",
      timelineText: "Channel, date, recipient and outcome remain attached to the invoice.",
      importTitle: "Your files become usable data.",
      importText: "Columns matched, duplicates detected and rows checked before confirmation.",
      reportTitle: "Reporting is ready to share.",
      reportText: "A clear monthly summary for the firm, finance team and client.",
      ready: "Data checked",
      report: "May 2026 report",
    },
    audienceLabel: "For finance professionals",
    audienceTitle: "Made for teams trusted with financial clarity.",
    audiences: ["Accounting firms", "Finance teams", "Growing SMEs"],
    finalTitle: "Turn every outstanding invoice into a plan of action.",
    finalText: "See how Reloncia can structure your receivables follow-up.",
    conversationLabel: "Start the conversation",
    emailSubject: "Reloncia demo request",
    footer: "Reloncia · Receivables recovery, with method.",
  },
} as const;

function getContent(locale: string) {
  return content[locale === "en" ? "en" : "fr"];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const copy = getContent(locale);
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: "Reloncia — Receivables recovery, with method",
    description: copy.intro,
    alternates: { canonical: `/${locale === "en" ? "en" : "fr"}` },
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "fr_FR",
      title: "Reloncia",
      description: copy.title,
      images: [{ url: "/og-reloncia.png", width: 1200, height: 630, alt: "Reloncia product preview" }],
    },
    twitter: { card: "summary_large_image", title: "Reloncia", description: copy.title, images: ["/og-reloncia.png"] },
  };
}

export default async function LocaleRootPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const copy = getContent(locale);
  const demoHref = `mailto:contact@kourchal.com?subject=${encodeURIComponent(copy.emailSubject)}`;

  return (
    <main className="reloncia">
      <section className="reloncia-hero">
        <div className="reloncia-shell">
          <header className="reloncia-nav">
            <a className="reloncia-wordmark" href={locale === "en" ? "/en" : "/fr"} aria-label="Reloncia home">
              <span aria-hidden="true">R</span>eloncia
            </a>
            <nav aria-label="Primary navigation">
              <a href="#method">{copy.nav[0]}</a>
              <a href="#outcome">{copy.nav[1]}</a>
              <a href="#teams">{copy.nav[2]}</a>
            </nav>
            <div className="reloncia-nav-actions">
              <a className="reloncia-language" href={copy.languageHref} lang={copy.language.toLowerCase()}>{copy.language}</a>
              <a className="reloncia-nav-cta" href={demoHref}>{copy.contact}</a>
            </div>
          </header>

          <div className="reloncia-hero-grid">
            <div className="reloncia-hero-copy">
              <p className="reloncia-eyebrow"><span />{copy.eyebrow}</p>
              <h1>{copy.title}</h1>
              <p className="reloncia-intro">{copy.intro}</p>
              <div className="reloncia-hero-actions mb-6">
                <a className="reloncia-button reloncia-button--lime" href={demoHref}>{copy.primary}<ArrowUpRight /></a>
                <a className="reloncia-text-link" href="#method">{copy.secondary}<ChevronRight /></a>
              </div>
              <p className="reloncia-note mt-10"><Sparkles />{copy.note}</p>
            </div>

            <div className="reloncia-preview" aria-label={copy.dashboardLabel}>
              <div className="reloncia-preview-topline"><span>{copy.dashboardLabel}</span><BadgeCheck /></div>
              <div className="reloncia-preview-heading"><div><p>{copy.dashboardTitle}</p><span>{copy.dashboardMeta}</span></div><span className="reloncia-preview-export" aria-hidden="true">PDF</span></div>
              <div className="reloncia-balance"><span>{copy.outstanding}</span><strong>1 284 500 <small>MAD</small></strong><div><i /><i /><i /><i /><i /></div></div>
              <div className="reloncia-preview-lower">
                <div className="reloncia-invoice-list">
                  <p>{copy.overdue}</p>
                  {["FAC-2026-1182", "FAC-2026-0934", "FAC-2026-0771"].map((invoice, index) => <div key={invoice}><span><b>{invoice}</b><small>{copy.actions[index]}</small></span><em>J-{6 + index * 3}</em></div>)}
                </div>
                <div className="reloncia-preview-aside"><p>{copy.action}</p><strong>19</strong><span>3&nbsp;{copy.actions[1].toLowerCase()}</span><div className="reloncia-aside-icons"><Mail /><FileCheck2 /><CircleDollarSign /></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="reloncia-proof" id="method">
        <div className="reloncia-shell reloncia-proof-grid">
          <div><p className="reloncia-section-label">{copy.methodLabel}</p><h2>{copy.proofTitle}</h2></div>
          <p className="reloncia-proof-text">{copy.proofText}</p>
        </div>
        <div className="reloncia-flow reloncia-shell">
          {copy.flow.map(([title, description], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}
        </div>
      </section>

      <section className="reloncia-outcomes" id="outcome">
        <div className="reloncia-shell">
          <div className="reloncia-outcome-head"><div><p className="reloncia-section-label">{copy.valueLabel}</p><h2>{copy.resultTitle}</h2></div><p>{copy.resultText}</p></div>
          <div className="reloncia-bento">
            <article className="reloncia-bento-card reloncia-bento-portfolio">
              <div className="reloncia-bento-icon"><TrendingUp /></div>
              <h3>{copy.bento.portfolioTitle}</h3>
              <p>{copy.bento.portfolioText}</p>
              <div className="reloncia-company-bars" aria-hidden="true">
                {[84, 62, 43].map((value, index) => <div key={value}><span>{["Atlas Distribution", "Medilog Services", "NorthBuild SARL"][index]}</span><i><b style={{ width: `${value}%` }} /></i><em>{value}%</em></div>)}
              </div>
            </article>
            <article className="reloncia-bento-card reloncia-bento-risk">
              <div className="reloncia-bento-icon"><Clock3 /></div>
              <span className="reloncia-risk-day">J-6</span>
              <h3>{copy.bento.riskTitle}</h3>
              <p>{copy.bento.riskText}</p>
            </article>
            <article className="reloncia-bento-card reloncia-bento-timeline">
              <div className="reloncia-bento-icon"><MessageSquareText /></div>
              <h3>{copy.bento.timelineTitle}</h3>
              <p>{copy.bento.timelineText}</p>
              <div className="reloncia-mini-timeline" aria-hidden="true"><span><i />E-mail · 09:42</span><span><i />WhatsApp · 14:10</span><span><i />Réponse · 16:28</span></div>
            </article>
            <article className="reloncia-bento-card reloncia-bento-import">
              <div className="reloncia-bento-icon"><ScanLine /></div>
              <span className="reloncia-data-ready"><FileCheck2 />{copy.bento.ready}</span>
              <h3>{copy.bento.importTitle}</h3>
              <p>{copy.bento.importText}</p>
              <div className="reloncia-file-chip"><FileSpreadsheet /><span>balance_agee_mai.xlsx</span><b>128</b></div>
            </article>
            <article className="reloncia-bento-card reloncia-bento-report">
              <div className="reloncia-report-copy"><div className="reloncia-bento-icon"><Download /></div><h3>{copy.bento.reportTitle}</h3><p>{copy.bento.reportText}</p></div>
              <div className="reloncia-report-sheet" aria-hidden="true"><span>RELONCIA</span><strong>{copy.bento.report}</strong><i /><i /><i /><div><b /><b /><b /><b /></div></div>
            </article>
          </div>
        </div>
      </section>

      <section className="reloncia-teams" id="teams">
        <div className="reloncia-shell"><p className="reloncia-section-label">{copy.audienceLabel}</p><h2>{copy.audienceTitle}</h2><div>{copy.audiences.map((audience) => <span key={audience}>{audience}</span>)}</div></div>
      </section>

      <section className="reloncia-final">
        <div className="reloncia-shell"><div><p className="reloncia-section-label">{copy.conversationLabel}</p><h2>{copy.finalTitle}</h2><p>{copy.finalText}</p></div><a className="reloncia-button reloncia-button--dark" href={demoHref}>{copy.primary}<Mail /></a></div>
      </section>

      <footer className="reloncia-footer"><div className="reloncia-shell"><span className="reloncia-wordmark"><b>R</b>eloncia</span><p>{copy.footer}</p><a href="mailto:contact@kourchal.com">contact@kourchal.com</a></div></footer>
    </main>
  );
}
