import { useState } from 'react';
import { useEmergency, Contact } from '../context/EmergencyContext';
import { Trash2, UserPlus } from 'lucide-react';

export default function Contacts() {
  const { contacts, addContact, removeContact } = useEmergency();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      addContact({ id: Date.now().toString(), name, phone });
      setName('');
      setPhone('');
      setIsAdding(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-end mb-6 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trusted Contacts</h1>
          <p className="text-muted-foreground text-sm mt-1">{contacts.length} Added</p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="bg-primary text-primary-foreground p-2 flex items-center gap-2 text-sm font-bold uppercase">
            <UserPlus size={16} /> Add
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-card p-4 border border-border mb-6 animate-in fade-in slide-in-from-top-4">
          <div className="space-y-3">
            <div>
              <input 
                type="text" placeholder="Contact Name" value={name} onChange={e => setName(e.target.value)} required
                className="w-full border border-border p-2 focus:border-primary outline-none"
              />
            </div>
            <div>
              <input 
                type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required
                className="w-full border border-border p-2 focus:border-primary outline-none"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-secondary p-2 uppercase text-xs font-bold">Cancel</button>
              <button type="submit" className="flex-1 bg-primary text-primary-foreground p-2 uppercase text-xs font-bold">Save</button>
            </div>
          </div>
        </form>
      )}

      {contacts.length === 0 && !isAdding ? (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border">
          <p>No contacts added yet.</p>
          <p className="text-sm mt-2">Add contacts to notify them during an emergency.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map(c => (
            <div key={c.id} className="flex justify-between items-center p-4 border border-border bg-card">
              <div>
                <p className="font-bold">{c.name}</p>
                <p className="text-sm font-mono text-muted-foreground mt-1">{c.phone}</p>
              </div>
              <button onClick={() => removeContact(c.id)} className="text-muted-foreground hover:text-accent p-2 transition-colors">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
