import React, { useEffect, useState } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      // 如果滾動距離超過 50px，設置為 scrolled 狀態
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 當選單打開時防止背景滾動
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'; // 禁止背景滾動
    } else {
      document.body.style.overflow = 'unset'; // 恢復背景滾動
    }
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav
        className={`navbar ${isScrolled ? 'scrolled' : ''} ${
          isMobileMenuOpen ? 'menu-open' : ''
        }`}
      >
        <div className='container'>
          <h1>
            <a
              href='https://www.linkedin.com/company/kulturexplora/'
              target='_blank'
              rel='noopener noreferrer'
            >
              {/* 大Logo */}
              <img
                src='/Logos/png/ColorLogoNoBackground.png'
                className='logo desktop-logo'
                alt='KulturExplora Logo'
              />
              {/* 手機版 Logo */}
              <img
                src='/Logos/png/ColorLogo.png'
                className='logo mobile-logo'
                alt='KulturExplora Small Logo'
              />
            </a>
          </h1>
          {/* 漢堡選單按鈕 */}
          <button
            className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label='Toggle menu'
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* 導航連結 */}
          <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            <li className='nav-item'>
              <a href='#about' onClick={() => setIsMobileMenuOpen(false)}>
                About
              </a>
            </li>
            <li className='nav-item'>
              <a href='#features' onClick={() => setIsMobileMenuOpen(false)}>
                Features
              </a>
            </li>
            <li className='nav-item'>
              <a href='#blog' onClick={() => setIsMobileMenuOpen(false)}>
                Blog
              </a>
            </li>
            <li className='nav-item'>
              <a href='#faqs' onClick={() => setIsMobileMenuOpen(false)}>
                FAQ's
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
