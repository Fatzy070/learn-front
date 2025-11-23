import React, { useEffect, useState } from 'react';
import Info from '../data/Info';
import { Link } from 'react-router-dom';
import Search from '../components/Search';
import ProfileHeader from '../components/ProfileHeader';
import { FaGraduationCap } from "react-icons/fa";
import Theme from '../components/Theme';
import NavBar from '../components/NavBar';
import { IoMdMenu } from "react-icons/io";

const Header = () => {
    const { nav } = Info;

    return (
        <>
            {/* Mobile Header - Enhanced Layout */}
            <section className='flex items-center py-4 px-4 justify-between md:hidden bg-white dark:bg-gray-900 shadow-lg '>
                <div>
                    <NavBar />
                </div>
                <div className='flex gap-2 items-center flex-shrink-0'>
                    <div className="relative">
                    <FaGraduationCap size={32} className="text-purple-400" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <h1 className='learn text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'>LearnHub</h1>
                </div>
                <div className='flex items-center gap-3'>
                    <Search />
                    <Theme />
                </div>
            </section>

            
            <header className='hidden md:flex bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-800 justify-between items-center px-6 lg:px-12 py-4'>
                {/* Logo Section */}
                <div className='flex gap-2 items-center flex-shrink-0'>
                    <div className="relative">
                    <FaGraduationCap size={32} className="text-purple-400" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <h1 className='learn text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'>LearnHub</h1>
                </div>

            
                <section className='lg:flex gap-6 hidden justify-center flex-1 max-w-2xl mx-8'>
                    {nav.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            className='text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors duration-200'
                        >
                            <p>{item.name}</p>
                        </Link>
                    ))}
                </section>

             
                <div className='flex gap-4 items-center '>
                    <div className='flex-1 min-w-[250px]'>
                        <Search />
                    </div>
                    <div className='pt-1'>
                        <Theme />
                    </div>
                    <ProfileHeader />
                </div>
            </header>
        </>
    );
};

export default Header;