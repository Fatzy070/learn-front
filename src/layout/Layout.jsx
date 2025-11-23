import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useState , useEffect } from 'react';
import Footer from './Footer';
const Layout = () => {
     const [scrolled , setScrolled ] = useState(false)

     useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); 
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
    return (
        <div>
            <div className={` md:m-0 sticky top-0 md:top-0 z-50 `}>
                <Header />
            </div>
            <div className=' '>
                <Outlet />
            </div>
            <div>
                <Footer/>
            </div>
        </div>
    );
};

export default Layout;