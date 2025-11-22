import React, { useState } from 'react';
import axios from 'axios';
import learn from '../assets/learn.svg'
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeClosed, EyeOff } from 'lucide-react';
import Loading from '../components/Loading';
const SignUp = () => {
    const [ name , setName ] = useState("")
    const [ email , setEmail ] = useState("")
    const [ password , setPassword ] = useState("")
    const [ message , setMessage  ] = useState("")
    const [ showPassword , setShowPassword ] = useState(false)
    const [ showLoading , setShowLoading ] = useState(false)

    const handleShow = () => {
      setShowPassword(!showPassword)
    }
    
    const navigate = useNavigate()

    const HandleSubmit = async(e) => {
        e.preventDefault()
        setShowLoading(true);
        try {

          if (!name.trim()) {
          return setMessage("Full name is required");
      }

            const res = await axios.post(`https://learn-backend-1g6i.onrender.com/api/signup` , {
                email , 
                name:name.trim() , 
                password , 
            })

              localStorage.setItem('token', res.data.token);
              localStorage.setItem('user' , JSON.stringify(res.data.user))
              // setMessage(res.data.message)
            setShowLoading(true)

            setTimeout(() => {
              setShowLoading(false)
                navigate('/')
            }, 2000)

        } catch (error) {
            console.log('Error :' , error.response?.data || error.message)
            setMessage(error.response?.data.message || "Something went wrong")
        }
    }

   const handleGoogleLogin = async (credentialResponse) => {
    setShowLoading(true);
    try {
      const res = await axios.post('https://learn-backend-1g6i.onrender.com/api/google-login', {
        token: credentialResponse.credential,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user' , JSON.stringify(res.data.user))

     
      
     setTimeout(() => {
      setShowLoading(false); // stop loading
      navigate('/');
    }, 2000);

    } catch (err) {
      console.error('Google login error:', err.response?.data || err.message);
    }
  
}

    return (
        <>
          <main className='flex  justify-center items-center min-h-screen py-10 md:py-0 md:h-screen md:bg-gray-200 bg-white'>
            
           <div className=' w-[50%] hidden md:block'>
             <img src={learn} alt="learn-img" className='object-cover w-full h-full rounded-[10px]' />
           </div>

             <section className='w-full md:w-[50%] bg-white h-full flex flex-col justify-center  px-5 md:px-10 lg:px-15'>
             <div className=' absolute  top-2 right-[10px]'>
    <Link to='/login' className='text-[13px] sm:text-[12px] font-semibold hover:underline text-[#6c63ff]'>
      Already have an account? <span className='underline'>Login</span>
    </Link>
  </div>
         
              <section className='text-center pb-5 md:mt-15'> 
                  <h1 className='font-semibold text-[1.7rem]'>Sign Up 📝</h1>
                <p className='lead'>Today you learn. Tomorrow you lead.</p>
              </section>
                     <form onSubmit={HandleSubmit} className='space-y-7'>
            {message && ( 
                <p className='text-center text-red-600'>{message}</p>
            )}
                <div className="relative w-full ">
  <input
    type="text"
    id="name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className={`peer w-full border border-[1.3px] h-[45px] rounded  lg:h-[55px] px-3  outline-none focus:border-[#6c63ff] transition-all`}
    placeholder=" "  
  />
             <label
               htmlFor="name"
                 className={`absolute font-semibold px-1 left-3 top-1/2 -translate-y-1/2 text-[13px] transition-all
                    peer-placeholder-shown:top-1/2 
                    peer-placeholder-shown:text-base
                    peer-focus:top-[-1px]
                    peer-focus:text-xs
                    peer-focus:bg-white
                    peer-focus:text-[#6c63ff]
                    px-1
                    ${name ? 'top-[-1px] text-xs text-[#6c63ff] bg-white' : ''}
                    `}
                >
                    Full name
                    </label>
                </div>
                <div className='relative'>
                    <input
                     type="email"
                     value={email}
                     className={`peer w-full border border-[1.3px]  rounded h-[45px] lg:h-[55px] px-3  outline-none focus:border-[#6c63ff] transition-all`}
                     placeholder=' '
                     onChange={(e) => setEmail(e.target.value)}
                     />
                     <label
                     className={`absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold transition-all 
                     peer-placeholder-shown
                     peer-placeholder-shown:text-base
                     peer-focus:top-[-1px]
                     peer-focus:text-xs
                     peer-focus:bg-white
                     peer-focus:text-[#6c63ff]
                      ${email ? 'top-[-1px] text-xs text-[#6c63ff] bg-white' : ''}
                     
                        `}
                        >Email</label>
                </div>
                <div className='relative'>
                    <input
                     type={showPassword ? 'text' : 'password'}
                     className={`peer border h-[45px] lg:h-[55px] w-full outline-none focus:border-[#6c63ff] rounded px-3`}
                     placeholder=' '
                     onChange={(e) => setPassword(e.target.value)}
                     required
                     />
                     <label className={`absolute bg-white left-3 top-1/2 -translate-y-1/2 text-[13px] font-semibold
                     peer:placeholder-shown
                     peer-placeholder-shown:text-base
                     peer-focus:top-[-1px]
                     peer-focus:text-xs
                     peer-focus:bg-white
                     peer-focus:text-[#6c63ff]
                      ${password ? 'top-[-1px] text-xs text-[#6c63ff] bg-white' : ''}
                     `}
                     >Password </label>
                     <div
                     onClick={() => handleShow()}
                     className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                     >
                      { showPassword ? <EyeOff />  : <EyeClosed />}
                     </div>
                </div>

                <button type='submit' className='border text-white font-semibold w-full py-2.5 rounded-[20px] bg-[#6c63ff] hover:bg-[rgba(108,99,255,0.8)] transition-colors'>{showLoading ? <Loading /> : 'Sign up'}</button>
                <div className='flex items-center justify-center gap-2  text-gray-600'>
                <p className='border w-[25%] md:w-[23%]  lg:w-[32%] h-0'></p>
                <p className='acct text-[12px] md:text-[15px]'>Other sign up options</p>
                <p className='border w-[25%] md:w-[23%] lg:w-[32%] h-0'></p>
              </div>
               <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => {
          console.log('Login Failed');
        }}
        
      />
            </form> 
              
             </section>
          </main>
        </>
    );
};

export default SignUp;