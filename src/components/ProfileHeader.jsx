import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Info from '../data/Info';
import LogOut from '../auth/LogOut';

const ProfileHeader = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  const { nav } = Info;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (error) {
        console.error('Error fetching user:', error.response?.data || error.message);
        setMessage(error.response?.data?.message || 'Something went wrong');
      }
    };

    fetchUser();
  }, []);

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return '';
    const initials = [
      firstName?.[0]?.toUpperCase() || '',
      lastName?.[0]?.toUpperCase() || '',
    ];
    return initials.join('');
  };

  const fullName = user ? `${user.firstName} ${user.lastName || ''}`.trim() : '';

  return (
    <section className="group relative">
      {/* Main Profile Icon */}
      <Link to="/edit-profile">
        {user && (
          <div className="relative">
            {user.image ? (
              <img
                src={user.image}
                alt={fullName}
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
              />
            ) : (
              <div className="w-10 h-10 text-[1.2rem] text-white font-semibold rounded-full bg-black flex items-center justify-center cursor-pointer">
                {getInitials(user.firstName, user.lastName)}
              </div>
            )}
          </div>
        )}
      </Link>

      {/* Dropdown Menu */}
      <div className="absolute right-0 text-black top-12 bg-white shadow-lg rounded py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[250px]">
        {/* User Info */}
        <div className="flex gap-2 items-center border-b border-gray-300 pb-3 px-3">
          <Link to="/edit-profile">
            {user && (
              <div className="relative">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={fullName}
                    className="w-[60px] h-[60px] rounded-full object-cover cursor-pointer"
                  />
                ) : (
                  <div className="w-[60px] h-[60px] text-[1.2rem] text-white font-semibold rounded-full bg-black flex items-center justify-center cursor-pointer">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                )}
              </div>
            )}
          </Link>
          <div>
            {user && (
              <>
                <p className="capitalize font-semibold text-[1rem]">{fullName}</p>
                <span className="text-gray-700 text-[13px]">{user.email}</span>
              </>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="px-1 flex flex-col space-y-2 py-2">
          {nav.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="px-3 py-1 hover:bg-[rgba(108,99,255,0.3)] hover:text-[#6c63ff] rounded"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Logout */}
        <div className="px-4 py-1 hover:bg-[rgba(108,99,255,0.3)] hover:text-[#6c63ff] rounded">
          <LogOut />
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;
