import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { ExchangeRate } from '../api/types';
import { Modal } from '../components/Modal';
const blank: ExchangeRate = { fromCurrency: '', toCurrency: '', rate: 0 };
export function ExchangeRatePage() {
  const [items, setItems] = useState<ExchangeRate[]>([]); const [edit, setEdit] = useState<ExchangeRate | null>(null); const load = () => api.rates().then(setItems); useEffect(() => { load(); }, []);
  async function save() { if (!edit) return; await api.saveRate(edit); setEdit(null); load(); }
  return <section><div className="sectionHead"><h1>Exchange Rates</h1><button onClick={()=>setEdit(blank)}>New Rate</button></div><div className="table">{items.map(r => <div className="row" key={r.id}><span>{r.fromCurrency} to {r.toCurrency}</span><span>{r.rate}</span><span>{r.updatedAt ? new Date(r.updatedAt).toLocaleString() : ''}</span><button onClick={()=>setEdit(r)}>Edit</button><button className="danger" onClick={async()=>{await api.deleteRate(r.id!); load();}}>Delete</button></div>)}</div>{edit && <Modal title="Exchange Rate" onClose={()=>setEdit(null)} onSubmit={e=>{e.preventDefault(); save();}}><label>From<input value={edit.fromCurrency} onChange={e=>setEdit({...edit,fromCurrency:e.target.value.toUpperCase()})}/></label><label>To<input value={edit.toCurrency} onChange={e=>setEdit({...edit,toCurrency:e.target.value.toUpperCase()})}/></label><label>Rate<input type="number" value={edit.rate} onChange={e=>setEdit({...edit,rate:+e.target.value})}/></label></Modal>}</section>;
}
