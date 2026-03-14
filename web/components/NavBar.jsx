'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NavBar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="nav">
      <Link href="/customers">Customers</Link>
      <Link href="/tickets">Tickets</Link>
      <Link href="/notifications">Delay Notifications</Link>
      <button className="secondary" onClick={logout}>Logout</button>
    </div>
  );
}
