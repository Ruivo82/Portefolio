import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata = {
  title: 'Diogo Lopes',
  description: 'Programador & Fundador da RV Studios. Especialista no ecossistema FiveM, Web moderna e soluções digitais de alta performance.',
  keywords: ['Diogo Lopes', 'RV Studios', 'FiveM', 'React', 'Next.js', 'Lua', 'Developer', 'Portugal'],
  authors: [{ name: 'Diogo Lopes' }],
  icons: {
    icon: [
      { url: `${basePath}/favicon.png`, type: 'image/png' },
      { url: `${basePath}/icon.png`, type: 'image/png' },
      { url: `${basePath}/favicon.ico`, type: 'image/x-icon' },
    ],
    apple: `${basePath}/apple-touch-icon.png`,
    shortcut: `${basePath}/favicon.png`,
  },
};

export const viewport = {
  themeColor: '#0c0c0c',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt" className="scroll-smooth">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href={`${basePath}/favicon.png`} />
        <link rel="icon" type="image/png" sizes="192x192" href={`${basePath}/icon.png`} />
        <link rel="icon" type="image/x-icon" href={`${basePath}/favicon.ico`} />
        <link rel="shortcut icon" href={`${basePath}/favicon.png`} />
        <link rel="apple-touch-icon" href={`${basePath}/apple-touch-icon.png`} />
      </head>
      <body className="bg-[#0c0c0c] text-[#ededed] antialiased selection:bg-[#ff0000] selection:text-white min-h-screen">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
