"use client";  // Make sure this is a Client Component
import "./globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
      <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
      </body>
    </html>
    
      );
}
