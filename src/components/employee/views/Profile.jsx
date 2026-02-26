import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Code,
  Clock,
  MapPin,
  Briefcase,
  Award,
  User,
} from "lucide-react";

import userAvatar from "../../../assets/chinnu.jpeg";

const Profile = ({ data }) => {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const profile = {
    ...(data || {}),
    location: data?.location || "Hyderabad, India",
  };

  const profilePic = profile?.profilePic || userAvatar;

  // API CALL
  const createProfile = async () => {

    setIsLoading(true);

    try {

      const response = await axios.post(
        "http://localhost:8081/api/profiles/create",
        profile
      );

      console.log("Profile Created:", response.data);

      alert("Profile created successfully");

      navigate("/employee/dashboard");

    } catch (error) {

      console.error("Error creating profile:", error);

      alert(
        error.response?.data?.message ||
        "Failed to create profile. Check backend."
      );

    } finally {

      setIsLoading(false);

    }
  };

  return (
    <div className="p-6 md:p-8 rounded-xl h-full overflow-y-auto text-gray-900 pb-20">

      {/* HEADER */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border mb-8 flex flex-col md:flex-row items-center gap-8">

        {/* Avatar */}
        <div className="w-32 h-32 rounded-full overflow-hidden">
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1">

          <h1 className="text-4xl font-bold">
            {profile.firstName} {profile.lastName}
          </h1>

          <p className="text-blue-600">{profile.designation}</p>

          <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600">

            <div className="flex items-center gap-2">
              <Briefcase size={14} />
              {profile.project}
            </div>

            <div className="flex items-center gap-2">
              <Award size={14} />
              {profile.cohort}
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={14} />
              {profile.location}
            </div>

          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">

          <button
            onClick={() => navigate("/employee/edit-profile")}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-xl"
          >
            Edit Profile
          </button>

          {/* <button
            onClick={createProfile}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Profile"}
          </button> */}

        </div>
      </div>

      {/* BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4">

            <div className="bg-white p-5 rounded-xl border flex items-center gap-4">
              <Clock />
              <div>
                <p className="text-sm text-gray-500">Attendance</p>
                <h3 className="text-2xl font-bold">
                  {profile?.analytics?.attendance || 0}
                </h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border flex items-center gap-4">
              <Code />
              <div>
                <p className="text-sm text-gray-500">Coding Score</p>
                <h3 className="text-2xl font-bold">
                  {profile?.analytics?.coding || 0}
                </h3>
              </div>
            </div>

          </div>

          {/* Personal Info */}
          <div className="bg-white rounded-2xl border">

            <div className="px-6 py-4 border-b flex items-center gap-2">
              <User size={18} />
              <h3 className="font-bold">Personal Information</h3>
            </div>

            <div className="p-6 grid grid-cols-2 gap-6">

              <Info label="Email" value={profile.email} />

              <Info label="Phone" value={profile.phone} />

              <Info label="Employee ID" value={profile.id} />

              <Info label="Location" value={profile.location} />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

const Info = ({ label, value }) => (

  <div>
    <label className="text-xs text-gray-400">{label}</label>
    <p className="font-medium">{value || "N/A"}</p>
  </div>

);

export default Profile;