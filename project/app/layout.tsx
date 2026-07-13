import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Creator OS - AI Bulk Content Automation',
  description: 'AI Bulk Content Automation operating system. Generate, visualize, and distribute 100+ social media posts across Instagram, TikTok, LinkedIn, and Twitter with Google Gemini and Pollinations.ai.',
  keywords: ['AI content automation', 'bulk content generation', 'social media automation', 'Gemini API', 'content factory', 'AI creator tools'],
  openGraph: {
    title: 'AI Creator OS - AI Bulk Content Automation',
    description: 'Generate, visualize, and distribute 100+ social media posts with AI. Powered by Gemini and Pollinations.ai.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Creator OS',
    description: 'AI Bulk Content Automation - Generate 100+ posts with Gemini AI',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
