import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { DashboardStats, MnoAccount, MnoWallet } from '../api/types';
import { DashboardKPICard } from '../components/DashboardKPICard';
import { Modal } from '../components/Modal';
const blank: MnoWallet = { agentId: 0, name: '', network: '', balance: 0 };
export function MNOWalletSettingsPage() {
  const [wallets, setWallets] = useState<MnoWallet[]>([]); const [accounts, setAccounts] = useState<MnoAccount[]>([]); const [stats, setStats] = useState<DashboardStats | null>(null); const [edit, setEdit] = useState<MnoWallet | null>(null);
  const load = () => { api.wallets().then(setWallets); api.accounts().then(setAccounts); api.dashboard().then(setStats); }; useEffect(load, []);
  async function save() { if (!edit) return; await api.saveWallet(edit); setEdit(null); load(); }
  return <section><div className="sectionHead"><h1>MNO Wallets</h1><button onClick={()=>setEdit({...blank, agentId: accounts[0]?.id ?? 0})}>New Wallet</button></div><div className="kpis"><DashboardKPICard label="Wallets" value={stats?.walletCount ?? 0}/><DashboardKPICard label="Total balance" value={stats?.totalWalletBalance ?? 0}/></div><div className="cards">{wallets.map(w => <article className="card" key={w.id}><h3>{w.name}</h3><p>{w.network}</p><p>Balance {w.balance}</p><button onClick={()=>setEdit(w)}>Edit</button><button className="danger" onClick={async()=>{await api.deleteWallet(w.id!); load();}}>Delete</button></article>)}</div>{edit && <Modal title="MNO Wallet" onClose={()=>setEdit(null)} onSubmit={e=>{e.preventDefault(); save();}}><label>Account<select value={edit.agentId} onChange={e=>setEdit({...edit,agentId:+e.target.value})}>{accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></label><label>Name<input value={edit.name} onChange={e=>setEdit({...edit,name:e.target.value})}/></label><label>Network<input value={edit.network} onChange={e=>setEdit({...edit,network:e.target.value})}/></label><label>Balance<input type="number" value={edit.balance} onChange={e=>setEdit({...edit,balance:+e.target.value})}/></label></Modal>}</section>;
}
