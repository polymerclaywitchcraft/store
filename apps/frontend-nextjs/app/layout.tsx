import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Polymerclay Witchcraft',
  description:
    'I create gothic jewellery inspired by dark fairy tales. Crafted with magic in every detail and atmosphere.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
