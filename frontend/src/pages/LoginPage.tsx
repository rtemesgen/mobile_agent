import { useAuth } from '../auth/AuthContext';
import { useState } from 'react';
import { BadgeCheck, BriefcaseBusiness, ShieldCheck, Sparkles } from 'lucide-react';

type Mode = 'login' | 'register';

export function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('agent@mobi.local');
  const [password, setPassword] = useState('agent123');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true); setError('');
    try {
      if (mode === 'register') await register(name, email, password);
      else await login(email, password);
    } catch (err) {
      setError(mode === 'register' ? 'Registration failed. Check the details or try another email.' : 'Login failed. Check your email and password.');
    } finally {
      setBusy(false);
    }
  }

  async function quick(email: string, password: string) {
    setEmail(email); setPassword(password); setMode('login'); setBusy(true); setError('');
    try { await login(email, password); } catch (err) { setError('Seeded login failed. Make sure the backend is running with an empty or seeded database.'); } finally { setBusy(false); }
  }

  return <main className="loginPage">
    <section className="loginHero" aria-label="Mobi Agent overview">
      <div className="brandMark"><Sparkles size={22} /> Mobi Agent</div>
      <h1>Operate mobile money accounts with a calmer control room.</h1>
      <p>Track agent accounts, cash at hand, MNO wallets, exchange rates, and transaction history from one focused workspace.</p>
      <div className="heroMetrics">
        <div><strong>Atomic</strong><span>wallet updates</span></div>
        <div><strong>JWT</strong><span>role access</span></div>
        <div><strong>Live</strong><span>KPI refresh</span></div>
      </div>
    </section>
    <section className="loginPanel">
      <div className="modeSwitch" role="tablist" aria-label="Authentication mode">
        <button type="button" className={mode === 'login' ? 'selected' : ''} onClick={() => setMode('login')}>Sign in</button>
        <button type="button" className={mode === 'register' ? 'selected' : ''} onClick={() => { setMode('register'); setPassword(''); }}>Register</button>
      </div>
      <form onSubmit={e => { e.preventDefault(); submit(); }}>
        <div className="formTitle">
          <h2>{mode === 'login' ? 'Welcome back' : 'Create an agent account'}</h2>
          <p>{mode === 'login' ? 'Use a seeded profile or your registered account.' : 'New accounts start as Mobi Agent users.'}</p>
        </div>
        {mode === 'register' && <label>Name<input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required /></label>}
        <label>Email<input value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required /></label>
        <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" required minLength={mode === 'register' ? 6 : undefined} /></label>
        {error && <p className="error">{error}</p>}
        <button className="primaryAction" disabled={busy}>{busy ? 'Working...' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
      </form>
      <div className="quickLogins">
        <button type="button" onClick={() => quick('agent@mobi.local', 'agent123')} disabled={busy}><BriefcaseBusiness size={18}/><span>Seed Agent</span></button>
        <button type="button" onClick={() => quick('admin@mobi.local', 'admin123')} disabled={busy}><ShieldCheck size={18}/><span>Seed Admin</span></button>
      </div>
      <p className="securityNote"><BadgeCheck size={16}/> Demo credentials are seeded only when the database is empty.</p>
    </section>
  </main>;
}
