import './globals.css';

export const metadata = {
  title: 'Air Ticket Agent CRM',
  description: 'CRM for flight ticket agents',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
