import './globals.css';
import AppProviders from '@/context/AppProviders';
import ToastContainer from '@/components/common/Toast';

export const metadata = {
  title: 'Jodhpur Voyage | Royal Heritage & Desert Experiences Admin',
  description: 'Next.js travel management platform with Context API state management and centralized API architecture.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        <AppProviders>
          {children}
          <ToastContainer />
        </AppProviders>
      </body>
    </html>
  );
}
