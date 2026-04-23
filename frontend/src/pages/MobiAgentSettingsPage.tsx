import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { DashboardStats, MnoAccount } from '../api/types';
import { DashboardKPICard } from '../components/DashboardKPICard';
import { Modal } from '../components/Modal';
const blank: MnoAccount = { name: '', country: '', mobileNumber: '', emoneyAmount: 0, network: '', cashAtHand: 0, accountType: '' };
export function MobiAgentSettingsPage() {
  const [items, setItems] = useState<MnoAccount[]>([]); const [stats, setStats] = useState<DashboardStats | null>(null); const [edit, setEdit] = useState<MnoAccount | null>(null);
  const load = () => { api.accounts().then(setItems); api.dashboard().then(setStats); }; useEffect(load, []);
  async function save() { if (!edit) return; await api.saveAccount(edit); setEdit(null); load(); }
  return <section><div className="sectionHead"><h1>MNO Accounts</h1><button onClick={() => setEdit(blank)}>New Account</button></div><div className="kpis"><DashboardKPICard label="Accounts" value={stats?.accountCount ?? 0}/><DashboardKPICard label="E-money" value={stats?.totalEmoney ?? 0}/><DashboardKPICard label="Cash at hand" value={stats?.totalCashAtHand ?? 0}/></div><div className="cards">{items.map(a => <article className="card" key={a.id}><h3>{a.name}</h3><p>{a.network} - {a.mobileNumber}</p><p>Cash {a.cashAtHand} | E-money {a.emoneyAmount}</p><button onClick={() => setEdit(a)}>Edit</button><button className="danger" onClick={async()=>{await api.deleteAccount(a.id!); load();}}>Delete</button></article>)}</div>{edit && <Modal title="MNO Account" onClose={()=>setEdit(null)} onSubmit={e=>{e.preventDefault(); save();}}>{['name','country','mobileNumber','network','accountType'].map(k => <label key={k}>{k}<input value={(edit as any)[k]} onChange={e=>setEdit({...edit,[k]:e.target.value})}/></label>)}<label>E-money<input type="number" value={edit.emoneyAmount} onChange={e=>setEdit({...edit,emoneyAmount:+e.target.value})}/></label><label>Cash at hand<input type="number" value={edit.cashAtHand} onChange={e=>setEdit({...edit,cashAtHand:+e.target.value})}/></label></Modal>}</section>;
}
