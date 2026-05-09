import type { Metadata } from 'next';
import { Noto_Serif_KR, Noto_Sans_KR } from 'next/font/google';
import './globals.css';

const notoSerif = Noto_Serif_KR({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const notoSans = Noto_Sans_KR({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '나의 캐러나비는?',
  description: '생년월일로 알아보는 나의 캐러나비 동물 캐릭터',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSerif.variable} ${notoSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
