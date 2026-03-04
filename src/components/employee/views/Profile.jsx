import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Github,
  Code,
  Clock,
  MapPin,
  Briefcase,
  Award,
  User,
  Loader2,
  AlertCircle
} from "lucide-react";

import userAvatar from "../../../assets/chinnu.jpeg";
import { fetchEmployeeProfile } from "../../../api/employeeApi";

const Profile = ({ data }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        setLoading(true);
        console.log("Fetching profile from API...");
        const apiData = await fetchEmployeeProfile();
        console.log("Profile Data received:", apiData);
        
        // Handle array response if API returns a list (sometimes common for 'employee' endpoints)
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
          profilePic: profileData.profileImage || userAvatar
        });
        setError(null);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Unable to load profile data from server.");
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
            profilePic: userAvatar
        });
      } finally {
        setLoading(false);
      }
    };

    getProfileData();
  }, [data]);

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
        {/* Avatar */}
        <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-50">
          <img
            src={profile.profilePic === 'profile1.png' ? userAvatar : profile.profilePic}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = userAvatar;
            }}
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
