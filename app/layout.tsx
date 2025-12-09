import './styles/global.scss';
import ThemeProvider from '@/lib/Context/ThemeContext';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import Modal from '@/components/modals/Modal';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="container">
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <Modal />
        </ThemeProvider>
      </body>
    </html>
  );
}
