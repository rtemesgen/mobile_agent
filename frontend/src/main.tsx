import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Shield, WalletCards, ReceiptText, Landmark, RefreshCcw, LogOut } from 'lucide-react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { MobiAgentSettingsPage } from './pages/MobiAgentSettingsPage';
import { MNOWalletSettingsPage } from './pages/MNOWalletSettingsPage';
import { MNOWalletTransactionsPage } from './pages/MNOWalletTransactionsPage';
import { ExchangeRatePage } from './pages/ExchangeRatePage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import './styles.css';

type Page = 'accounts' | 'wallets' | 'transactions' | 'rates' | 'users';
function AppShell() {
  const { session, logout } = useAuth(); const [page, setPage] = useState<Page>('accounts');
  if (!session) return <LoginPage />;
  const nav = [
    ['accounts', Landmark, 'Accounts'], ['wallets', WalletCards, 'Wallets'], ['transactions', ReceiptText, 'Transactions'], ['rates', RefreshCcw, 'Rates'], ...(session.role === 'ADMIN' ? [['users', Shield, 'Users'] as const] : [])
  ] as const;
  return <div className="app"><aside><h2>Mobi Agent</h2><p>{session.name}<br/><small>{session.role}</small></p><nav>{nav.map(([key, Icon, label]) => <button className={page===key ? 'active' : ''} key={key} onClick={()=>setPage(key as Page)}><Icon size={18}/>{label}</button>)}</nav><button className="logout" onClick={logout}><LogOut size={18}/>Logout</button></aside><main>{page==='accounts' && <MobiAgentSettingsPage/>}{page==='wallets' && <MNOWalletSettingsPage/>}{page==='transactions' && <MNOWalletTransactionsPage/>}{page==='rates' && <ExchangeRatePage/>}{page==='users' && session.role==='ADMIN' && <AdminUsersPage/>}</main></div>;
}
createRoot(document.getElementById('root')!).render(<AuthProvider><AppShell /></AuthProvider>);
