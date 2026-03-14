'use client';

import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import ProtectedPage from '../../components/ProtectedPage';
import { apiRequest } from '../../components/api';

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/api/tickets')
      .then((result) => setTickets(result.data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <ProtectedPage>
      <NavBar />
      <div className="card">
        <h2>Tickets</h2>
        {error && <p style={{ color: '#dc2626' }}>{error}</p>}
        <table>
          <thead>
            <tr><th>Flight</th><th>Customer</th><th>Route</th><th>Departure</th><th>Status</th></tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id || ticket.Id}>
                <td>{ticket.flightNo || ticket.FlightNo}</td>
                <td>{ticket.customerName || ticket.CustomerName}</td>
                <td>{ticket.departure || ticket.Departure} → {ticket.arrival || ticket.Arrival}</td>
                <td>{new Date(ticket.departureTime || ticket.DepartureTime).toLocaleString()}</td>
                <td>{ticket.status || ticket.Status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProtectedPage>
  );
}
