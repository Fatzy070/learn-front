import React, { useState, useEffect } from 'react';
import { IoMdMenu } from "react-icons/io";
import { Link } from 'react-router-dom';
import Info from '../data/Info';
import LogOut from '../auth/LogOut';
import axios from 'axios';
import { GoX } from "react-icons/go";

const NavBar = () => {
  const [user, setUser] = useState('');
   const [show, setShow] = useState(false);

  const { nav } = Info;

  const handleShow = () => setShow(!show);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://learn-backend-1g6i.onrender.com/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (error) {
        console.error('Error fetching user:', error.response?.data || error.message);
      }
    };
    fetchUser();
  }, []);

   const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return "";
  const initials = [
    firstName?.[0]?.toUpperCase() || "",
    lastName?.[0]?.toUpperCase() || "",
  ];
  return initials.join("");
};
const fullName = user ? `${user.firstName} ${user.lastName || ""}`.trim() : "";
  return (
    <div>
      {/* Menu Button */}
   <button onClick={() => setShow(true)} className="md:hidden text-gray-500">
        <IoMdMenu size={18} />
      </button>

      {/* BACKDROP (works now) */}
      {show && (
        <div
          onClick={() => handleShow()}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 transition-opacity duration-300"
        />
      )}

     
      <aside
        className={`
          absolute top-0 left-0 h-screen w-[75%] max-w-[420px] bg-white z-70
          transform transition-transform duration-500 ease-out shadow-xl
          ${show ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Close Button */}
        {show && (
            <button
          onClick={() => handleShow()}
          className="absolute top-3 right-[-40px] flex h-9 w-9 items-center justify-center
                     rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          <GoX size={18} />
        </button>
        )}

        {/* User Header */}
        <div className="flex gap-2 items-center border-b border-gray-200 pb-3 px-4 pt-5">
          <Link to="/edit-profile" onClick={() => setShow(false)}>
            {user ? (
              user.image ? (
                <img
                  src={user.image}
                  alt={user.firstName}
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                />
              ) : (
                <div className="w-10 h-10 text-[1rem] text-white font-semibold rounded-full bg-black flex items-center justify-center cursor-pointer">
                  {getInitials(user.firstName, user.lastName)}
                </div>
              )
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-100" />
            )}
          </Link>

          <div>
            {user && (
              <>
                <p className="capitalize font-semibold text-black text-[16px] leading-[20px]">Hi, {fullName}</p>
                <p className="text-gray-500 text-[12px] pt-1">Welcome back</p>
              </>
            )}
          </div>
        </div>

        {/* NAV LINKS */}
        <nav className="px-2 py-4 flex flex-col space-y-2">
          {nav.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setShow(false)}
              className="px-4 py-2 text-black rounded-md hover:bg-[rgba(108,99,255,0.08)] hover:text-[#6c63ff] transition"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="px-4 mt-auto pb-6">
          <div
            onClick={() => setShow(false)}
            className="px-2 py-2 rounded-md hover:bg-[rgba(108,99,255,0.08)] hover:text-[#6c63ff] transition cursor-pointer"
          >
            <LogOut />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default NavBar;
