import './globals.css';
import type { Metadata } from 'next';

const FONT_SANS = {
  variable: '--font-sans',
  className: '',
};

const FONT_DISPLAY = {
  variable: '--font-display',
  className: '',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://aicreatoros.com'),
  title: {
    default: 'AI Creator OS — AI Content Automation & Social Media OS',
    template: '%s · AI Creator OS',
  },
  description:
    'AI Creator OS is the all-in-one AI Content Automation platform and Social Media OS. Generate bulk content from CSV, preview on Instagram & TikTok, schedule, and auto-post across platforms.',
  keywords: [
    'AI Content Automation',
    'Social Media OS',
    'AI Creator OS',
    'bulk content generation',
    'social media scheduling',
    'auto-post AI',
    'CSV content generation',
    'Gemini',
    'GPT-4',
    'Claude',
    'Instagram content automation',
    'TikTok content automation',
  ],
  authors: [{ name: 'AI Creator OS' }],
  creator: 'AI Creator OS',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aicreatoros.com',
    siteName: 'AI Creator OS',
    title: 'AI Creator OS — AI Content Automation & Social Media OS',
    description:
      'The all-in-one AI Content Automation platform. Generate bulk content from CSV, preview on Instagram & TikTok, schedule, and auto-post across every platform.',
    images: [
      {
        url: 'https://images.pexels.com/photos/8438922/pexels-photo-8438922.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'AI Creator OS — AI Content Automation & Social Media OS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Creator OS — AI Content Automation & Social Media OS',
    description:
      'The all-in-one AI Content Automation platform. Generate bulk content from CSV, preview on Instagram & TikTok, schedule, and auto-post across every platform.',
    images: [
      'https://images.pexels.com/photos/8438922/pexels-photo-8438922.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
    ],
    creator: '@aicreatoros',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://aicreatoros.com',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0a0a0c" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${FONT_SANS.variable} ${FONT_DISPLAY.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
