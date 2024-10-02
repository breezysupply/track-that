import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SideMenu from '../components/SideMenu';
import ThemeWrapper from '../components/ThemeWrapper';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: 'Track That App',
    template: '%s | Track That App',
  },
  description: 'Your personal finance tracker',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeWrapper>
          <div className="flex flex-col md:flex-row min-h-screen">
            <SideMenu />
            <main className="flex-1 p-4 md:ml-64 overflow-auto">
              {children}
            </main>
          </div>
        </ThemeWrapper>
      </body>
    </html>
  );
}