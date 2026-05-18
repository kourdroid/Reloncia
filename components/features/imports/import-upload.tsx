"use client";

import { FileSpreadsheet, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ImportUpload() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouvel import Excel</CardTitle>
        <CardDescription>
          Chargez une balance âgée, un journal de ventes ou un export comptable.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex min-h-72 cursor-pointer flex-col items-center justify-center gap-4 rounded-md border border-dashed bg-muted/30 p-8 text-center transition-colors hover:bg-muted/50">
          <div className="rounded-md bg-primary/10 p-4 text-primary">
            <UploadCloud />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Déposer un fichier ou parcourir</h3>
            <p className="text-sm text-muted-foreground">Formats acceptés: .xlsx, .csv · 10 MB max</p>
          </div>
          <Button className="gap-2">
            <FileSpreadsheet />
            Sélectionner un fichier
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
