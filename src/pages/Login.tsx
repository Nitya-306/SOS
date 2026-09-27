import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmergency } from '../context/EmergencyContext';
import { ShieldAlert } from 'lucide-react';

export default function Login() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { login } = useEmergency();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      login({
        id: Date.now().toString(),
        name,
        phone,
        email: 'user@example.com' // Mock email for MVP
      });
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 max-w-md mx-auto">
      <div className="mb-12 flex flex-col items-center text-center">
        <div className="bg-accent text-accent-foreground p-4 mb-4">
          <ShieldAlert size={48} />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter mb-2">SOS Alert</h1>
        <p className="text-muted-foreground">Emergency Location & Sharing MVP</p>
      </div>

      <form onSubmit={handleLogin} className="w-full space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1 uppercase tracking-wider">Full Name</label>
          <input 
            type="text" 
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border-2 border-border p-3 focus:outline-none focus:border-primary transition-colors"
            placeholder="Jane Doe"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 uppercase tracking-wider">Phone Number</label>
          <input 
            type="tel" 
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full border-2 border-border p-3 focus:outline-none focus:border-primary transition-colors"
            placeholder="+1 555-0100"
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground p-4 font-bold uppercase tracking-widest mt-6 hover:bg-primary/90 transition-colors"
        >
          Enter System
        </button>
      </form>
    </div>
  );
}
