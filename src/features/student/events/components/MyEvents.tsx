import { useEffect, useState } from 'react';
import { CalendarDays, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Event } from '@/features/admin/events/event.type';
import { getMyEvents } from '../services/eventService';

function formatDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function MyEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const rows = await getMyEvents();
        if (active) setEvents(rows);
      } catch {
        if (active) setError('Failed to load your events. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          <CalendarDays size={14} className="text-primary" />
          Events
        </p>
        <h1 className="type-heading-2 text-ink">My Events</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Events targeted at your year level.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-ink-muted">Loading…</p>
      ) : error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-hairline py-12 text-center">
          <CalendarDays className="h-8 w-8 text-ink-faint" />
          <p className="text-sm font-medium text-ink">No events yet</p>
          <p className="text-xs text-ink-muted">
            Events for your year level will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {events.map((event) => (
            <Card key={event.eventId}>
              <CardContent className="flex flex-col gap-2 p-4">
                <p className="font-medium text-ink">{event.title}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDate(event.startDate)} – {formatDate(event.endDate)}
                  </span>
                </div>
                {event.targetYearLevels.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {event.targetYearLevels.map((yearLevel) => (
                      <Badge key={yearLevel} variant="outline">
                        {yearLevel}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
