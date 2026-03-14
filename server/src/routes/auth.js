import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPool } from '../db.js';
import { store } from '../memoryStore.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('email', email)
      .query('SELECT TOP 1 Id, Name, Email, PasswordHash FROM Users WHERE Email = @email');

    const user = result.recordset[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.PasswordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.Id, email: user.Email, name: user.Name }, process.env.JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, user: { id: user.Id, email: user.Email, name: user.Name }, mode: 'mssql' });
  } catch {
    const user = store.users.find((u) => u.email === email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, user: { id: user.id, email: user.email, name: user.name }, mode: 'memory' });
  }
});

export default router;
