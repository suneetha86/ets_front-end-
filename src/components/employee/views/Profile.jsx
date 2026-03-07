import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Code,
  Clock,
  MapPin,
  Briefcase,
  Award,
  User,
  Loader2,
  AlertCircle,
  Github,
  Camera,
  Upload,
  X,
  Check
} from "lucide-react";
import { fetchEmployeeProfile, uploadProfileImage } from "../../../api/employeeApi";

const Profile = ({ data }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Image upload states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropSize, setCropSize] = useState(200);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        setLoading(true);
        console.log("Fetching profile from API...");
        const apiData = await fetchEmployeeProfile();
        console.log("Profile Data received:", apiData);

        // Handle array response if API returns a list
        const profileData = Array.isArray(apiData) ? apiData[0] : apiData;

        // Map API fields to our UI structure
        setProfile({
          fullName: profileData.name || `${data?.firstName} ${data?.lastName}`,
          designation: profileData.designation || "Sr Backend Developer",
          project: profileData.systemName || data?.project || "Not Assigned",
          cohort: profileData.cohort || data?.cohort || "N/A",
          location: profileData.location || "Hyderabad, India",
          email: profileData.email || data?.email,
          phone: profileData.phone || data?.phone,
          id: profileData.employeeId || data?.id,
          github: data?.github || "manucode",
          attendance: profileData.attendance ? `${profileData.attendance}%` : data?.analytics?.attendance || "0%",
          codingScore: profileData.codingScore || data?.analytics?.codingScore || 0,
          profilePic: profileData.profileImage || null
        });
        setError(null);
      } catch (err) {
        console.error("Failed to load profile:", err);
        
        // Fallback to local data if API fails
        setProfile({
          fullName: `${data?.firstName} ${data?.lastName}`,
          designation: "Sr Backend Developer",
          project: data?.project || "Not Assigned",
          cohort: data?.cohort || "N/A",
          location: data?.location || "Hyderabad, India",
          email: data?.email,
          phone: data?.phone,
          id: data?.id,
          github: data?.github || "manucode",
          attendance: data?.analytics?.attendance || "0%",
          codingScore: data?.analytics?.codingScore || 0,
          profilePic: null
        });
      } finally {
        setLoading(false);
      }
    };

    getProfileData();
  }, [data]);

  // Handle image file selection
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
      setCroppedImage(null);
    };
    reader.readAsDataURL(file);
  };

  // Handle image cropping
  const handleCrop = () => {
    if (!selectedImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = cropSize;
      canvas.height = cropSize;
      ctx.drawImage(img, cropX, cropY, cropSize, cropSize, 0, 0, cropSize, cropSize);
      setCroppedImage(canvas.toDataURL("image/jpeg", 0.9));
    };
    img.src = selectedImage;
  };

  // Handle image upload to backend
  const handleUpload = async () => {
    if (!croppedImage || !profile?.id) {
      alert("Please crop an image first");
      return;
    }

    try {
      setUploading(true);

      // Convert base64 to blob
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], `profile-${profile.id}.jpg`, { type: "image/jpeg" });

      // Call API to upload
      const result = await uploadProfileImage(file, profile.id);
      console.log("Upload response:", result);

      // Update profile picture
      setProfile(prev => ({
        ...prev,
        profilePic: croppedImage
      }));

      setUploadSuccess(true);
      setTimeout(() => {
        setShowUploadModal(false);
        setSelectedImage(null);
        setCroppedImage(null);
        setUploadSuccess(false);
      }, 1500);

      alert("Profile picture updated successfully!");
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
        <Loader2 className="animate-spin" size={48} />
        <p className="font-medium">Loading profile information...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 rounded-xl h-full overflow-y-auto text-gray-900 pb-20 scrollbar-hide">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border mb-8 flex flex-col md:flex-row items-center gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
        {/* Avatar with Upload Button */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-50 bg-gray-100 flex items-center justify-center">
            {profile.profilePic ? (
              <img
                src={profile.profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            {!profile.profilePic && (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <User size={48} className="text-gray-400" />
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setShowUploadModal(true);
              fileInputRef.current?.click();
            }}
            className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all transform group-hover:scale-110 active:scale-95"
            title="Upload profile picture"
          >
            <Camera size={18} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight">
            {profile.fullName}
          </h1>

          <p className="text-blue-600 font-semibold text-lg">{profile.designation}</p>

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600 justify-center md:justify-start">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border">
              <Briefcase size={14} className="text-blue-500" />
              {profile.project}
            </div>

            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border">
              <Award size={14} className="text-purple-500" />
              {profile.cohort}
            </div>

            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border">
              <MapPin size={14} className="text-red-500" />
              {profile.location}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/employee/edit-profile")}
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-gray-200 active:scale-95"
          >
            Edit Profile
          </button>

          <button className="bg-white border hover:bg-gray-50 px-8 py-3 rounded-xl font-medium transition-all text-gray-700 hover:border-gray-400">
            Share Profile
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-3 rounded-xl">
                <Clock className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Attendance</p>
                <h3 className="text-3xl font-black text-gray-800">
                  {profile.attendance}
                </h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-50 p-3 rounded-xl">
                <Code className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Coding Score</p>
                <h3 className="text-3xl font-black text-gray-800">
                  {profile.codingScore}
                </h3>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <div className="px-8 py-5 border-b bg-gray-50/50 flex items-center gap-3">
              <User size={20} className="text-gray-500" />
              <h3 className="font-bold text-lg text-gray-800">Personal Information</h3>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <Info label="Email" value={profile.email} />
              <Info label="Phone" value={profile.phone} />
              <Info label="Employee ID" value={profile.id} />
              <Info label="Location" value={profile.location} />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Github size={120} />
            </div>

            <div className="flex items-center gap-5">
              <div className="bg-white/10 p-3 rounded-xl">
                <Github size={28} />
              </div>
              <div>
                <h3 className="font-bold text-xl">GitHub Activity</h3>
                <p className="text-gray-400 text-sm">@{profile.github}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                <span className="text-gray-400">Repositories</span>
                <span className="font-bold">24</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                <span className="text-gray-400">Followers</span>
                <span className="font-bold">142</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Contributions</span>
                <span className="font-bold">842</span>
              </div>
            </div>

            <button className="w-full bg-white text-gray-900 py-3 rounded-xl font-bold text-sm tracking-wide hover:bg-gray-100 transition-colors shadow-lg active:scale-95">
              View GitHub Profile
            </button>
          </div>
        </div>
      </div>

      {/* IMAGE UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-800">Upload Profile Picture</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedImage(null);
                  setCroppedImage(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {!selectedImage ? (
                // Upload section
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-blue-300 rounded-xl p-12 text-center cursor-pointer hover:bg-blue-50 transition-colors"
                >
                  <Upload className="mx-auto text-blue-500 mb-3" size={40} />
                  <p className="text-gray-700 font-semibold">Click to upload or drag and drop</p>
                  <p className="text-gray-500 text-sm mt-1">PNG, JPG, WebP • Max 5MB</p>
                </div>
              ) : !croppedImage ? (
                // Crop section
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <p className="text-sm text-gray-600 mb-4 font-medium">Preview & Adjust Position</p>
                    <div className="mb-6">
                      <img
                        src={selectedImage}
                        alt="Preview"
                        className="max-w-full max-h-64 mx-auto rounded-lg"
                      />
                    </div>

                    {/* Crop controls */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700">X Position: {cropX}</label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={cropX}
                          onChange={(e) => setCropX(Number(e.target.value))}
                          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Y Position: {cropY}</label>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          value={cropY}
                          onChange={(e) => setCropY(Number(e.target.value))}
                          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Crop Size: {cropSize}px</label>
                        <input
                          type="range"
                          min="100"
                          max="400"
                          value={cropSize}
                          onChange={(e) => setCropSize(Number(e.target.value))}
                          className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCrop}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors"
                  >
                    Apply Crop
                  </button>
                </div>
              ) : (
                // Preview cropped image
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl text-center">
                    <p className="text-sm text-gray-600 mb-4 font-medium">Cropped Preview</p>
                    <img
                      src={croppedImage}
                      alt="Cropped"
                      className="w-40 h-40 rounded-full mx-auto border-4 border-blue-200"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setCroppedImage(null);
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-semibold transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Uploading...
                        </>
                      ) : uploadSuccess ? (
                        <>
                          <Check size={18} />
                          Success!
                        </>
                      ) : (
                        <>
                          <Upload size={18} />
                          Upload
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>
    <p className="font-semibold text-gray-800 text-lg">{value || "N/A"}</p>
  </div>
);

export default Profile;