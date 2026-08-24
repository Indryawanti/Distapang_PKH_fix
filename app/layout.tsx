import './globals.css';
import type { Metadata } from 'next';
import { Fraunces, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import AiChatWidget from '@/components/ai-chat-widget';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-editorial',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SiMantap — Sistem Informasi Manajemen Peternakan Terpadu',
  description:
    'Portal resmi Bidang Peternakan dan Kesehatan Hewan, Dinas Pertanian dan Pangan Kabupaten Kebumen. Merangkum data Perbibitan & Produksi, Kesehatan Hewan, dan Kesehatan Masyarakat Veteriner.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${fraunces.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased text-slate-900 bg-slate-50 selection:bg-azure selection:text-white">
        {children}
        <AiChatWidget />
      </body>
    </html>
  );
}