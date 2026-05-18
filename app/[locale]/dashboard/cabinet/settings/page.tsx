import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Settings2 } from "lucide-react";

export default function CabinetSettingsPage() {
  return (
    <div className="flex flex-col space-y-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Paramètres du Cabinet</h2>
          <p className="text-muted-foreground">
            Gérez les informations du cabinet et les accès de vos collaborateurs.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations Générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cabinetName">Nom du Cabinet</Label>
              <Input id="cabinetName" defaultValue="Cabinet Audit & Co" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ice">ICE</Label>
              <Input id="ice" defaultValue="123456789012345" disabled />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Mettre à jour</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Équipe & Accès</CardTitle>
              <CardDescription>
                Gérez les membres de votre cabinet et leurs rôles.
              </CardDescription>
            </div>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Inviter
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Admin Cabinet</TableCell>
                  <TableCell>admin@cabinet.ma</TableCell>
                  <TableCell><Badge>Administrateur</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" disabled>
                      <Settings2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Collaborateur 1</TableCell>
                  <TableCell>collab1@cabinet.ma</TableCell>
                  <TableCell><Badge variant="secondary">Collaborateur</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Settings2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
