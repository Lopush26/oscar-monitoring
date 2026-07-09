import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import HeaderNav from '@/components/ui/HeaderNav';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'OSCAR – OSCC Detection System',
  description: 'Sistem deteksi dini Oral Squamous Cell Carcinoma berbasis multi-omics biomarker dan AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-[#0a0f1d] text-slate-100 antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <HeaderNav />
          <main className="min-h-[calc(100vh-4rem)] bg-[#0a0f1d]">
            <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}