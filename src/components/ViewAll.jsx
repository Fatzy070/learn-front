import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ViewAll = () => {
  const { playlistId } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/courses/playlist/${playlistId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVideos(res.data.videos);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [playlistId, token]);

  const enroll = async (video) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/courses/enroll`,
        { videoId: video.videoId, title: video.title, thumbnail: video.thumbnail, playlistId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);

      const updatedUser = { ...user, enrolledVideos: [...(user.enrolledVideos || []), { videoId: video.videoId, title: video.title }] };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setVideos([...videos]); // trigger re-render
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

      const updatedUser = { ...user, enrolledVideos: user.enrolledVideos.filter(v => v.videoId !== videoId) };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setVideos([...videos]); // trigger re-render
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) return <p className="p-5 text-center">Loading...</p>;

  return (
    <div className="px-5 py-8">
      <h2 className="text-2xl font-bold mb-6">All Videos</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.videoId} className="shadow-md rounded-lg overflow-hidden bg-white">
            <iframe
              width="100%"
              height="180"
              src={`https://www.youtube.com/embed/${video.videoId}`}
              allowFullScreen
              className="rounded-t-lg"
            ></iframe>
            <div className="p-3">
              <h2 className="text-sm font-semibold">
                {video.title.length > 50 ? video.title.slice(0, 50) + "..." : video.title}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {video.description.length > 100 ? video.description.substring(0, 80) + "..." : video.description}
              </p>
              <div className="mt-2">
                {user?.enrolledVideos?.some(v => v.videoId === video.videoId) ? (
                  <button
                    onClick={() => unenroll(video.videoId)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Unenroll
                  </button>
                ) : (
                  <button
                    onClick={() => enroll(video)}
                    className="bg-purple-600 text-white px-3 py-1 rounded"
                  >
                    Enroll
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAll;
