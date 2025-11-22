import axios from 'axios';
import React, { useState } from 'react';
import { FiRefreshCcw } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Loading from '../components/Loading'
const ResetPassword = () => {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [ showPassword , setShowPassword ] = useState(false)
  const [ showLoading , setShowLoading ] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`https://learn-backend-1g6i.onrender.com/api/reset-password`, {
        code,
        newPassword
      });
      
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      setMessage(res.data.message);
      setShowLoading(true);
      
     setTimeout(() => {
      setShowLoading(false); // stop loading
      navigate('/');
    }, 7000);
    } catch (error) {
      console.log("Error resetting password:", error.response?.data || error.message);
      setMessage(error.response?.data.message || "Something went wrong");
    }
  };

  const handleShow = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className='flex justify-center h-screen items-center bg-gray-200'>
      <section className='py-5 md:py-7 bg-white w-[90%] md:w-[500px] flex px-10 rounded-[5px] justify-center items-center'>
        <form onSubmit={handleSubmit} className='space-y-5 w-full'>

          <h1 className='text-center font-semibold text-lg flex justify-center items-center gap-2'>
            <FiRefreshCcw className='text-[#6c63ff]' size={22} />
            Reset Password
          </h1>

          {message && (
            <p className='text-center font-medium'>{message}</p>
          )}

          <div className='flex justify-center'>
            <input
              type="number"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className='bg-gray-200 w-[80%] p-2 rounded outline-[#6c63ff]'
              placeholder='Enter reset code'
            />
          </div>

          <section className='flex justify-center'>
            <div className='  w-[80%] relative '>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className='bg-gray-200 w-full p-2 rounded outline-[#6c63ff]'
              placeholder='Enter new password'
            />
            <div
            onClick={() => handleShow()}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
                {showPassword ?  <EyeOff size={20} /> : <Eye size={20} /> }
            </div>
          </div>

          </section>
          <div className='w-full flex justify-center'>
            <button type='submit' className='bg-[#6c63ff] font-semibold text-white p-2 rounded-[5px] w-[80%]' 
            disabled={showLoading}>
             { showLoading ? <Loading />  : 'Reset'}
            </button>
          </div>

          <p className='text-center text-sm'>
            Remember your password?{" "}
            <a href="/login" className='text-[#6c63ff] underline font-semibold'>
              Login
            </a>
          </p>

        </form>
      </section>
    </div>
  );
};

export default ResetPassword;
