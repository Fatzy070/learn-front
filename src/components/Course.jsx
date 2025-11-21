import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Course = ({ limit, title, playlistId}) => {
  const [videos, setVideos] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingVideos, setLoadingVideos] = useState(true); // loading state
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // setLoading(true);
        setLoadingVideos(true);

        const res = await axios.get(
          `http://localhost:3000/api/courses/playlist/${playlistId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        let fetchedVideos = res.data.videos;
        if (limit) fetchedVideos = fetchedVideos.slice(0, limit);

        setVideos(fetchedVideos);
      } catch (error) {
        console.log('Error', error.response?.data || error.message);
        setMessage(error.response?.data?.message || 'Something went wrong');
      } finally {
        // setLoading(false);
        setLoadingVideos(false);
      }
    };

    fetchData();
  }, [limit, token, playlistId]);

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

      const updatedUser = {
        ...user,
        enrolledVideos: [...(user.enrolledVideos || []), { videoId: video.videoId, title: video.title }]
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const unenroll = async (videoId) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/courses/unenroll/${videoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message);

      const updatedUser = {
        ...user,
        enrolledVideos: user.enrolledVideos.filter(v => v.videoId !== videoId)
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <main className='p-4 md:p-0 md:mx-10 md:mt-10'>
      {videos.length !== 0 && (
        <div className='flex justify-between'>
          <h1 className="pl-5 pb-5 font-semibold capitalize md:text-[2rem]">{title}</h1>
          <Link className='text-blue-700' to={`/course/${playlistId}`}>
            view all
          </Link>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {message && <p className="text-red-500 text-center">{message}</p>}

        {loadingVideos
          ? Array.from({ length: limit || 6 }).map((_, i) => (
            <div key={i} className="shadow-md rounded-lg overflow-hidden bg-white">
              <Skeleton height={200} /> {/* Video placeholder */}
              <div className="p-3 space-y-2">
                <Skeleton height={20} width={`80%`} />
                <Skeleton height={15} width={`100%`} />
                <Skeleton height={15} width={`90%`} />
                <Skeleton height={35} width={`50%`} />
              </div>
            </div>
          ))
          : videos.map((video, i) => (
            <div key={i} className="shadow-md rounded-lg overflow-hidden bg-white">
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${video.videoId}`}
                allowFullScreen
                className="rounded-t-lg"
              ></iframe>
              <div className="p-3">
                <h2 className="text-sm font-semibold">
                  <span className='hidden md:block'>{video.title.slice(0, 50) + "...."}</span>
                  <span className='md:hidden block'>{video.title.slice(0, 30) + "...."}</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {video.description.length > 100
                    ? video.description.substring(0, 80) + "..."
                    : video.description}
                </p>
                <div>
                  {user?.enrolledVideos?.some(v => v.videoId === video.videoId) ? (
                    <button
                      onClick={() => unenroll(video.videoId)}
                      className="mt-2 bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Unenroll
                    </button>
                  ) : (
                    <button
                      onClick={() => enroll(video)}
                      className="mt-2 bg-purple-600 text-white px-3 py-1 rounded"
                    >
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </main>
  );
};

export default Course;
