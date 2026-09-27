import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
}

export interface EmergencyEvent {
  id: string;
  timestamp: string;
  location: { lat: number; lng: number } | null;
  status: 'active' | 'resolved';
}

interface EmergencyContextType {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
  contacts: Contact[];
  addContact: (c: Contact) => void;
  removeContact: (id: string) => void;
  isEmergencyActive: boolean;
  startEmergency: () => void;
  stopEmergency: () => void;
  sendAlerts: (location: { lat: number; lng: number } | null) => void;
  callContact: (phone: string) => void;
  currentLocation: { lat: number; lng: number } | null;
  history: EmergencyEvent[];
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export function EmergencyProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sos_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('sos_contacts');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<EmergencyEvent[]>(() => {
    const saved = localStorage.getItem('sos_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Sync to local storage
  useEffect(() => {
    if (user) localStorage.setItem('sos_user', JSON.stringify(user));
    else localStorage.removeItem('sos_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sos_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('sos_history', JSON.stringify(history));
  }, [history]);

  // Location tracking logic when emergency is active
  useEffect(() => {
    if (isEmergencyActive) {
      if ('geolocation' in navigator) {
        // Get initial position immediately
        navigator.geolocation.getCurrentPosition(
          (pos) => setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          (err) => console.error("Location error", err)
        );
        // Watch for updates
        const id = navigator.geolocation.watchPosition(
          (pos) => setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          (err) => console.error("Watch location error", err),
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
        setWatchId(id);
      }
    } else {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }
      setCurrentLocation(null);
    }
    
    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [isEmergencyActive]);

  const login = (u: User) => setUser(u);
  const logout = () => setUser(null);

  const addContact = (c: Contact) => setContacts(prev => [...prev, c]);
  const removeContact = (id: string) => setContacts(prev => prev.filter(c => c.id !== id));

  // Build the emergency SMS body with a Google Maps link
  const buildAlertMessage = (loc: { lat: number; lng: number } | null) => {
    const name = user?.name || 'Someone';
    const locationText = loc
      ? `My live location: https://www.google.com/maps?q=${loc.lat},${loc.lng}`
      : 'Location is being acquired...';
    return `🚨 EMERGENCY SOS from ${name}!\nI need help immediately!\n${locationText}\n\nThis is an automated emergency alert.`;
  };

  // Send SMS to all contacts with location
  const sendAlerts = (loc: { lat: number; lng: number } | null) => {
    const message = buildAlertMessage(loc);
    const phones = contacts.map(c => c.phone).join(',');
    if (phones) {
      // Opens native SMS app with all contacts and pre-filled emergency message
      const smsUrl = `sms:${phones}?body=${encodeURIComponent(message)}`;
      window.open(smsUrl, '_blank');
    }
  };

  // Initiate a phone call to a specific contact
  const callContact = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const startEmergency = () => {
    setIsEmergencyActive(true);
    const newEvent: EmergencyEvent = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      location: currentLocation,
      status: 'active'
    };
    setHistory(prev => [newEvent, ...prev]);
  };

  const stopEmergency = () => {
    setIsEmergencyActive(false);
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[0] = { ...updated[0], status: 'resolved' };
      return updated;
    });
  };

  // Keep latest history location up to date if active
  useEffect(() => {
    if (isEmergencyActive && currentLocation && history.length > 0 && history[0].status === 'active') {
      setHistory(prev => {
        const updated = [...prev];
        updated[0] = { ...updated[0], location: currentLocation };
        return updated;
      });
    }
  }, [currentLocation, isEmergencyActive]);

  return (
    <EmergencyContext.Provider value={{
      user, login, logout,
      contacts, addContact, removeContact,
      isEmergencyActive, startEmergency, stopEmergency,
      sendAlerts, callContact,
      currentLocation, history
    }}>
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  const context = useContext(EmergencyContext);
  if (!context) throw new Error("useEmergency must be used within an EmergencyProvider");
  return context;
}
