import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Code, CheckCircle, Save, X, ShieldCheck, Loader2 } from "lucide-react";
import { updateProfile } from "../../../api/employeeApi";
import profilePic from "../../../assets/profile-pic.jpg";


const EditProfile = ({ data, onSave, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("EditProfile rendered. Data:", data);
  }, [data]);

  const [firstNameFallback, ...lastNameFallbackParts] = (data?.fullName || data?.name || "").split(" ");
  const lastNameFallback = lastNameFallbackParts.join(" ");

  const [form, setForm] = useState({
    firstName: data?.firstName || (firstNameFallback === "undefined" ? "" : firstNameFallback) || "",
    lastName: data?.lastName || (lastNameFallback === "undefined" ? "" : lastNameFallback) || "",
    email: data?.email || "",
    phone: data?.phone || "",
    project: data?.project || data?.systemName || "",
    cohort: data?.cohort || "",
    location: data?.location || "",
    github: data?.github || "",
    designation: data?.designation || "",
    employeeId: data?.id || data?.employeeId || "",
    attendance: data?.attendance ? parseInt(String(data.attendance).replace('%', '')) : (data?.analytics?.attendance ? parseInt(data?.analytics?.attendance) : 0),
    codingScore: data?.codingScore || data?.analytics?.codingScore || 0,
    profileImage: data?.profilePic || profilePic,
    systemName: data?.project || data?.systemName || "AJABench System"
  });

  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    setShowConfirm(false);
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

      const updatedData = {
        ...data,
        ...form,
        name: `${form.firstName} ${form.lastName}`.trim(),
        systemName: form.systemName,
        firstName: form.firstName,
        lastName: form.lastName,
        id: form.employeeId,
        attendance: form.attendance,
        codingScore: form.codingScore,
        profilePic: form.profileImage,
        analytics: {
          ...data?.analytics,
          attendance: `${form.attendance}%`,
          coding: form.codingScore
        }
      };

      if (onSave) {
        onSave(updatedData);
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/employee/profile");
      }, 2500);

    } catch (error) {
      console.error("Identity Sync Protocol Breach:", error);
      setErrorMsg(`PROTOCOL BREACH: Failed to synchronize identity parameters for Node #${targetId}. Check gateway connectivity.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-gray-900">
      <div className="mx-auto bg-white p-2 rounded-2xl">

        {/* Stats */}
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
          <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-gray-100 shadow-lg">
            <img
              src={form.profileImage && (form.profileImage.startsWith('data:') || form.profileImage.includes('blob:')) ? form.profileImage : profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
          <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
          <Input label="Designation" name="designation" value={form.designation} onChange={handleChange} />
          <Input label="Employee ID" name="employeeId" value={form.employeeId} onChange={handleChange} />
          <Input label="Email" name="email" value={form.email} onChange={handleChange} />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <Input label="Project / System Name" name="systemName" value={form.systemName} onChange={handleChange} />
          <Input label="Cohort" name="cohort" value={form.cohort} onChange={handleChange} />
          <Input label="Location" name="location" value={form.location} onChange={handleChange} />
          <Input label="GitHub" name="github" value={form.github} onChange={handleChange} />
        </div>

        {/* Inline Error */}
        {errorMsg && (
          <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3">
            <p className="text-xs font-black text-rose-700 uppercase tracking-tight">{errorMsg}</p>
            <button onClick={() => setErrorMsg(null)} className="p-1 hover:bg-rose-100 rounded-lg transition-colors">
              <X size={16} className="text-rose-500" />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-100">
          <button
            onClick={() => { if (onClose) onClose(); else navigate("/employee/dashboard"); }}
            className="px-6 py-4 rounded-2xl border-2 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-blue-100/50 hover:bg-blue-700 transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {loading ? "Syncing Parameters..." : "Save Data"}
          </button>
        </div>
      </div>

      {/* ── CONFIRMATION MODAL ── */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="bg-blue-600 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10 scale-150 rotate-12">
                <ShieldCheck size={120} />
              </div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h3 className="font-black text-xl tracking-tight">Confirmation Protocol</h3>
                  <p className="text-[10px] opacity-70 uppercase font-black tracking-[0.2em] mt-1">AJA Identity Sync Request</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <p className="text-slate-700 font-bold text-sm leading-relaxed">
                Are you sure you want to <span className="text-blue-600 font-black">update</span> your profile details? Your changes will be saved successfully.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-4 rounded-2xl border-2 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
                >
                  Abort
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={16} />
                  Confirm Sync
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SUCCESS MODAL ── */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 text-center">
            <div className="bg-emerald-500 p-10 flex flex-col items-center gap-4 relative overflow-hidden">
              <div className="absolute top-2 right-4 opacity-10 rotate-12">
                <CheckCircle size={120} />
              </div>
              <div className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-900/20 animate-bounce">
                <CheckCircle className="text-emerald-500" size={40} />
              </div>
              <div className="relative z-10">
                <h3 className="font-black text-2xl text-white tracking-tight">Handshake Success</h3>
                <p className="text-[10px] text-emerald-100 font-black uppercase tracking-[0.25em] mt-1">AJA Core Repository</p>
              </div>
            </div>
            <div className="p-8">
              <p className="text-slate-700 font-bold text-sm leading-relaxed">
                Identity archive has been{" "}
                <span className="text-emerald-600 font-black">updated and synchronized</span>{" "}
                with the AJA Core Repository.
              </p>
              <div className="mt-6 w-full bg-emerald-50 border border-emerald-100 rounded-2xl py-3 px-5 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Redirecting to Profile Terminal...</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-600 uppercase">{label}</label>
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