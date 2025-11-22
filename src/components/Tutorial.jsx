import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import YouTube from 'react-youtube';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FiPlay, FiPause, FiCheckCircle, FiClock, FiBookOpen } from 'react-icons/fi';

const Tutorial = () => {
  const [videos, setVideos] = useState([]);
  const [message, setMessage] = useState('');
  const [videoProgress, setVideoProgress] = useState({});
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const playerRefs = useRef({});
  const timers = useRef({});

  // Fetch enrolled videos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://learn-backend-1g6i.onrender.com/api/courses/userenroll`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const enrolled = res.data.enrolledVideos || [];
        setVideos(enrolled);

        const initialProgress = {};
        enrolled.forEach(v => {
          initialProgress[v.videoId] = v.progress || 0;
        });
        setVideoProgress(initialProgress);
      } catch (error) {
        console.log('Error:', error.response?.data || error.message);
        setMessage(error.response?.data?.message || 'Something went wrong');
        toast.error('Failed to load your courses');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const opts = {
    height: '300',
    width: '100%',
    playerVars: { 
      autoplay: 0,
      modestbranding: 1,
      rel: 0
    },
  };

  // Start tracking progress every 1 sec
  const startTracking = (videoId) => {
    setActiveVideo(videoId);
    clearInterval(timers.current[videoId]);
    timers.current[videoId] = setInterval(async () => {
      const player = playerRefs.current[videoId];
      if (player && player.getCurrentTime && player.getDuration) {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        const percent = Math.round((currentTime / duration) * 100);

        setVideoProgress(prev => ({
          ...prev,
          [videoId]: percent > 100 ? 100 : percent,
        }));

        // Send progress to backend every second
        try {
          await axios.post(
            `https://learn-backend-1g6i.onrender.com/api/courses/progress/${videoId}`,
            { progress: percent },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.log('Progress update error:', err.response?.data || err.message);
        }
      }
    }, 1000);
  };

  // Stop tracking
  const stopTracking = (videoId) => {
    clearInterval(timers.current[videoId]);
  };

  // Overall course completion
  const completedCount = Object.values(videoProgress).filter(p => p >= 90).length;
  const totalCount = videos.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return '#10B981'; // Green
    if (percentage >= 50) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  const getProgressStatus = (percentage) => {
    if (percentage >= 90) return 'Completed';
    if (percentage >= 50) return 'In Progress';
    return 'Not Started';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-2">
            <FiBookOpen className="w-8 h-8" />
            <h1 className="text-3xl font-bold">My Tutorial</h1>
          </div>
          <p className="text-purple-100 text-lg">
            Track your progress and continue where you left off
          </p>
        </div>
      </div>

      {/* Progress Overview Card */}
      {videos.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Overall Progress
                </h2>
                <p className="text-gray-600 mb-4">
                  You've completed {completedCount} out of {totalCount} videos
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 mx-auto">
                  <CircularProgressbar
                    value={progressPercentage}
                    text={`${progressPercentage}%`}
                    styles={buildStyles({
                      textSize: '32px',
                      pathColor: '#10B981',
                      textColor: '#1F2937',
                      trailColor: '#E5E7EB',
                    })}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">Overall Completion</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-center">{message}</p>
          </div>
        )}

        {videos.length === 0 ? (
          <div className="text-center py-12">
            <FiBookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No courses enrolled yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start your learning journey by enrolling in some courses
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {videos.map((video, index) => {
              const progress = videoProgress[video.videoId] || 0;
              const isActive = activeVideo === video.videoId;
              const isCompleted = progress >= 90;

              return (
                <div
                  key={video.videoId}
                  className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 ${
                    isActive ? 'border-purple-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Video Player */}
                      <div className="lg:w-1/2">
                        <div className="relative rounded-lg overflow-hidden bg-black">
                          <YouTube
                            videoId={video.videoId}
                            opts={opts}
                            onReady={(event) => (playerRefs.current[video.videoId] = event.target)}
                            onPlay={() => startTracking(video.videoId)}
                            onPause={() => stopTracking(video.videoId)}
                            onEnd={() => {
                              stopTracking(video.videoId);
                              toast.success('Video completed! 🎉');
                            }}
                          />
                          {isActive && (
                            <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-sm font-medium">
                              <FiPlay className="w-3 h-3 inline mr-1" />
                              Playing
                            </div>
                          )}
                        </div>

                        {/* Progress Indicator */}
                        <div className="flex items-center gap-4 mt-4">
                          <div className="w-16 h-16">
                            <CircularProgressbar
                              value={progress}
                              text={`${progress}%`}
                              styles={buildStyles({
                                textSize: '32px',
                                pathColor: getProgressColor(progress),
                                textColor: '#1F2937',
                                trailColor: '#E5E7EB',
                              })}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {isCompleted ? (
                                <FiCheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <FiClock className="w-4 h-4 text-amber-500" />
                              )}
                              <span className={`text-sm font-medium ${
                                isCompleted ? 'text-green-700' : 'text-amber-700'
                              }`}>
                                {getProgressStatus(progress)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${progress}%`,
                                  backgroundColor: getProgressColor(progress)
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="lg:w-1/2">
                        <div className="flex items-start justify-between mb-3">
                          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                            Video {index + 1} of {videos.length}
                          </span>
                          {isCompleted && (
                            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                              <FiCheckCircle className="w-4 h-4" />
                              Completed
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                          {video.title}
                        </h3>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FiClock className="w-4 h-4" />
                            <span className="text-sm">
                              Progress: {progress}% watched
                            </span>
                          </div>

                          {video.description && (
                            <div>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {video.description.length > 150 
                                  ? `${video.description.substring(0, 150)}...` 
                                  : video.description
                                }
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                const player = playerRefs.current[video.videoId];
                                if (player) player.playVideo();
                              }}
                              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <FiPlay className="w-4 h-4" />
                              {progress > 0 ? 'Continue' : 'Start'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tutorial;