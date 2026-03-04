import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userAvatar from "../../../assets/chinnu.jpeg";
import { updateProfile } from "../../../api/employeeApi";

const EditProfile = ({ data, onSave }) => {
  const navigate = useNavigate();

  // Debug logging
  useEffect(() => {
    console.log("EditProfile rendered. Data:", data);
  }, [data]);

  const [form, setForm] = useState({
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    email: data?.email || "",
    phone: data?.phone || "",
    project: data?.project || "",
    cohort: data?.cohort || "",
    location: data?.location || "Hyderabad, India",
    github: data?.github || "",
    // New fields as per API request
    designation: data?.designation || "Sr Backend Developer",
    employeeId: data?.id || "9", // Default to 9 as per user request example URL
    attendance: data?.analytics?.attendance ? parseInt(data?.analytics?.attendance) : 96,
    codingScore: data?.analytics?.codingScore || 130,
    profileImage: "profile1.png", // Static as per user request example
    systemName: data?.project || "AJABench System"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    console.log("Submitting Profile Update (PUT):", form);

    const apiPayload = {
      profileImage: form.profileImage,
      name: `${form.firstName} ${form.lastName}`.trim(),
      designation: form.designation,
      systemName: form.project || form.systemName,
      cohort: form.cohort,
      location: form.location,
      email: form.email,
      phone: form.phone,
      employeeId: String(form.employeeId).replace("EMP-", ""),
      attendance: Number(form.attendance),
      codingScore: Number(form.codingScore)
    };

    try {
      // User requested PUT to http://localhost:8081/api/profiles/9
      const targetId = String(data?.id || form.employeeId).replace("EMP-", "");
      
      console.log(`Calling Profile Update API (PUT /profiles/${targetId}) with payload:`, apiPayload);
      const result = await updateProfile(targetId, apiPayload);
      console.log("API Result:", result);

      // Merge original data with form data to keep fields we didn't edit (like id, tasks, etc.)
      const updatedData = {
        ...data,
        ...form,
        firstName: form.firstName,
        lastName: form.lastName,
        id: form.employeeId,
        analytics: {
          ...data?.analytics,
          attendance: `${form.attendance}%`,
          coding: form.codingScore
        }
      };

      if (onSave) {
        onSave(updatedData);
      }

      alert("Profile updated successfully via PUT!");
      navigate('/employee/profile');
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Error updating profile. Check console for details.");
    }
  };

  return (
    <div className="p-6 md:p-8 h-full overflow-y-auto pb-20 w-full text-gray-900">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h2>

        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-gray-100 shadow-lg">
              <img
                src={userAvatar}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://ui-avatars.com/api/?name=User&background=random"; // Fallback
                }}
              />
            </div>
          </div>
        </div>

        {/* ================= FORM ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
          <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
          <Input label="Designation" name="designation" value={form.designation} onChange={handleChange} />
          <Input label="Employee ID" name="employeeId" value={form.employeeId} onChange={handleChange} />
          <Input label="Email" name="email" value={form.email} onChange={handleChange} />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <Input label="Project / System Name" name="project" value={form.project} onChange={handleChange} />
          <Input label="Cohort" name="cohort" value={form.cohort} onChange={handleChange} />
          <Input label="Location" name="location" value={form.location} onChange={handleChange} />
          <Input label="Attendance (%)" name="attendance" value={form.attendance} onChange={handleChange} type="number" />
          <Input label="Coding Score" name="codingScore" value={form.codingScore} onChange={handleChange} type="number" />
          <Input label="GitHub" name="github" value={form.github} onChange={handleChange} />
        </div>

        {/* ================= BUTTONS ================= */}
        <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-100">
          <button
            onClick={() => navigate('/employee/profile')}
            className="px-6 py-2.5 rounded-xl border border-gray-300 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all font-bold"
          >
            Update Profile (PUT)
          </button>
        </div>
      </div>
    </div>
  );
};

// reusable input
const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-gray-800 placeholder:text-gray-500"
      placeholder={`Enter ${label}`}
    />
  </div>
);

export default EditProfile;
