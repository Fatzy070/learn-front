import React, { useEffect, useState } from 'react';
import { MdWbSunny } from "react-icons/md";
import { TbMoonFilled } from "react-icons/tb";

const Theme = () => {
    const [ theme , setTheme ] = useState('light')

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme')

        if (savedTheme) {
            setTheme(savedTheme)
            document.body.className = savedTheme
        }

    },[])

    const handleToggle = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        document.body.className = newTheme
        localStorage.setItem('theme' , newTheme)
    }

    return (
        <div className='container text-white'>
            <button onClick={handleToggle}> 
                { theme === 'light' ? <TbMoonFilled className='text-[18px] md:text-[20px]'/> : <MdWbSunny className='text-[18px] md:text-[20px]' /> }
            </button>
        </div>
    );
};

export default Theme;