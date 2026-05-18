import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "@/src/i18n/routing";
import { Receipt } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="p-3 bg-primary rounded-xl mb-2">
            <Receipt className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">eFacturation</h1>
          <p className="text-muted-foreground">
            Plateforme de Recouvrement pour Cabinets Comptables
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Connectez-vous pour accéder à votre espace cabinet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input id="email" type="email" placeholder="contact@cabinet.ma" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Oublié ?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" asChild>
              <Link href="/dashboard">Se connecter</Link>
            </Button>
            <p className="text-center text-sm text-muted-foreground w-full">
              Vous n'avez pas de compte ? <Link href="/onboarding" className="text-primary hover:underline">Demander une démo</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
