import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateProfileApi } from "../api/authApi";

const C = {
  navy:   "#1a3a6b",
  blue:   "#2563eb",
  green:  "#16a34a",
  red:    "#dc2626",
  bg:     "#f0f4f8",
  card:   "#ffffff",
  border: "#dce8fb",
  muted:  "#7a8faf",
  body:   "#4a6490",
  font:   "'DM Sans','Segoe UI',sans-serif",
};

export default function CandidateProfilePage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: localStorage.getItem("email") || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    
    if (formData.newPassword && formData.newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters";
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setMessage("");

    try {
      const response = await updateProfileApi(
        formData.name,
        formData.email,
        formData.currentPassword,
        formData.newPassword || undefined
      );
      
      // Update AuthContext with new user info
      login({
        token: response.token,
        name: response.name,
        role: localStorage.getItem("role"),
      });
      
      // Update localStorage with new email
      localStorage.setItem("email", formData.email);
      
      setMessage("Profile updated successfully!");
      setTimeout(() => {
        navigate("/candidate/dashboard");
      }, 1500);
    } catch (err) {
      setMessage(err.message || "Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: "40px 20px", fontFamily: C.font }}>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <button
            onClick={() => navigate("/candidate/dashboard")}
            style={{
              background: "none",
              border: "none",
              color: C.blue,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 20,
              padding: 0,
            }}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: C.navy, margin: "0 0 8px 0" }}>
            Edit Profile
          </h1>
          <p style={{ color: C.muted, margin: 0, fontSize: 14 }}>
            Update your profile information and password
          </p>
        </div>

        {/* Profile Card */}
        <div
          style={{
            background: C.card,
            borderRadius: 16,
            padding: 32,
            border: `1px solid ${C.border}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          {/* Profile Avatar */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                border: `3px solid ${C.blue}`,
                background: "#eaf0fb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                marginBottom: 16,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.5" style={{ width: 44, height: 44 }}>
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.navy }}>
              {formData.name || "User"}
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Student</div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.navy,
                  marginBottom: 8,
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: `1px solid ${errors.name ? C.red : C.border}`,
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: C.font,
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = C.blue)}
                onBlur={(e) => (e.target.style.borderColor = errors.name ? C.red : C.border)}
              />
              {errors.name && <div style={{ fontSize: 12, color: C.red, marginTop: 4 }}>{errors.name}</div>}
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.navy,
                  marginBottom: 8,
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: `1px solid ${errors.email ? C.red : C.border}`,
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: C.font,
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = C.blue)}
                onBlur={(e) => (e.target.style.borderColor = errors.email ? C.red : C.border)}
              />
              {errors.email && <div style={{ fontSize: 12, color: C.red, marginTop: 4 }}>{errors.email}</div>}
            </div>

            {/* Divider */}
            <div style={{ borderTop: `1px solid ${C.border}`, margin: "24px 0" }}></div>

            {/* Current Password Field */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.navy,
                  marginBottom: 8,
                }}
              >
                Current Password *
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                placeholder="Enter current password"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: `1px solid ${errors.currentPassword ? C.red : C.border}`,
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: C.font,
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = C.blue)}
                onBlur={(e) => (e.target.style.borderColor = errors.currentPassword ? C.red : C.border)}
              />
              {errors.currentPassword && <div style={{ fontSize: 12, color: C.red, marginTop: 4 }}>{errors.currentPassword}</div>}
            </div>

            {/* New Password Field */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.navy,
                  marginBottom: 8,
                }}
              >
                New Password (Optional)
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: `1px solid ${errors.newPassword ? C.red : C.border}`,
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: C.font,
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = C.blue)}
                onBlur={(e) => (e.target.style.borderColor = errors.newPassword ? C.red : C.border)}
              />
              {errors.newPassword && <div style={{ fontSize: 12, color: C.red, marginTop: 4 }}>{errors.newPassword}</div>}
            </div>

            {/* Confirm Password Field */}
            {formData.newPassword && (
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.navy,
                    marginBottom: 8,
                  }}
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: `1px solid ${errors.confirmPassword ? C.red : C.border}`,
                    borderRadius: 8,
                    fontSize: 14,
                    fontFamily: C.font,
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = C.blue)}
                  onBlur={(e) => (e.target.style.borderColor = errors.confirmPassword ? C.red : C.border)}
                />
                {errors.confirmPassword && <div style={{ fontSize: 12, color: C.red, marginTop: 4 }}>{errors.confirmPassword}</div>}
              </div>
            )}

            {/* Message */}
            {message && (
              <div
                style={{
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 20,
                  fontSize: 13,
                  fontWeight: 500,
                  background: message.includes("Error") ? "#fecaca" : "#d1fae5",
                  color: message.includes("Error") ? C.red : C.green,
                }}
              >
                {message}
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="button"
                onClick={() => navigate("/candidate/dashboard")}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  background: C.card,
                  color: C.body,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = C.bg;
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = C.card;
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: "none",
                  borderRadius: 8,
                  background: loading ? "#cbd5e1" : C.blue,
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.target.style.background = "#1d4ed8";
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.target.style.background = C.blue;
                }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: "#eaf0fb",
            borderRadius: 8,
            border: `1px solid ${C.border}`,
          }}
        >
          <div style={{ fontSize: 13, color: C.body, lineHeight: 1.6 }}>
            <strong>Note:</strong> You must provide your current password to save any changes. This ensures your account security.
          </div>
        </div>
      </div>
    </div>
  );
}
