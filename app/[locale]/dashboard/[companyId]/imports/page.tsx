import { ImportUpload } from "../../../../components/features/imports/import-upload";
import { ColumnMappingTable } from "../../../../components/features/imports/column-mapping-table";
import { ImportReviewTable } from "../../../../components/features/imports/import-review-table";

export default function ImportsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Imports</h2>
      <ImportUpload />
      <ColumnMappingTable />
      <ImportReviewTable />
    </div>
  );
}
