import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  MailCheck,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/src/i18n/routing";

const metrics = [
  { label: "Impayés consolidés", value: "1,28M MAD" },
  { label: "Factures > 30 jours", value: "84" },
  { label: "Risques 69-21", value: "19" },
];

const workflows = [
  {
    title: "Importer",
    description: "Excel, CSV et balances âgées sont contrôlés avant validation.",
    icon: FileSpreadsheet,
  },
  {
    title: "Prioriser",
    description: "Les factures sont classées par ancienneté, montant et risque légal.",
    icon: BarChart3,
  },
  {
    title: "Relancer",
    description: "Chaque email ou WhatsApp laisse une preuve horodatée.",
    icon: MailCheck,
  },
  {
    title: "Reporter",
    description: "Un rapport mensuel par société synthétise le recouvrement.",
    icon: FileText,
  },
];

const features = [
  {
    title: "Pilotage cabinet multi-sociétés",
    description:
      "Une vue consolidée pour identifier les sociétés et clients qui concentrent le plus de risque.",
  },
  {
    title: "Balance âgée opérationnelle",
    description:
      "Regroupement 0-30, 30-60 et 60+ jours avec montants en MAD et priorités de relance.",
  },
  {
    title: "Suivi Law 69-21",
    description:
      "Alertes sur les factures qui approchent ou dépassent le seuil de délai de paiement.",
  },
  {
    title: "Historique de relance",
    description: "Journal complet par facture avec canal, destinataire, date, statut et résultat.",
  },
  {
    title: "Import contrôlé",
    description:
      "Mapping de colonnes, détection de doublons et validation avant création des factures.",
  },
  {
    title: "Accès cabinet et PME",
    description:
      "Les données restent cloisonnées par société avec accès délégué au cabinet comptable.",
  },
];

