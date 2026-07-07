// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'OSCAR - Oral Squamous Cell Carcinoma Detection',
  description: 'Sistem deteksi dini OSCC berbasis multi-omics biomarker dan AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Header - sementara placeholder, nanti diganti komponen */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary">OSCAR</span>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Monitoring
                </span>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Layout utama: Sidebar + Content */}
          <div className="flex min-h-[calc(100vh-4rem)]">
            {/* Sidebar - sementara placeholder */}
            <aside className="hidden w-64 border-r bg-background/50 lg:block">
              <div className="flex h-full flex-col gap-2 p-4">
                <nav className="grid gap-1">
                  <SidebarItem href="/dashboard" active>Dashboard</SidebarItem>
                  <SidebarItem href="/measurements">Pengukuran</SidebarItem>
                  <SidebarItem href="/verify">Verifikasi</SidebarItem>
                  <SidebarItem href="/admin">Admin</SidebarItem>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

// Komponen internal (sementara)
function ThemeToggle() {
  // Ini akan diganti dengan komponen toggle yang sebenarnya
  // Menggunakan next-themes useTheme
  // Untuk sementara, kita buat placeholder
  return (
    <button
      className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      aria-label="Toggle theme"
    >
      🌙
    </button>
  );
}

function SidebarItem({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      }`}
    >
      {children}
    </a>
  );
}