import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import "swiper/css";
import "swiper/css/navigation";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

const CourseSlider = ({ playlistId, limit = 10, title }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const swiperRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);
  const [user, setUser] = useState(null); // ✅ Add user to state
  const [ message , setMessage ] = useState("")


  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/courses/playlist/${playlistId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const sliced = res.data.videos.slice(0, limit);
        setVideos(sliced);
      } catch (error) {
        console.log("Error fetching slider videos:", error);
        setMessage(error.response?.data.message || 'Something went wrong')
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [playlistId, limit, token]);

  const enroll = async (video) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/courses/enroll`,
        { 
          videoId: video.videoId, 
          title: video.title, 
          thumbnail: video.thumbnail, 
          playlistId 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);

      // ✅ Update both localStorage AND state
      const updatedUser = { 
        ...user, 
        enrolledVideos: [...(user?.enrolledVideos || []), { 
          videoId: video.videoId, 
          title: video.title 
        }] 
      };
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser); // ✅ This triggers re-render
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const unenroll = async (videoId) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/courses/unenroll/${videoId}`,
        { headers: { Authorization: `Bearer ${token}` } } 
      );
      toast.success(res.data.message);

      // ✅ Update both localStorage AND state
      const updatedUser = { 
        ...user, 
        enrolledVideos: user?.enrolledVideos?.filter(v => v.videoId !== videoId) || [] 
      };
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser); // ✅ This triggers re-render
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      
    }
  };

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const SkeletonCard = () => (
    <div className="shadow-md rounded-lg overflow-hidden bg-white p-3">
      <Skeleton height={180} className="mb-3" />
      <Skeleton height={15} width="90%" className="mb-2" />
      <Skeleton height={12} width="60%" />
      <Skeleton height={30} width="50%" className="mt-2" />
    </div>
  );

  return (
    <div className="my-10 px-4 md:px-10 relative">
      {message && (
        <p>{message}</p>
      )}
      {videos.length !== 0 && (
                  <div className='flex justify-between'> 
                      <h1 className="pl-5 pb-5 font-semibold capitalize md:text-[2rem]">{title}</h1>
                      <Link 
                      className='text-blue-700'
                      to={`/course/${playlistId}`}
                      >view all </Link>
                  </div>
              )}
      
      <div className="relative">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setSwiperReady(true);
          }}
          onInit={(swiper) => {
            swiperRef.current = swiper;
            setSwiperReady(true);
          }}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          className="swiper"
        >
          {loading
            ? [...Array(4)].map((_, i) => (
                <SwiperSlide key={i}>
                  <SkeletonCard />
                </SwiperSlide>
              ))
            : videos.map((video, i) => (
                <SwiperSlide key={i}>
                  <div className="shadow-md rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="180"
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      allowFullScreen
                      className="rounded-t-lg"
                    ></iframe>
                    <div className="p-3">
                      <h2 className="text-sm font-semibold">
                        <span className="hidden md:block">
                          {video.title.slice(0, 50) + "...."}
                        </span>
                        <span className="md:hidden block">
                          {video.title.slice(0, 30) + "...."}
                        </span>
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">
                        {video.description.length > 100
                          ? video.description.substring(0, 80) + "..."
                          : video.description}
                      </p>
                      <div>
                        {/* ✅ This will now re-render when user state changes */}
                        {user?.enrolledVideos?.some(v => v.videoId === video.videoId) ? (
                          <button
                            onClick={() => unenroll(video.videoId)}
                            className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                          >
                            Unenroll
                          </button>
                        ) : (
                          <button
                            onClick={() => enroll(video)}
                            className="mt-2 bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition"
                          >
                            Enroll
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>

        {/* <button
          onClick={handlePrev}
          className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-10 bg-white 
                     text-purple-600 p-3 rounded-full shadow-lg hover:bg-purple-50 
                     transition-all -ml-5 text-xl font-bold border border-gray-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!swiperReady}
        >
          <FaArrowLeft className="text-[14px] md:text-[20px]"/>
        </button>
        
        <button
          onClick={handleNext}
          className="absolute md:right-0 right-2 top-1/2 -translate-y-1/2 z-10 bg-white 
                     text-purple-600 p-3 rounded-full shadow-lg hover:bg-purple-50 
                     transition-all -mr-5 text-xl font-bold border border-gray-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!swiperReady}
        >
          <FaArrowRight className="text-[14px] md:text-[20px]"/>
        </button> */}
      </div>
    </div>
  );
};

export default CourseSlider;