export default function LocaleRootPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative isolate min-h-[92svh] overflow-hidden border-b bg-background">
        <div className="absolute inset-0 -z-10 opacity-95">
          <DashboardBackdrop />
        </div>
        <div className="absolute inset-0 -z-10 bg-background/72" />

        <header className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="eFacturation">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Receipt />
            </span>
            <span className="text-sm font-semibold">eFacturation</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Connexion</Link>
            </Button>
            <Button asChild>
              <Link href="/onboarding">
                <span className="sm:hidden">Démo</span>
                <span className="hidden sm:inline">Demander une démo</span>
              </Link>
            </Button>
          </nav>
        </header>

        <div className="mx-auto flex min-h-[calc(92svh-4rem)] w-full max-w-7xl items-center px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">SaaS recouvrement</Badge>
              <Badge variant="outline">Cabinets comptables · PME marocaines</Badge>
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl">
              eFacturation
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              La plateforme qui transforme les factures impayées en plan d’action clair: exposition
              cabinet, relances documentées, alertes Law 69-21 et rapports mensuels prêts à
              partager.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/onboarding">
                  Planifier une démo
                  <ArrowRight />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">Voir le tableau de bord</Link>
              </Button>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-md border bg-background/85 p-4 shadow-sm"
                >
                  <div className="text-2xl font-semibold">{metric.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/30 py-12">
        <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          {workflows.map((item) => (
            <div key={item.title} className="rounded-md border bg-background p-5">
              <item.icon className="mb-4 text-primary" />
              <h2 className="text-base font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge variant="outline">Pourquoi maintenant</Badge>
            <h2 className="mt-4 text-3xl font-semibold leading-tight">
              Les cabinets ne peuvent plus piloter le recouvrement avec des fichiers dispersés.
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              eFacturation centralise les créances, expose les risques et garde une trace
              exploitable de chaque action de recouvrement.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30 py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <Badge variant="secondary">Démo guidée</Badge>
            <h2 className="mt-4 text-3xl font-semibold leading-tight">
              Un scénario clair pour convaincre un cabinet en quinze minutes.
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Commencez par le portefeuille cabinet, ouvrez une société à risque, sélectionnez les
              factures critiques, puis montrez l’historique de relance et le rapport mensuel.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Parcours de démonstration</CardTitle>
              <CardDescription>Les écrans qui portent la valeur produit.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {[
                "Risque consolidé cabinet",
                "Balance âgée par société",
                "Alertes Law 69-21",
                "Import Excel contrôlé",
                "Relances email / WhatsApp",
                "Rapport mensuel PDF",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold">Prêt à montrer eFacturation?</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Utilisez la démo pour vendre le bénéfice: moins de retard caché, plus de preuves de
              relance, et une meilleure visibilité sur le risque client.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/login">Connexion</Link>
            </Button>
            <Button asChild>
              <Link href="/onboarding">Demander une démo</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function DashboardBackdrop() {
  return (
    <div className="absolute inset-y-16 right-[-6rem] hidden w-[70rem] rotate-[-2deg] lg:block">
      <div className="rounded-md border bg-background shadow-2xl">
        <div className="flex h-14 items-center justify-between border-b px-5">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Building2 />
            Portefeuille cabinet
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>Casablanca</span>
            <span>18 sociétés</span>
            <span>Mai 2026</span>
          </div>
        </div>
        <div className="grid grid-cols-[15rem_1fr]">
          <aside className="border-r bg-muted/40 p-4">
            <div className="mb-6 text-xs font-medium text-muted-foreground">Navigation</div>
            {["Pilotage cabinet", "Sociétés clientes", "Factures", "Relances", "Rapports"].map(
              (item, index) => (
                <div
                  key={item}
                  className={`mb-2 rounded-md px-3 py-2 text-sm ${
                    index === 0 ? "bg-background font-medium shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {item}
                </div>
              ),
            )}
            <div className="mt-8 rounded-md border bg-background p-3">
              <div className="flex items-center justify-between gap-2 text-xs font-medium">
                <span>Risque 69-21</span>
                <span className="rounded-full bg-destructive px-2 py-0.5 text-destructive-foreground">
                  19
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                À traiter sous 10 jours
              </p>
            </div>
          </aside>
          <div className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Vue consolidée</div>
                <div className="text-2xl font-semibold">Pilotage des impayés</div>
              </div>
              <div className="rounded-md border px-3 py-2 text-sm">Exporter rapport</div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                ["Total impayé", "1.284.500 MAD", ShieldCheck],
                ["Factures > 30 j", "84", AlertTriangle],
                ["Risque 69-21", "19", AlertTriangle],
                ["Relances du jour", "31", MailCheck],
              ].map(([label, value, Icon]) => (
                <div
                  key={label as string}
                  className="rounded-md border bg-background p-4 shadow-sm"
                >
                  <Icon className="mb-4 text-muted-foreground" />
                  <div className="text-xs text-muted-foreground">{label as string}</div>
                  <div className="mt-1 text-xl font-semibold">{value as string}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-[1fr_20rem] gap-4">
              <div className="rounded-md border bg-background p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="font-semibold">Seuil Law 69-21 à surveiller</div>
                  <Badge variant="destructive">3 factures</Badge>
                </div>
                {["FAC-2026-1182", "FAC-2026-0934", "FAC-2026-0771"].map((invoice, index) => (
                  <div
                    key={invoice}
                    className="mb-3 flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <div className="text-sm font-medium">{invoice}</div>
                      <div className="text-xs text-muted-foreground">Client à relancer</div>
                    </div>
                    <span className="rounded-full bg-destructive px-2 py-1 text-xs text-destructive-foreground">
                      J-{6 + index * 3}
                    </span>
                  </div>
                ))}
              </div>
              <div className="rounded-md border bg-background p-4">
                <div className="mb-4 font-semibold">Sociétés à traiter</div>
                {["Atlas Distribution", "Medilog Services", "NorthBuild SARL"].map((company) => (
                  <div key={company} className="mb-4 border-b pb-3 last:mb-0 last:border-b-0">
                    <div className="text-sm font-medium">{company}</div>
                    <div className="mt-1 text-xs text-muted-foreground">Créances en retard</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
