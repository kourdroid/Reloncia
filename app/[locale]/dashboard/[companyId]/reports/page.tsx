import { ReportGenerator } from "../../../../components/features/reports/report-generator";

type Props = {
  params: {
    locale: string;
    companyId: string;
  };
};

export default function ReportsPage({ params }: Props) {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Rapports Mensuels</h2>
        <p className="text-muted-foreground mt-1">
          Générez et téléchargez les rapports PDF de recouvrement pour{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">{params.companyId}</code>.
        </p>
      </div>
      <ReportGenerator companyId={params.companyId} />
    </div>
  );
}
