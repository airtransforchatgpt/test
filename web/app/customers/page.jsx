'use client';

import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import ProtectedPage from '../../components/ProtectedPage';
import { apiRequest } from '../../components/api';

const emptyForm = { fullName: '', email: '', phone: '' };

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');

  const loadCustomers = async () => {
    try {
      const result = await apiRequest(`/api/customers?page=${page}&pageSize=${pageSize}`);
      setCustomers(result.data);
      setTotal(result.total);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [page]);

  const submitForm = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await apiRequest(`/api/customers/${editingId}`, { method: 'PUT', body: JSON.stringify(form) });
      } else {
        await apiRequest('/api/customers', { method: 'POST', body: JSON.stringify(form) });
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadCustomers();
    } catch (err) {
      setError(err.message);
    }
  };

  const onEdit = (customer) => {
    setForm({ fullName: customer.fullName || customer.FullName, email: customer.email || customer.Email, phone: customer.phone || customer.Phone || '' });
    setEditingId(customer.id || customer.Id);
  };

  const onDelete = async (id) => {
    try {
      await apiRequest(`/api/customers/${id}`, { method: 'DELETE' });
      await loadCustomers();
    } catch (err) {
      setError(err.message);
    }
  };

  const maxPage = Math.max(1, Math.ceil(total / pageSize));

  return (
    <ProtectedPage>
      <NavBar />
      <div className="card">
        <h2>Customer CRUD</h2>
        <form onSubmit={submitForm} className="row">
          <input placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <button type="submit">{editingId ? 'Update' : 'Add'} Customer</button>
          {editingId && <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}
        </form>
        {error && <p style={{ color: '#dc2626' }}>{error}</p>}
      </div>

      <div className="card">
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {customers.map((customer) => {
              const id = customer.id || customer.Id;
              return (
                <tr key={id}>
                  <td>{customer.fullName || customer.FullName}</td>
                  <td>{customer.email || customer.Email}</td>
                  <td>{customer.phone || customer.Phone}</td>
                  <td className="row">
                    <button onClick={() => onEdit(customer)}>Edit</button>
                    <button className="danger" onClick={() => onDelete(id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="row" style={{ marginTop: 12 }}>
          <button className="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
          <span>Page {page} / {maxPage}</span>
          <button className="secondary" disabled={page >= maxPage} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      </div>
    </ProtectedPage>
  );
}
