import type { DashboardStats, ExchangeRate, MnoAccount, MnoTransaction, MnoWallet, Role, Session, User } from './types';

declare global {
  interface Window {
    __APP_CONFIG__?: { VITE_API_URL?: string };
  }
}

// Cloud Run writes /env.js at container startup so the same frontend image can point to any backend URL.
// Local development still falls back to Vite env vars or http://localhost:8080/api.
const runtimeApiUrl = window.__APP_CONFIG__?.VITE_API_URL;
const API_URL = runtimeApiUrl && runtimeApiUrl !== '${VITE_API_URL}' ? runtimeApiUrl : (import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api');
let token = localStorage.getItem('mobi_token') ?? '';
export function setToken(next: string) { token = next; next ? localStorage.setItem('mobi_token', next) : localStorage.removeItem('mobi_token'); }
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Every protected backend call uses the JWT saved after login/register.
  const res = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers ?? {}) } });
  if (!res.ok) throw new Error(await res.text() || res.statusText);
  if (res.status === 204) return undefined as T;
  return res.json();
}
const body = (value: unknown) => JSON.stringify(value);
export const api = {
  login: (email: string, password: string) => request<Session>('/auth/login', { method: 'POST', body: body({ email, password }) }),
  register: (name: string, email: string, password: string) => request<Session>('/auth/register', { method: 'POST', body: body({ name, email, password }) }),
  users: () => request<User[]>('/users'),
  setRole: (id: number, role: Role) => request<User>(`/users/${id}/role`, { method: 'PATCH', body: body({ role }) }),
  accounts: () => request<MnoAccount[]>('/mno-accounts'),
  saveAccount: (item: MnoAccount) => request<MnoAccount>(item.id ? `/mno-accounts/${item.id}` : '/mno-accounts', { method: item.id ? 'PUT' : 'POST', body: body(item) }),
  deleteAccount: (id: number) => request<void>(`/mno-accounts/${id}`, { method: 'DELETE' }),
  wallets: () => request<MnoWallet[]>('/mno-wallets'),
  saveWallet: (item: MnoWallet) => request<MnoWallet>(item.id ? `/mno-wallets/${item.id}` : '/mno-wallets', { method: item.id ? 'PUT' : 'POST', body: body(item) }),
  deleteWallet: (id: number) => request<void>(`/mno-wallets/${id}`, { method: 'DELETE' }),
  transactions: () => request<MnoTransaction[]>('/mno-transactions'),
  recordTransaction: (item: { walletId: number; transactionType: string; amount: number; agentNumber: string; clientPhone: string; clientName: string }) => request<MnoTransaction>('/mno-transactions', { method: 'POST', body: body(item) }),
  rates: () => request<ExchangeRate[]>('/exchange-rates'),
  saveRate: (item: ExchangeRate) => request<ExchangeRate>(item.id ? `/exchange-rates/${item.id}` : '/exchange-rates', { method: item.id ? 'PUT' : 'POST', body: body(item) }),
  deleteRate: (id: number) => request<void>(`/exchange-rates/${id}`, { method: 'DELETE' }),
  dashboard: () => request<DashboardStats>('/dashboard/mobi-agent'),
};