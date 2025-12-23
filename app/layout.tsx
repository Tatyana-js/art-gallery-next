import './styles/global.scss';
import { inter, cormorant } from './fonts';
import ThemeProvider from '@/lib/Context/ThemeContext';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Modal from '@/components/modals/Modal';
import { ToastProvider } from '@/lib/Context/ToastContext';
import clsx from 'clsx';

export default async function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const isAuth = !!cookieStore.get('accessToken')?.value;

  return (
    <html lang="en">
      <body className={clsx(`${inter.className}, ${cormorant.className}, container`)}>
        <ThemeProvider>
          <ToastProvider>
            <Header isAuth={isAuth} />
            <main>
              {children}
              {modal}
            </main>
            <Footer />
            <Modal />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
