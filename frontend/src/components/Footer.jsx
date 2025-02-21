import React from 'react';
import { IoLogoTiktok } from 'react-icons/io5';
import { FaFacebookSquare } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer
      className='py-8'
      style={{ backgroundColor: 'var(--secondary-color)' }}
    >
      <div className='container p-4 d-flex  justify-content-between align-items-center flex-column flex-md-row'>
        <div className='d-flex align-items-center flex-column flex-md-row'>
          <h1>
            <img
              src='/Logos/png/ColorLogoNoBackground.png'
              alt='logo'
              style={{ width: '250px' }}
            />
            <a href='#'></a>
          </h1>
          <div className='d-flex flex-column ms-3'>
            <p className='m-0 fs-4 fw-bold'>
              Discover Africa. Book Smart. Travel Better.
            </p>
            <span className='fs-6 pb-2'>
              Try KultureXplora - The easiest way to find Africa's best safari
              operators.
            </span>
          </div>
        </div>

        <ul className='socialMedia d-flex justify-content-center'>
          <li>
            <a href='https://www.linkedin.com/company/kulturexplora/posts/?feedView=all'>
              {' '}
              <FaLinkedin size={48} style={{ color: 'var(--primary-color)' }} />
            </a>
          </li>

          <li>
            <a href='https://www.facebook.com/profile.php?id=61573159404713'>
              <FaFacebookSquare
                size={48}
                style={{ color: 'var(--primary-color)' }}
              />{' '}
            </a>
          </li>
          <li>
            <a href='https://www.instagram.com/kulturexplora?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='>
              {' '}
              <FaInstagram
                size={48}
                style={{ color: 'var(--primary-color)' }}
              />
            </a>
          </li>
          <li>
            {' '}
            <a href='https://www.tiktok.com/@kulturexplora?_t=ZN-8tvtJxYrf0Q&_r=1'>
              <IoLogoTiktok
                size={48}
                style={{ color: 'var(--primary-color)' }}
              />
            </a>
          </li>
        </ul>
      </div>
      <div className=' p-2 text-center'>
        <p className='m-0'>&copy; 2025 KultureXplora. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
