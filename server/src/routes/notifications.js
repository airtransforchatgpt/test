import express from 'express';
import { getPool } from '../db.js';
import { store } from '../memoryStore.js';

const router = express.Router();

router.get('/delays', async (_req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT t.Id, c.FullName AS CustomerName, c.Email, t.FlightNo, t.Departure, t.Arrival, t.DepartureTime, t.Status
      FROM Tickets t
      INNER JOIN Customers c ON c.Id = t.CustomerId
      WHERE t.Status = 'DELAYED'
      ORDER BY t.DepartureTime ASC
    `);
    return res.json({ data: result.recordset, mode: 'mssql' });
  } catch {
    const data = store.tickets
      .filter((ticket) => ticket.status === 'DELAYED')
      .map((ticket) => {
        const customer = store.customers.find((c) => c.id === ticket.customerId);
        return {
          id: ticket.id,
          customerName: customer?.fullName,
          email: customer?.email,
          flightNo: ticket.flightNo,
          departure: ticket.departure,
          arrival: ticket.arrival,
          departureTime: ticket.departureTime,
          status: ticket.status,
        };
      });

    return res.json({ data, mode: 'memory' });
  }
});

export default router;
