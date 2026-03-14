# Air Ticket Agent CRM (Next.js + Express + MS SQL)

This project provides a full-stack CRM for an air ticket agency with:
- User authentication (JWT login)
- Customer CRUD with pagination
- Ticket listing
- Flight delay notifications
- Express API backed by MS SQL (with in-memory fallback for quick local run)

## Structure

- `server/` - Node.js + Express API
- `web/` - Next.js frontend

## Backend setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Run SQL schema in `server/schema.sql` on your MS SQL database.

### Default login
- Email: `admin@aircrm.com`
- Password: `admin123`

## Frontend setup

```bash
cd web
npm install
NEXT_PUBLIC_API_URL=http://localhost:4000 npm run dev
```

Then open `http://localhost:3000`.

## API endpoints

- `POST /api/auth/login`
- `GET/POST /api/customers`
- `PUT/DELETE /api/customers/:id`
- `GET /api/tickets`
- `GET /api/notifications/delays`
