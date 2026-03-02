import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sacred Circle',
  description: "Virtual facilitated circles for women's circles, men's circles, support groups",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-stone-950 text-stone-100 antialiased overflow-hidden">{children}</body>
    </html>
  );
}
