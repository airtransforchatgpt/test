'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '../../components/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@aircrm.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      router.push('/customers');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: '60px auto' }}>
      <h2>Air Agent CRM Login</h2>
      <p>Use default: admin@aircrm.com / admin123</p>
      <form onSubmit={onSubmit}>
        <div className="row" style={{ flexDirection: 'column' }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button type="submit">Login</button>
          {error && <p style={{ color: '#dc2626' }}>{error}</p>}
        </div>
      </form>
    </div>
  );
}
