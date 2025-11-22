import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Video = () => {
  const { videoId } = useParams(); // videoId from search click
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchVideo = async () => {
      try {
       
        const res = await axios.get(
          `https://learn-backend-1g6i.onrender.com/api/courses/video/${videoId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVideo(res.data.video);
      } catch (error) {
        console.error("Error fetching video:", error);
        toast.error("Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId, token]);

  const enroll = async () => {
    try {
      const res = await axios.post(
        `https://learn-backend-1g6i.onrender.com/api/courses/enroll`,
        { videoId: video.videoId, title: video.title, thumbnail: video.thumbnail, playlistId: video.playlistId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);

      const updatedUser = { ...user, enrolledVideos: [...(user.enrolledVideos || []), { videoId: video.videoId, title: video.title }] };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const unenroll = async () => {
    try {
      const res = await axios.delete(
        `https://learn-backend-1g6i.onrender.com/api/courses/unenroll/${video.videoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);

      const updatedUser = { ...user, enrolledVideos: user.enrolledVideos.filter(v => v.videoId !== video.videoId) };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) return <p className="p-5 text-center">Loading...</p>;
  if (!video) return <p className="p-5 text-center">Video not found</p>;

  const isEnrolled = user?.enrolledVideos?.some(v => v.videoId === video.videoId);

  return (
    <div className="px-5 py-8 max-w-4xl mx-auto">
      <div className="shadow-md rounded-lg bg-white overflow-hidden">
        <iframe
          width="100%"
          height="500"
          src={`https://www.youtube.com/embed/${video.videoId}`}
          allowFullScreen
          className="rounded-t-lg"
        ></iframe>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
          <p className="text-gray-700 mb-4">
            {video.description.length > 300 ? video.description.slice(0, 300) + "..." : video.description}
          </p>
          <button
            onClick={isEnrolled ? unenroll : enroll}
            className={`px-4 py-2 rounded ${isEnrolled ? "bg-red-600 text-white" : "bg-purple-600 text-white"}`}
          >
            {isEnrolled ? "Unenroll" : "Enroll"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Video;
