import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AiChatWidget from '@/components/ai-chat-widget';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="en">
      <body className={inter.className}>
        {children}
        <AiChatWidget />
      </body>
    </html>
  );
}