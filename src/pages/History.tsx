import { useEmergency } from '../context/EmergencyContext';
import { MapPin, CalendarClock } from 'lucide-react';

export default function History() {
  const { history } = useEmergency();

  return (
    <div className="p-6">
      <div className="mb-6 border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Emergency Log</h1>
        <p className="text-muted-foreground text-sm mt-1">Past SOS activations</p>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border">
          <p>No history found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map(ev => {
            const d = new Date(ev.timestamp);
            return (
              <div key={ev.id} className="border border-border p-4 bg-card relative">
                {ev.status === 'active' && (
                  <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] uppercase font-bold px-2 py-1 flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white block" /> Active
                  </div>
                )}
                
                <div className="flex items-start gap-3 mb-3">
                  <CalendarClock className="text-muted-foreground shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-bold text-sm">{d.toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground font-mono">{d.toLocaleTimeString()}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-muted-foreground shrink-0 mt-0.5" size={18} />
                  <div>
                    {ev.location ? (
                      <>
                        <p className="text-xs font-mono text-primary">
                          {ev.location.lat.toFixed(4)}, {ev.location.lng.toFixed(4)}
                        </p>
                        <a 
                          href={`https://www.google.com/maps?q=${ev.location.lat},${ev.location.lng}`}
                          target="_blank" rel="noreferrer"
                          className="text-xs text-accent underline mt-1 block"
                        >
                          Map Link
                        </a>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">Location unrecorded</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
