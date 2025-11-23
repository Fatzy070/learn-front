import React, { useState, useEffect } from 'react';
import { IoIosSearch, IoMdClose } from "react-icons/io";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Search = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();

  // Fetch videos matching query
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://learn-backend-1g6i.onrender.com/api/courses/search`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { query },
        });

        setResults(res.data.videos || []);
      } catch (error) {
        console.error("Search error:", error.response?.data || error.message);
      }
      setLoading(false);
    };

    const debounce = setTimeout(fetchResults, 300); // debounce
    return () => clearTimeout(debounce);
  }, [query, token]);

  // Navigate to video page
  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
    setOpen(false);
  };

  // Enroll video
  const handleEnroll = async (video) => {
    try {
      const res = await axios.post(
        `https://learn-backend-1g6i.onrender.com/api/courses/enroll`,
        { videoId: video.videoId, title: video.title, thumbnail: video.thumbnail, playlistId: video.playlistId || "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message);

      const updatedUser = { ...user, enrolledVideos: [...(user.enrolledVideos || []), { videoId: video.videoId }] };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to enroll");
    }
  };

  // Check if video is enrolled
  const isEnrolled = (videoId) => {
    return user?.enrolledVideos?.some(v => v.videoId === videoId);
  };

  const renderResultItem = (video) => (
    <div
      key={video.videoId}
      className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 cursor-pointer"
    >
      <div className="flex items-center" onClick={() => handleVideoClick(video.videoId)}>
        {video.thumbnail && (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-16 h-15 object-cover rounded mr-3"
          />
        )}
        <p className="font-medium text-sm">{video.title}</p>
      </div>

      <div>
        {isEnrolled(video.videoId) ? (
          <span className="bg-green-500 text-white px-2 py-1 text-xs rounded">Enrolled</span>
        ) : (
          <button
            onClick={() => handleEnroll(video)}
            className="bg-purple-600 text-white px-2 py-1 text-xs rounded"
          >
            Enroll
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile search icon */}
      <div className="md:hidden">
        <button onClick={() => setOpen(true)} className="text-gray-500">
          <IoIosSearch size={22} />
        </button>
      </div>

      {/* Mobile full-screen search */}
      {open && (
        <div className="absolute top-0 w-full text-gray-500 border inset-0 bg-white z-50">
          <div className='flex border items-center py-1 px-1'>
            <IoIosSearch size={20} className="mr-2"/>
            <input
              type="text"
              placeholder="Search for Anything"
              className="w-full text-gray-700 py-2 outline-none"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={() => setOpen(false)} className="mr-4 text-gray-500">
              <IoMdClose size={20} />
            </button>
          </div>

          {/* Search results */}
          <div className="px-3 py-2 max-h-80 overflow-auto bg-white">
            {loading && <p>Loading...</p>}
            {!loading && results.length === 0 && query && <p>No results found</p>}
            {results.map(renderResultItem)}
          </div>
        </div>
      )}

      {/* Desktop search bar */}
      <div className="hidden md:flex border border-[1.5px] border-gray-300 text-gray-500 items-center lg:w-[400px] py-2.5 rounded-[30px] focus-within:border-[#6c63ff] transition px-3 relative">
        <IoIosSearch size={18} className="mr-2"/>
        <input
          type="text"
          className="w-full outline-none bg-transparent"
          placeholder="Search for Anything"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {/* Desktop results dropdown */}
        {query && (
          <div className="absolute top-12 w-[400px] bg-white border shadow-md z-50 max-h-60 overflow-auto">
            {loading && <p className="p-2">Loading...</p>}
            {!loading && results.length === 0 && <p className="p-2">No results found</p>}
            {results.map(renderResultItem)}
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
