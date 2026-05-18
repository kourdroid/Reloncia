"use client";

import { Mail, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ReminderActionToolbar() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-medium">Relances sélectionnées</div>
          <div className="text-xs text-muted-foreground">
            Chaque envoi créera un événement horodaté dans l'historique.
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select defaultValue="email">
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Canal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">
                <span className="flex items-center gap-2">
                  <Mail />
                  Email
                </span>
              </SelectItem>
              <SelectItem value="whatsapp">
                <span className="flex items-center gap-2">
                  <MessageCircle />
                  WhatsApp
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2">
            <Send />
            Envoyer relance
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
