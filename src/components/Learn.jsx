import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiBookOpen } from 'react-icons/fi';
const Learn = () => {
  const [videos, setVideos] = useState([]);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://learn-backend-1g6i.onrender.com/api/courses/userenroll`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setVideos(res.data.enrolledVideos || []);
      } catch (error) {
        console.log('Error', error.response?.data || error.message);
        setMessage(error.response?.data?.message || 'Something went wrong');
      }
    };

    fetchData();
  }, [token]);

  const unenroll = async (videoId) => {
    try {
      const res = await axios.delete(
        `https://learn-backend-1g6i.onrender.com/api/courses/unenroll/${videoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message);

      // Remove unenrolled video from state and localStorage
      const updatedVideos = videos.filter((v) => v.videoId !== videoId);
      setVideos(updatedVideos);

      const updatedUser = {
        ...user,
        enrolledVideos: updatedVideos,
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-2">
            <FiBookOpen className="w-8 h-8" />
            <h1 className="text-3xl font-bold">My Learning</h1>
          </div>
          <p className="text-purple-100 text-lg">
            Your enrolled courses and learning progress
          </p>
        </div>
      </div>
      <main className="p-4 md:p-10">
      {videos.length !== 0 && (
        <h1 className="text-2xl font-semibold mb-6">Your Enrolled Courses</h1>
      )}

      {message && <p className="text-red-500 text-center mb-4">{message}</p>}

      {videos.length === 0 && !message && (
        <p className="text-center">You have not enrolled in any courses yet.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, i) => (
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
                {video.title.length > 50 ? video.title.slice(0, 50) + '...' : video.title}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {video.description?.length > 80
                  ? video.description.substring(0, 80) + '...'
                  : video.description || ''}
              </p>
              <button
                onClick={() => unenroll(video.videoId)}
                className="mt-2 bg-red-600 text-white px-3 py-1 rounded"
              >
                Unenroll
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
    </>
  );
};

export default Learn;
