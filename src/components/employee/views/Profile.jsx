// import React, { useState } from "react";
// import {
//   Github,
//   Code,
//   Clock,
//   MapPin,
//   Briefcase,
//   Award,
//   Mail,
//   Phone,
//   Hash,
//   User,
// } from "lucide-react";

// import userAvatar from "../../../assets/chinnu.jpeg";
// import EditProfile from "./EditProfile";



// const Profile = ({ data }) => {
//   // Helper → return data only
//   const getProfileData = () => {
//     return {
//       firstName: data?.firstName || "Namburi",
//       lastName: data?.lastName || "Namburi",
//       designation: "Senior Frontend Developer",
//       project: data?.project || "ETS Dashboard Redesign",
//       cohort: data?.cohort || "Batch-03",
//       location: "Hyderabad, India",
//       email: data?.email || "nambu.manasvi@example.com",
//       phone: data?.phone || "+91 9666477844",
//       id: data?.id || "EMP-1023",
//       github: data?.github || "manucode",
//       profilePic: userAvatar, 
//       analytics: data?.analytics || { attendance: "92%", coding: "85" },
//       tasks: data?.tasks || [],
//     };
//   };

//   const profile = getProfileData();
//   const [phone] = useState(profile.phone);
//   const [isEditing, setIsEditing] = useState(false);
// const [employee, setEmployee] = useState(profile);


//   return (
//     <div className="p-6 md:p-8 rounded-xl h-full overflow-y-auto text-gray-900 pb-20">
//       {/* ================= HEADER ================= */}
//       <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
//         {/* Avatar */}
//         <div className="relative">
//           <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
//             <img
//               src={profile.profilePic}
//               alt="Profile"
//               className="w-full h-full object-cover object-center"
//             />
//           </div>

//           {/* Online status */}
//           <div
//             className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white"
//             title="Active"
//           ></div>
//         </div>

//         {/* Name & Info */}
//         <div className="text-center md:text-left flex-1 z-10">
//           <h1 className="text-4xl font-bold mb-1">
//             {profile.firstName} {profile.lastName}
//           </h1>

//           <p className="text-blue-600 text-lg font-medium mb-4">
//             {profile.designation}
//           </p>

//           <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-600">
//             <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border">
//               <Briefcase size={14} />
//               {profile.project}
//             </div>
//             <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border">
//               <Award size={14} />
//               {profile.cohort}
//             </div>
//             <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border">
//               <MapPin size={14} />
//               {profile.location}
//             </div>
//           </div>
//         </div>
// {/* ====================================================Buttons======================================== */}
//         {/* Buttons */}
//         {/* <div className="flex flex-col gap-3">
//           <button className="bg-gray-900 text-white px-6 py-2.5 rounded-xl">
//             Edit Profile
//           </button> */}


// <div className="flex flex-col gap-3">
// <button
//   onClick={() => setIsEditing(true)}
//   className="bg-gray-900 text-white px-6 py-2.5 rounded-xl"
// >
//   Edit Profile
// </button>




//           <button className="bg-white border px-6 py-2.5 rounded-xl">
//             Share Profile
//           </button>
//         </div>
//       </div>

//       {/* ================= BODY ================= */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* LEFT */}
//         <div className="lg:col-span-2 space-y-8">
//           {/* Metrics */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
//               <Clock />
//               <div>
//                 <p className="text-sm text-gray-500">Attendance</p>
//                 <h3 className="text-2xl font-bold">
//                   {profile.analytics.attendance}
//                 </h3>
//               </div>
//             </div>

//             <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
//               <Code />
//               <div>
//                 <p className="text-sm text-gray-500">Coding Score</p>
//                 <h3 className="text-2xl font-bold">
//                   {profile.analytics.coding}
//                 </h3>
//               </div>
//             </div>
//           </div>

//           {/* Personal Info */}
//           <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
//             <div className="px-6 py-4 border-b flex items-center gap-2">
//               <User size={18} />
//               <h3 className="font-bold">Personal Information</h3>
//             </div>

//             <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="text-xs text-gray-400">Email</label>
//                 <p className="font-medium">{profile.email}</p>
//               </div>
//               <div>
//                 <label className="text-xs text-gray-400">Phone</label>
//                 <p className="font-medium">{phone}</p>
//               </div>
//               <div>
//                 <label className="text-xs text-gray-400">Employee ID</label>
//                 <p className="font-medium">{profile.id}</p>
//               </div>
//               <div>
//                 <label className="text-xs text-gray-400">Location</label>
//                 <p className="font-medium">{profile.location}</p>
//               </div>
//             </div>
//           </div>

//           {/* About */}
//           <div className="bg-white p-6 rounded-2xl shadow-sm border">
//             <h3 className="font-bold mb-3">About</h3>
//             <p className="text-gray-600 text-sm">
//               Experienced Senior Frontend Developer with strong knowledge in
//               React and UI design. Currently working on {profile.project}.
//             </p>
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="space-y-8">
//           {/* GitHub */}
//           <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl">
//             <div className="flex items-center gap-4 mb-6">
//               <Github />
//               <div>
//                 <h3 className="font-bold">GitHub Activity</h3>
//                 <p className="text-gray-400 text-xs">@{profile.github}</p>
//               </div>
//             </div>

//             <button className="w-full mt-4 bg-white text-gray-900 py-2 rounded-lg font-bold text-sm">
//               View GitHub Profile
//             </button>
//           </div>

//           {/* Tasks */}
//           <div className="bg-white p-6 rounded-2xl shadow-sm border">
//             <h3 className="font-bold mb-4">Recent Tasks</h3>
//             {profile.tasks.length > 0 ? (
//               profile.tasks.map((task, i) => (
//                 <p key={i}>{task.taskTitle}</p>
//               ))
//             ) : (
//               <p className="text-sm text-gray-400 italic">
//                 No recent tasks found.
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;






import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Github,
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
  const profile = { ...data, location: data?.location || "Hyderabad, India" };
  const profilePic = profile?.profilePic || userAvatar;

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

          <button className="bg-white border px-6 py-2.5 rounded-xl">
            Share Profile
          </button>
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
                  {profile.analytics.attendance}
                </h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border flex items-center gap-4">
              <Code />
              <div>
                <p className="text-sm text-gray-500">Coding Score</p>
                <h3 className="text-2xl font-bold">
                  {profile.analytics.coding}
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

        {/* RIGHT */}
        <div>
          <div className="bg-gray-900 text-white p-6 rounded-2xl">
            <div className="flex items-center gap-4 mb-4">
              <Github />
              <div>
                <h3 className="font-bold">GitHub Activity</h3>
                <p className="text-gray-400 text-xs">@{profile.github}</p>
              </div>
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
    <p className="font-medium">{value}</p>
  </div>
);

export default Profile;
