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
  Check,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { fetchEmployeeProfile, uploadProfileImage, createProfile } from "../../../api/employeeApi";
import EditProfile from "./EditProfile";
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

const Profile = ({ data }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});


  
  // Image upload states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'success' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

        // Check for persisted profile picture in local storage
        const userId = data?.id || profileData.employeeId;
        const persistedPic = userId ? localStorage.getItem(`aja_profile_pic_${userId}`) : null;

        // Map API fields to our UI structure
        setProfile({
          fullName: [data?.firstName, data?.lastName].filter(Boolean).join(" ") || profileData.name || "Employee Node",
          designation: data?.designation || profileData.designation || "Sr Backend Developer",
          project: data?.dept || data?.project || profileData.systemName || "Not Assigned",
          cohort: data?.cohort || profileData.cohort || "N/A",
          location: data?.location || profileData.location || "Hyderabad, India",
          email: data?.email || profileData.email,
          phone: data?.phone || profileData.phone,
          id: userId,
          github: data?.github || "manucode",
          attendance: profileData.attendance ? `${profileData.attendance}%` : data?.analytics?.attendance || "0%",
          codingScore: profileData.codingScore || data?.analytics?.codingScore || 0,
          profilePic: persistedPic || profileData.profileImage || DEFAULT_AVATAR
        });
        setLastSynced(new Date().toLocaleTimeString());
        setIsLive(true);
        setIsFallbackMode(false);
        setError(null);



      } catch (err) {
        console.error("Failed to load profile:", err);
        
        // Fallback to local data if API fails
        // Check for persisted profile picture in local storage
        const userId = data?.id;
        const persistedPic = userId ? localStorage.getItem(`aja_profile_pic_${userId}`) : null;

        setProfile({
          fullName: [data?.firstName, data?.lastName].filter(Boolean).join(" ") || "Employee Node",
          designation: data?.designation || "Sr Backend Developer",
          project: data?.dept || data?.project || "Not Assigned",
          cohort: data?.cohort || "N/A",
          location: data?.location || "Hyderabad, India",
          email: data?.email,
          phone: data?.phone,
          id: userId,
          github: data?.github || "manucode",
          attendance: data?.analytics?.attendance || "0%",
          codingScore: data?.analytics?.codingScore || 0,
          profilePic: persistedPic || DEFAULT_AVATAR,
        });
        setIsFallbackMode(true);

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
      setModal({ show: true, title: "Validation Error", message: "Image size must be less than 5MB", type: 'error' });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setModal({ show: true, title: "Validation Error", message: "Please select a valid image file", type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
      setCroppedImage(null);
    };
    reader.readAsDataURL(file);
  };

  // Handle image cropping (Centered Zoom Logic)
  const handleCrop = () => {
    if (!selectedImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Create a 400x400 high-res output
      const targetSize = 400;
      canvas.width = targetSize;
      canvas.height = targetSize;

      // Calculate source dimensions (smallest side)
      const minDimension = Math.min(img.naturalWidth, img.naturalHeight);
      const sourceSize = minDimension / zoom;
      
      // Calculate centered coordinates
      const sx = (img.naturalWidth - sourceSize) / 2;
      const sy = (img.naturalHeight - sourceSize) / 2;

      // Draw to canvas
      ctx.clearRect(0, 0, targetSize, targetSize);
      
      // circular clipping
      ctx.beginPath();
      ctx.arc(targetSize/2, targetSize/2, targetSize/2, 0, Math.PI * 2);
      ctx.clip();
      
      ctx.drawImage(
        img,
        sx, sy, sourceSize, sourceSize,
        0, 0, targetSize, targetSize
      );

      setCroppedImage(canvas.toDataURL("image/jpeg", 0.95));
    };
    img.src = selectedImage;
  };

  // Handle image upload to backend
  const handleUpload = async () => {
    if (!croppedImage || !profile?.id) {
      setModal({ show: true, title: "Input Required", message: "Please crop an image first", type: 'error' });
      return;
    }

    try {
      setUploading(true);

      // Convert base64 to blob (more robust method)
      const byteString = atob(croppedImage.split(',')[1]);
      const mimeString = croppedImage.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], `profile-${profile.id || 'default'}.jpg`, { type: "image/jpeg" });

      // Call API to upload
      const result = await uploadProfileImage(file, profile.id || '99');
      console.log("Upload response:", result);

      // Update profile picture and persist to local storage
      setProfile(prev => ({
        ...prev,
        profilePic: croppedImage
      }));
      
      if (profile.id) {
        localStorage.setItem(`aja_profile_pic_${profile.id}`, croppedImage);
      }

      setUploadSuccess(true);
      setTimeout(() => {
        setShowUploadModal(false);
        setSelectedImage(null);
        setCroppedImage(null);
        setUploadSuccess(false);
      }, 1500);

      setModal({ show: true, title: "Upload Success", message: "Profile picture updated successfully!", type: 'success' });
    } catch (err) {
      console.error("Error uploading image:", err);
      setModal({ show: true, title: "Upload Failed", message: "Failed to upload image. Please try again.", type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleCreateProfile = async () => {
    try {
      setIsInitializing(true);
      const payload = {
        profileImage: "profile1.png",
        name: profile.fullName,
        designation: profile.designation,
        systemName: profile.project,
        cohort: profile.cohort,
        location: profile.location,
        email: profile.email,
        phone: profile.phone,
        employeeId: String(profile.id),
        attendance: parseInt(profile.attendance),
        codingScore: Number(profile.codingScore)
      };

      console.log("Initializing Profile (POST):", payload);
      await createProfile(payload);
      
      setModal({ show: true, title: "Handshake Complete", message: "Digital Identity initialized in core repository.", type: 'success' });
      setIsFallbackMode(false);
      // Refresh to get server-side data
      window.location.reload();
    } catch (err) {
      console.error("Initialization Failed:", err);
      setModal({ show: true, title: "Protocol Breach", message: "Failed to create digital profile record.", type: 'error' });
    } finally {
      setIsInitializing(false);
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
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-3 text-rose-700 animate-in slide-in-from-left-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} />
            <p className="text-sm font-black uppercase tracking-tight">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="p-2 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      )}


      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-400 to-white p-8 rounded-2xl shadow-lg border-b mb-8 flex flex-col md:flex-row items-center gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
        {/* Avatar with Upload Button */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-slate-100 bg-slate-100 flex items-center justify-center shadow-2xl">
            <img
                src={profile.profilePic || DEFAULT_AVATAR}
                alt="Profile"
                className="w-full h-full object-cover"
            />
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
          <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-sm">
            {profile.fullName}
          </h1>

          <p className="text-white/90 font-bold text-lg mt-1">{profile.designation}</p>

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
            onClick={() => setIsEditModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 active:scale-95"
          >
            Edit Profile
          </button>
          
          {isFallbackMode ? (
            <button
              onClick={handleCreateProfile}
              disabled={isInitializing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 flex items-center justify-center gap-2 active:scale-95"
            >
              {isInitializing ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {isInitializing ? "Initializing..." : "Initialize Identity (POST)"}
            </button>
          ) : (
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 shadow-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Live: AJA Vault</span>
              </div>
              <p className="text-[8px] text-white/60 font-black uppercase tracking-tighter mt-1 mr-2">Last Sync: {lastSynced}</p>
            </div>
          )}
        </div>


      </div>

      {/* BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-sky-400 to-sky-600 p-6 rounded-2xl flex items-center gap-5 shadow-lg shadow-sky-100 hover:shadow-sky-200 hover:scale-[1.02] transition-all duration-300 text-white">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
                <Clock className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-sky-100 uppercase tracking-wider opacity-80">Attendance</p>
                <h3 className="text-3xl font-black">{profile.attendance}</h3>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-6 rounded-2xl flex items-center gap-5 shadow-lg shadow-emerald-100 hover:shadow-emerald-200 hover:scale-[1.02] transition-all duration-300 text-white">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
                <Code className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-100 uppercase tracking-wider opacity-80">Coding Score</p>
                <h3 className="text-3xl font-black">{profile.codingScore}</h3>
              </div>
            </div>
          </div>

          {/* Employee & Bank Details - Reference Structure */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <div className="px-8 py-6 border-b border-slate-50 bg-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-purple-600 to-sky-500 p-2.5 rounded-2xl shadow-lg shadow-blue-100">
                  <User size={20} className="text-white" />
                </div>
                <h3 className="font-black text-xl text-slate-800 tracking-tight">Identity & Vault Parameters</h3>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-purple-100 shadow-sm">Verified AJA Record</span>
                {isLive && <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-tighter animate-pulse border border-emerald-100">Synchronized (GET)</span>}
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Info label="Employee Name" value={profile.fullName} />
              <Info label="Employee ID" value={profile.id} />
              <Info label="Designation" value={profile.designation} />
              
              <Info label="Department" value={profile.project} />
              <Info label="PAN (Tax ID)" value="ABCPK1234D" />
              <Info label="UAN (PF Number)" value="100987654321" />
              
              <Info label="Bank Account" value="**** **** **** 8821" />
              <Info label="IFSC Code" value="AJA0001234" />
              <Info label="Payment Status" value="Active - Monthly" />
              
              <Info label="Email Address" value={profile.email} />
              <Info label="Contact Phone" value={profile.phone} />
              <Info label="Work Location" value={profile.location} />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="animate-in fade-in slide-in-from-right-4 duration-700">
          <div 
            style={{ backgroundColor: '#81e3e3' }}
            className="text-slate-900 p-8 rounded-[2rem] shadow-2xl space-y-8 relative overflow-hidden group hover:shadow-cyan-200 transition-all duration-500 border border-cyan-200"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700">
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
                    <p className="text-sm text-gray-600 mb-4 font-medium uppercase tracking-widest text-center">Smart Center-Crop Preview</p>
                    <div className="mb-6 relative w-64 h-64 mx-auto overflow-hidden rounded-2xl border-4 border-white shadow-xl bg-slate-200">
                      <img
                        src={selectedImage}
                        alt="Preview"
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ease-out min-w-full min-h-full object-cover"
                        style={{ transform: `translate(-50%, -50%) scale(${zoom})` }}
                      />
                      {/* Circular Overlay Mask */}
                      <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none flex items-center justify-center">
                         <div className="w-full h-full rounded-full border-2 border-white/50 shadow-[0_0_0_1000px_rgba(0,0,0,0.3)]"></div>
                      </div>
                    </div>

                    {/* Crop controls */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Zoom Level: {Math.round(zoom * 100)}%</label>
                        <button 
                             onClick={() => setZoom(1)}
                             className="text-[10px] font-bold text-blue-600 hover:text-blue-700"
                        >Reset</button>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <p className="text-[9px] text-gray-400 font-medium text-center italic">Drag the slider to zoom into your face for a perfect profile crop</p>
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

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col scale-in-center animate-in zoom-in-95 duration-300">
            <div className="bg-blue-600 p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">Modify Profile Parameters</h2>
                  <p className="text-[10px] opacity-70 uppercase font-black tracking-widest">AJA Enterprise Identity Management</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <EditProfile 
                data={profile} 
                onClose={() => setIsEditModalOpen(false)}
                onSave={(updated) => {
                  setProfile({
                    fullName: updated.name || `${updated.firstName} ${updated.lastName}`,
                    designation: updated.designation,
                    project: updated.systemName,
                    cohort: updated.cohort,
                    location: updated.location,
                    email: updated.email,
                    phone: updated.phone,
                    id: updated.employeeId,
                    github: updated.github,
                    attendance: `${updated.attendance}%`,
                    codingScore: updated.codingScore,
                    profilePic: updated.profilePic || profile.profilePic,
                    firstName: updated.firstName,
                    lastName: updated.lastName
                  });
                  setIsEditModalOpen(false);
                }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL NOTIFICATION ── */}
      {modal.show && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[500] flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 text-center">
                  <div className={`${modal.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'} p-8 flex flex-col items-center gap-4 relative overflow-hidden`}>
                      <div className="absolute top-2 right-4 opacity-10 rotate-12">
                          {modal.type === 'success' ? <CheckCircle size={100} /> : <AlertCircle size={100} />}
                      </div>
                      <div className="relative z-10 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                          {modal.type === 'success' ? <CheckCircle className="text-emerald-500" size={32} /> : <AlertCircle className="text-rose-500" size={32} />}
                      </div>
                      <div className="relative z-10">
                          <h3 className="font-black text-xl text-white tracking-tight">{modal.title}</h3>
                      </div>
                  </div>
                  <div className="p-8 text-center">
                      <p className="text-slate-600 font-bold text-sm leading-relaxed mb-6">
                          {modal.message}
                      </p>
                      <button 
                          onClick={() => setModal({ ...modal, show: false })}
                          className={`w-full py-4 ${modal.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-100'} text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95`}
                      >
                          Acknowledge
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="space-y-2 p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-100 hover:from-white hover:to-white transition-all duration-300 border border-blue-100 shadow-sm hover:shadow-xl hover:scale-[1.02] group">
    <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors uppercase">{label}</label>
    <p className="font-black text-slate-800 text-base tracking-tight leading-none pt-1">{value || "N/A"}</p>
  </div>
);

export default Profile;