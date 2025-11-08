import React from 'react';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <small>© {new Date().getFullYear()} SELP — Equipment Lending Portal</small>
      </div>
    </footer>
  );
};

export default Footer;
