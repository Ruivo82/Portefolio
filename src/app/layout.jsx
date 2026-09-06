import './globals.css';

export const metadata = {
  title: 'Diogo Lopes',
  description: 'Programador & Fundador da RV Studios. Especialista no ecossistema FiveM, Web moderna e soluções digitais de alta performance.',
  keywords: ['Diogo Lopes', 'RV Studios', 'FiveM', 'React', 'Next.js', 'Lua', 'Developer', 'Portugal'],
  authors: [{ name: 'Diogo Lopes' }],
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  themeColor: '#0d0d0d',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt" className="scroll-smooth">
      <body className="bg-[#0d0d0d] text-[#ededed] antialiased selection:bg-[#ff0000] selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
