import { useState, useEffect } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { AlertTriangle, MapPin, Radio, XCircle, CheckCircle2, Phone, MessageSquare, Send, RefreshCw } from 'lucide-react';

export default function Home() {
  const { user, isEmergencyActive, startEmergency, stopEmergency, sendAlerts, callContact, currentLocation, contacts } = useEmergency();
  const [confirming, setConfirming] = useState(false);
  const [alertsSent, setAlertsSent] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<string | null>(null);

  const handleSOSClick = () => {
    if (contacts.length === 0) {
      alert("Please add at least one emergency contact first.");
      return;
    }
    setConfirming(true);
  };

  const confirmSOS = () => {
    setConfirming(false);
    startEmergency();
    setAlertsSent(false);
  };

  // Once emergency starts and we get location, send alerts automatically
  useEffect(() => {
    if (isEmergencyActive && !alertsSent) {
      // Small delay to let GPS acquire location
      const timer = setTimeout(() => {
        sendAlerts(currentLocation);
        setAlertsSent(true);
        setLastSentTime(new Date().toLocaleTimeString());
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isEmergencyActive, currentLocation, alertsSent]);

  // Reset state when emergency is stopped
  useEffect(() => {
    if (!isEmergencyActive) {
      setAlertsSent(false);
      setLastSentTime(null);
    }
  }, [isEmergencyActive]);

  const handleResendAll = () => {
    sendAlerts(currentLocation);
    setLastSentTime(new Date().toLocaleTimeString());
  };

  const handleSendToOne = (phone: string) => {
    const name = user?.name || 'Someone';
    const locationText = currentLocation
      ? `My live location: https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`
      : 'Location is being acquired...';
    const message = `🚨 EMERGENCY SOS from ${name}!\nI need help immediately!\n${locationText}\n\nThis is an automated emergency alert.`;
    window.open(`sms:${phone}?body=${encodeURIComponent(message)}`, '_blank');
  };

  const mapLink = currentLocation ? `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}` : null;

  return (
    <div className="p-6 h-full flex flex-col justify-center">
      
      {!isEmergencyActive ? (
        <div className="flex flex-col items-center">
          <p className="text-center mb-12 text-lg text-muted-foreground">
            Hi, <strong>{user?.name}</strong>.<br/>Press the button below in case of an emergency.
          </p>

          {!confirming ? (
            <button 
              onClick={handleSOSClick}
              className="relative w-64 h-64 rounded-full bg-accent text-accent-foreground shadow-[0_0_40px_rgba(229,57,53,0.4)] flex flex-col justify-center items-center active:scale-95 transition-transform border-[8px] border-accent/20"
            >
              <AlertTriangle size={64} className="mb-2" />
              <span className="text-4xl font-extrabold tracking-widest">SOS</span>
            </button>
          ) : (
            <div className="bg-card p-6 border-2 border-accent text-center animate-in fade-in zoom-in w-full max-w-sm">
              <h2 className="text-2xl font-bold text-accent mb-4 uppercase">Confirm Emergency</h2>
              <p className="mb-2 font-medium">This will:</p>
              <ul className="text-left text-sm text-muted-foreground mb-6 space-y-2 pl-4">
                <li className="flex items-center gap-2"><MessageSquare size={14} className="text-accent shrink-0" /> Send SMS with your location to all {contacts.length} contact(s)</li>
                <li className="flex items-center gap-2"><MapPin size={14} className="text-accent shrink-0" /> Share your real-time GPS location</li>
                <li className="flex items-center gap-2"><Phone size={14} className="text-accent shrink-0" /> Allow you to call contacts directly</li>
              </ul>
              <div className="flex gap-4">
                <button onClick={() => setConfirming(false)} className="flex-1 bg-secondary text-secondary-foreground p-3 font-bold uppercase">Cancel</button>
                <button onClick={confirmSOS} className="flex-1 bg-accent text-accent-foreground p-3 font-bold uppercase">Yes, Send</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col h-full animate-in fade-in">
          {/* Active Emergency Header */}
          <div className="bg-accent/10 border-2 border-accent p-6 mb-6 flex flex-col items-center text-center">
            <Radio size={48} className="text-accent animate-pulse mb-4" />
            <h2 className="text-2xl font-bold text-accent uppercase tracking-widest mb-2">SOS Active</h2>
            {lastSentTime && (
              <p className="font-mono text-xs text-accent/80">Last alert sent at {lastSentTime}</p>
            )}
          </div>

          <div className="space-y-4 mb-auto overflow-y-auto">
            {/* SMS Status */}
            <div className="bg-card p-4 border border-border flex items-start gap-4">
              <CheckCircle2 className="text-green-500 mt-1 shrink-0" />
              <div className="flex-1">
                <h4 className="font-bold">SMS Alert Triggered</h4>
                <p className="text-sm text-muted-foreground">
                  Emergency message with Google Maps location opened in your messaging app for {contacts.length} contact(s).
                </p>
              </div>
            </div>

            {/* Live Location */}
            <div className="bg-card p-4 border border-border flex items-start gap-4">
              <MapPin className="text-primary mt-1 shrink-0" />
              <div className="flex-1">
                <h4 className="font-bold">Live Location</h4>
                {currentLocation ? (
                  <>
                    <p className="text-sm text-muted-foreground font-mono mt-1">
                      {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                    </p>
                    <a href={mapLink!} target="_blank" rel="noreferrer" className="text-sm text-accent underline font-semibold block mt-2">
                      View on Google Maps ↗
                    </a>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground italic mt-1">Acquiring GPS signal...</p>
                )}
              </div>
            </div>

            {/* Resend to All Button */}
            <button 
              onClick={handleResendAll}
              className="w-full bg-accent/10 border-2 border-accent text-accent p-3 font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-accent/20 transition-colors"
            >
              <RefreshCw size={18} /> Resend Updated Location to All
            </button>

            {/* Contact Actions */}
            <div className="border border-border">
              <div className="bg-secondary/50 p-3 border-b border-border">
                <h4 className="font-bold text-sm uppercase tracking-wider">Quick Actions — Contacts</h4>
              </div>
              <div className="divide-y divide-border">
                {contacts.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-bold">{c.name}</p>
                      <p className="text-xs font-mono text-muted-foreground">{c.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSendToOne(c.phone)}
                        className="bg-primary/10 border border-primary text-primary p-2 hover:bg-primary/20 transition-colors"
                        title={`Send SMS to ${c.name}`}
                      >
                        <Send size={16} />
                      </button>
                      <button
                        onClick={() => callContact(c.phone)}
                        className="bg-green-500/10 border border-green-500 text-green-500 p-2 hover:bg-green-500/20 transition-colors"
                        title={`Call ${c.name}`}
                      >
                        <Phone size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={stopEmergency}
            className="mt-8 w-full border-4 border-primary text-primary p-4 font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors flex justify-center items-center gap-2"
          >
            <XCircle /> Stop Emergency
          </button>
        </div>
      )}
    </div>
  );
}
