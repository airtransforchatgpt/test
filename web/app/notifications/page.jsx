'use client';

import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import ProtectedPage from '../../components/ProtectedPage';
import { apiRequest } from '../../components/api';

export default function NotificationsPage() {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/api/notifications/delays')
      .then((result) => setAlerts(result.data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <ProtectedPage>
      <NavBar />
      <div className="card">
        <h2>Delayed Flight Notifications</h2>
        {error && <p style={{ color: '#dc2626' }}>{error}</p>}
        {!alerts.length && <p>No delayed flights 🎉</p>}
        {alerts.map((item) => (
          <div key={item.id || item.Id} className="card" style={{ marginBottom: 8 }}>
            <span className="badge badge-delay">DELAYED</span>
            <p><strong>{item.flightNo || item.FlightNo}</strong> for {item.customerName || item.CustomerName} ({item.email || item.Email})</p>
            <p>{item.departure || item.Departure} → {item.arrival || item.Arrival}</p>
            <p>Departure: {new Date(item.departureTime || item.DepartureTime).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </ProtectedPage>
  );
}
