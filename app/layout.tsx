import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgentVault AI | PayPal + AI Autonomous Commerce & Financial OS',
  description: 'Autonomous Agentic Commerce, Escrow Verification, Subscription Arbitrage, and Financial Governance powered by PayPal and Google Gemini.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-[#f8fafc] text-slate-800 min-h-screen antialiased selection:bg-brand-100 selection:text-brand-700">
        {children}
      </body>
    </html>
  );
}
