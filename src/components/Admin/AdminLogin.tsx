import React, { useState } from 'react';
import { getApiBase } from '../../lib/apiBase';

const API_BASE = getApiBase();

interface AdminLoginProps {
  onAuthenticated: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Login gagal');
      onAuthenticated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-app-root" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <form className="admin-card" onSubmit={submit} style={{ width: 'min(100%, 430px)' }}>
        <h1 className="admin-card-title">Admin Login</h1>
        <p className="admin-card-desc">Masuk untuk mengelola portfolio dan upload gambar.</p>
        <div className="admin-field">
          <label>Email</label>
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="admin-field">
          <label>Password</label>
          <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        {error && <p style={{ color: 'var(--danger, #b42318)' }}>{error}</p>}
        <button className="btn btn--primary" type="submit" disabled={loading}>
          {loading ? 'Memeriksa...' : 'Masuk'}
        </button>
      </form>
    </main>
  );
};
