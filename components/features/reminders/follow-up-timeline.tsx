"use client";

import { Badge } from "@/components/ui/badge";

type FollowUpEvent = {
  id: string
  title: string
  timestamp: string
  channel: "email" | "whatsapp" | "manual"
  outcome: string
}

type FollowUpTimelineProps = {
  events: FollowUpEvent[]
}

export function FollowUpTimeline({ events }: FollowUpTimelineProps) {
  return (
    <div className="space-y-4 rounded-md border bg-card p-4">
      <div>
        <h3 className="text-sm font-semibold">Historique de suivi</h3>
        <p className="text-xs text-muted-foreground">Événements horodatés pour preuve de relance.</p>
      </div>
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="flex gap-3">
            <div className="mt-1 size-2 rounded-full bg-primary" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{event.title}</span>
                <Badge variant="outline">{event.channel}</Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {event.timestamp} · {event.outcome}
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="rounded-md bg-muted/50 p-4 text-sm text-muted-foreground">
            Aucun événement de relance pour cette facture.
          </div>
        )}
      </div>
    </div>
  );
}
