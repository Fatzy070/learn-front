import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { FiUser, FiCamera, FiSave, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef();

  const uploadPreset = 'Learn-m-s';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://learn-backend-1g6i.onrender.com/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);
        setFormData({
          firstName: res.data.user.firstName || "",
          lastName: res.data.user.lastName || "",
        });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load profile');
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/heic"];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(!file) return;


    if (file.size > 5 * 1024 * 1024) {
    toast.error("Image too large! Max size is 5MB.");
    return;
  }


  if (!allowed.includes(file.type)) {
  toast.error("Unsupported file type");
  return;
  }

 if (file) {
      setImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');

    try {
      let imageUrl = user?.image;

      // Upload new image if selected
      if (image) {
        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', uploadPreset);
        data.append('cloud_name', "doyiqdtoc");

        const cloudRes = await fetch(
          "https://api.cloudinary.com/v1_1/doyiqdtoc/image/upload",
          { method: "POST", body: data }
        );

        const cloudData = await cloudRes.json();
        imageUrl = cloudData.secure_url.replace('/upload/', '/upload/f_jpg/');
      }

      const updateData = { 
        firstName: formData.firstName, 
        lastName: formData.lastName, 
        image: imageUrl 
      };

      const res = await axios.post(
        `https://learn-backend-1g6i.onrender.com/api/edit-profile`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || 'Profile updated successfully!');

      // Update local state
      setUser({ ...user, ...updateData , image: imageUrl + "?t=" + Date.now() });
      setImage(null);
      setImagePreview(null);
      fileRef.current.value = null;

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  


  const getInitials = (f, l) => {
    return `${f?.charAt(0) || ""}${l?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          </div>
          <p className="text-gray-600">Update your personal information and profile picture</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover flex items-center justify-center"
                    />
                  ) : user?.image ? (
                    <img
                      src={user.image}
                      alt={user.firstName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-semibold">
                        {getInitials(user?.firstName, user?.lastName)}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Camera Overlay */}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all group-hover:scale-110"
                >
                  <FiCamera className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <input
                type="file"
                ref={fileRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Click the camera icon to change your profile picture
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG recommended • Max 5MB
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your first name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
              </div>

              
              {user?.email && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                      Cannot be changed
                    </span>
                  </div>
                </div>
              )}
            </div>

            
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Your profile information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;