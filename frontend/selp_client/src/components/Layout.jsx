import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideHeader = location.pathname === '/' || location.pathname === '/login';

  return (
    <div className="app-shell">
      {!hideHeader && <Header />}
      <main className="app-main">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
