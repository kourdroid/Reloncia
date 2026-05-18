import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link } from "@/src/i18n/routing";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Bienvenue sur eFacturation</h1>
          <p className="text-muted-foreground">
            Commençons par configurer votre espace.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Création de compte</CardTitle>
            <CardDescription>
              Veuillez renseigner les informations de votre structure.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Type de compte</Label>
              <RadioGroup defaultValue="cabinet" className="flex gap-4">
                <div className="flex items-center space-x-2 border p-3 rounded-md flex-1 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors">
                  <RadioGroupItem value="cabinet" id="cabinet" />
                  <Label htmlFor="cabinet" className="cursor-pointer">Cabinet Comptable</Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-md flex-1 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors">
                  <RadioGroupItem value="sme" id="sme" />
                  <Label htmlFor="sme" className="cursor-pointer">Entreprise (PME)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nom de la structure</Label>
              <Input id="name" placeholder="Ex: Cabinet Audit & Co" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ice">Identifiant Commun de l'Entreprise (ICE)</Label>
              <Input id="ice" placeholder="15 chiffres" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email de contact</Label>
                <Input id="email" type="email" placeholder="contact@domaine.ma" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" type="tel" placeholder="+212 5..." required />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" asChild>
              <Link href="/login">Retour</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Créer l'espace</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
