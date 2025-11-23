import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Slider from './Slider';
import JavaScriptCourse from '../courses/JavaScriptCourse';
import ReactCourse from '../courses/ReactCourse';
import LinuxCourse from '../courses/LinuxCourse';
const Home = () => {
    const [ user , setUser ] = useState("")
    const [ message , setMessage ] = useState("")

    useEffect(() => {
        const token = localStorage.getItem('token')
        const fetchUser = async () => {
            try {
                const res = await axios.get(`https://learn-backend-1g6i.onrender.com/api/me` , {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })

                setUser(res.data.user)
            } catch (error) {
                console.log('Error :' , error.response?.data || error.message)
                setMessage(error.response?.data.message || "Something went wrong")
            }
        }
        fetchUser()
    },[])
  const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return "";
  const initials = [
    firstName?.[0]?.toUpperCase() || "",
    lastName?.[0]?.toUpperCase() || "",
  ];
  return initials.join("");
};

const fullname = user ? `${user.firstName} ${user.lastName || ''}` : '' 

    return (
        <>
        {message && (
            <p className='text-center pt-10'>{message}</p>
        )}

          <section className='flex items-center m-5 gap-[15px]  md:m-8'>
                <div>
                    {user && (
                    <>
                   {user.image ? (
                <img
                src={user.image}
                alt={user.name}
                className="w-15 h-15 rounded-full object-cover cursor-pointer"
                />
                  ) : (
                <div className="w-15 h-15 text-[1.5rem]  text-white font-semibold rounded-full bg-black flex items-center justify-center cursor-pointer">
                {getInitials(user.firstName , user.lastName)}
                </div>
              )}
            </>
                 )}
        </div>
        <div>
            <h1 className='font-semibold name capitalize text-[1rem] md:text-[1.5rem]'>Welcome Back , {user.firstName}</h1>
        </div>
          </section>  

          <Slider />


          <div>
            <JavaScriptCourse />
            <ReactCourse />
            <LinuxCourse />
          </div>
        </>
    );
};

export default Home;