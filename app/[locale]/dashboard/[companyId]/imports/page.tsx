import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileSpreadsheet } from "lucide-react";

export default function ImportsPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Importation de Factures</h2>
          <p className="text-muted-foreground">
            Importez vos factures depuis votre système comptable (.xlsx, .csv).
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nouvel Import</CardTitle>
          <CardDescription>
            Déposez votre fichier contenant la balance âgée ou le journal des ventes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <UploadCloud className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Cliquez pour importer ou glissez-déposez</h3>
              <p className="text-sm text-muted-foreground">Excel ou CSV (max 10MB)</p>
            </div>
            <Button className="mt-4">Sélectionner un fichier</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique des Imports</CardTitle>
          <CardDescription>
            Consultez les résultats des importations précédentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center gap-4">
                <FileSpreadsheet className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="font-medium">export_comptable_octobre.xlsx</p>
                  <p className="text-sm text-muted-foreground">12 Oct 2023 à 14:30</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-emerald-600">45 factures importées</p>
                <p className="text-sm text-muted-foreground">0 erreur</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
