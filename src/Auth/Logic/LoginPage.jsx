
// src/components/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useAuthStore } from "../Store/AuthStore";
import LoginForm from "../Ui/LoginForm";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login, loading, error } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const navigate = useNavigate();

  // ✅ Show toast if error changes
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required!";
    if (!formData.password) newErrors.password = "Password is required!";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    const success = await login(formData.email, formData.password);

    if (success) {
      toast.success("Login successful!");
      navigate("/dashboard");
    } else {
      // 
      toast.error("Invalid email or password!");
    }
  } catch (err) {
    console.log("Login error:", err);
    toast.error("Something went wrong!");
  }
};


  return (
    <LoginForm
      formData={formData}
      errors={errors}
      showPassword={showPassword}
      isSubmitting={loading}
      focusedField={focusedField}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      togglePassword={() => setShowPassword(!showPassword)}
      setFocusedField={setFocusedField}
    />
  );
}
