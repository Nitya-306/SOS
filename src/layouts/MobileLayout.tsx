import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useEmergency } from '../context/EmergencyContext';
import { Home, Users, Clock, LogOut } from 'lucide-react';

export default function MobileLayout() {
  const { isEmergencyActive, logout } = useEmergency();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-md bg-background min-h-screen flex flex-col relative border-x border-border shadow-2xl">
      {/* Header */}
      <header className={`p-4 border-b border-border flex justify-between items-center ${isEmergencyActive ? 'bg-accent text-accent-foreground' : 'bg-background'}`}>
        <div className="font-bold tracking-tight text-xl">SOS System</div>
        <button onClick={handleLogout} className="p-2 hover:bg-black/5 rounded">
          <LogOut size={20} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around p-3 pb-safe">
        <NavLink 
          to="/home" 
          className={({isActive}) => `flex flex-col items-center gap-1 p-2 ${isActive ? 'text-primary font-bold' : 'text-muted-foreground'}`}
        >
          <Home size={24} strokeWidth={isEmergencyActive ? 3 : 2} className={isEmergencyActive ? 'text-accent animate-pulse' : ''} />
          <span className="text-xs">Home</span>
        </NavLink>
        
        <NavLink 
          to="/contacts" 
          className={({isActive}) => `flex flex-col items-center gap-1 p-2 ${isActive ? 'text-primary font-bold' : 'text-muted-foreground'}`}
        >
          <Users size={24} />
          <span className="text-xs">Contacts</span>
        </NavLink>

        <NavLink 
          to="/history" 
          className={({isActive}) => `flex flex-col items-center gap-1 p-2 ${isActive ? 'text-primary font-bold' : 'text-muted-foreground'}`}
        >
          <Clock size={24} />
          <span className="text-xs">History</span>
        </NavLink>
      </nav>
    </div>
  );
}
