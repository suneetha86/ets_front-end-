import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import userAvatar from "../../../assets/chinnu.jpeg";
import { Code, CheckCircle, Save, X, User, ShieldCheck } from "lucide-react";
import { updateProfile } from "../../../api/employeeApi";


const EditProfile = ({ data, onSave }) => {
  const navigate = useNavigate();
  const userId = data?.id || 1; // fallback if id not present

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

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

    const handleSubmit = async () => {
        if (!window.confirm("CONFIRMATION PROTOCOL: Synchronize modified identity parameters with the core repository?")) return;
        
        setLoading(true);
        const targetId = String(data?.id || form.employeeId).replace("EMP-", "");

        const apiPayload = {
            profileImage: form.profileImage,
            name: `${form.firstName} ${form.lastName}`.trim(),
            designation: form.designation,
            systemName: form.systemName,
            cohort: form.cohort,
            location: form.location,
            email: form.email,
            phone: form.phone,
            employeeId: String(form.employeeId),
            attendance: Number(form.attendance),
            codingScore: Number(form.codingScore)
        };

        try {
            console.log(`Executing Profile Sync (PUT /profiles/${targetId}):`, apiPayload);
            const result = await updateProfile(targetId, apiPayload);

      console.log("API Result:", result);

      // Merge original data with form data to keep fields we didn't edit
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

            alert("Handshake Success: Identity archive has been updated and synchronized.");
            navigate("/employee/profile");

    } catch (error) {
      console.error("Identity Sync Protocol Breach:", error);
      alert(
        `PROTOCOL BREACH: Failed to synchronize identity parameters for Node #${targetId}. Check gateway connectivity.`
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full text-gray-900">
      <div className="mx-auto bg-white p-2 rounded-2xl">
        {/* Modal Stats Theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Attendance Status</label>
                    <input 
                        type="number" 
                        name="attendance" 
                        value={form.attendance} 
                        onChange={handleChange}
                        className="bg-transparent text-2xl font-black text-blue-700 w-24 outline-none"
                    />
                </div>
                <div className="bg-blue-600/10 p-2 rounded-lg">
                    <CheckCircle className="text-blue-600" size={20} />
                </div>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">AJA Coding Score</label>
                    <input 
                        type="number" 
                        name="codingScore" 
                        value={form.codingScore} 
                        onChange={handleChange}
                        className="bg-transparent text-2xl font-black text-indigo-700 w-24 outline-none"
                    />
                </div>
                <div className="bg-indigo-600/10 p-2 rounded-lg">
                    <Code className="text-indigo-600" size={20} />
                </div>
            </div>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-gray-100 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1587&auto=format&fit=crop"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* FORM */}
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
          <Input label="GitHub" name="github" value={form.github} onChange={handleChange} />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-100">
          <button
            onClick={() => navigate("/employee/profile")}
            className="px-6 py-2.5 rounded-xl border border-gray-300 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {loading ? "Syncing Parameters..." : "Push Modifications (PUT)"}
          </button>

        </div>
      </div>
    </div>
  );
};

// reusable input
const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-600 uppercase">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl"
      placeholder={`Enter ${label}`}
    />
  </div>
);

export default EditProfile;