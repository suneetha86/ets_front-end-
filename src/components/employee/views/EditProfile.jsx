import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userAvatar from "../../../assets/chinnu.jpeg";

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
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Updated:", form);

    // Merge original data with form data to keep fields we didn't edit (like id, tasks, etc.)
    const updatedData = { ...data, ...form };

    if (onSave) {
      onSave(updatedData);
    }

    navigate('/employee/profile');
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
          <Input label="Email" name="email" value={form.email} onChange={handleChange} />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <Input label="Project" name="project" value={form.project} onChange={handleChange} />
          <Input label="Cohort" name="cohort" value={form.cohort} onChange={handleChange} />
          <Input label="Location" name="location" value={form.location} onChange={handleChange} />
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
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// reusable input
const Input = ({ label, name, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-gray-800 placeholder:text-gray-500"
      placeholder={`Enter ${label}`}
    />
  </div>
);

export default EditProfile;
