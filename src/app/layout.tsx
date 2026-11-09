import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../components/ToastContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Huellitas & Rescate | Amor en cada huella",
  description: "Red social comunitaria con Inteligencia Artificial para la búsqueda colaborativa de mascotas perdidas, reporte de resguardos y adopción responsable.",
  icons: {
    icon: "/favicon.ico",
    apple: "/brand-symbol.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#233242] selection:bg-[#C6634A] selection:text-white">
        <ErrorBoundary>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
