import './styles/global.scss';
import ThemeProvider from '@/lib/Context/ThemeContext';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Modal from '@/components/modals/Modal';
import { ToastProvider } from '@/lib/Context/ToastContext';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const isAuth = !!cookieStore.get('accessToken')?.value;

  return (
    <html lang="en">
      <body className="container">
        <ThemeProvider>
          <ToastProvider>
            <Header isAuth={isAuth}/>
            <main>{children}</main>
            <Footer />
            <Modal />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
