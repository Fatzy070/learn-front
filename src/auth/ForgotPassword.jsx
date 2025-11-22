import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock } from "react-icons/fi";
import Loading from '../components/Loading';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoading(true); // start loading

    try {
      const res = await axios.post(
        `https://learn-backend-1g6i.onrender.com/api/forgot-password`,
        { email }
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate('/reset-password');
      }, 800);

    } catch (error) {
      console.log('Error while sending code:', error.response?.data || error.message);
      setMessage(error.response?.data.message || 'Something went wrong');
    } finally {
      setShowLoading(false); // stop loading
    }
  };

  return (
    <div className='flex justify-center h-screen items-center bg-gray-200'>
      <section className='py-5 md:py-7 bg-white w-[90%] md:w-[500px] flex px-10 rounded-[5px] justify-center items-center'>
        <form onSubmit={handleSubmit} className='space-y-5 w-full'>

          <h1 className='text-center text-lg font-semibold flex justify-center items-center gap-2'>
            <FiLock className='text-[#6c63ff]' size={22} />
            Forgot Password
          </h1>

          {message && (
            <p className='font-semibold text-center'>{message}</p>
          )}

          <div className='flex justify-center'>
            <input
              type="email"
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-gray-200 w-[80%] p-2 rounded outline-[#6c63ff]'
              placeholder='Enter your email'
              required
            />
          </div>

          <div className='w-full flex justify-center'>
            <button
              type='submit'
              disabled={showLoading}
              className={`bg-[#6c63ff] font-semibold text-white p-2 rounded-[5px] w-[80%] 
                ${showLoading ? "opacity-70 cursor-not-allowed" : ""}
              `}
            >
              {showLoading ? <Loading /> : 'Send Code'}
            </button>
          </div>

          <p className='text-center text-sm'>
            Remember your password?{" "}
            <a href="/login" className='text-[#6c63ff] font-semibold underline'>
              Login
            </a>
          </p>

        </form>
      </section>
    </div>
  );
};

export default ForgotPassword;
