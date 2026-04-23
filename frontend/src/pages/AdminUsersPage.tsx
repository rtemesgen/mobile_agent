import { api } from '../api/client';
import type { User, Role } from '../api/types';
import { useEffect, useState } from 'react';
export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]); const load = () => api.users().then(setUsers); useEffect(() => { load(); }, []);
  async function role(id: number, next: Role) { await api.setRole(id, next); load(); }
  return <section><h1>Users</h1><div className="table">{users.map(u => <div className="row" key={u.id}><span>{u.name}</span><span>{u.email}</span><select value={u.role} onChange={e => role(u.id, e.target.value as Role)}><option>ADMIN</option><option>MOBI_AGENT</option></select></div>)}</div></section>;
}
