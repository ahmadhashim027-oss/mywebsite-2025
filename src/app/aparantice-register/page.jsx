"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    passport: "",
    guardianName: "",
    guardianRelationship: "",
    guardianPhone: "",
    guardianAddress: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ⚠️ Cloudinary upload placeholder
  const handleImageUpload = async (file) => {
    // You will replace this with real Cloudinary logic
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/apprentice/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          age: formData.age,
          gender: formData.gender,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          address: formData.address,
          passport: formData.passport,
          guardian: {
            name: formData.guardianName,
            relationship: formData.guardianRelationship,
            phone: formData.guardianPhone,
            address: formData.guardianAddress,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMessage("Apprentice registered successfully 🎉");
      setFormData({
        fullName: "",
        age: "",
        gender: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        address: "",
        passport: "",
        guardianName: "",
        guardianRelationship: "",
        guardianPhone: "",
        guardianAddress: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-center mb-4 text-light">
        Apprentice Registration Form
      </h2>

      <div className="card shadow p-4">
        <form onSubmit={handleSubmit}>
          <h4 className="fw-bold mb-3">Apprentice Information</h4>

          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="form-control"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Age</label>
              <input
                type="number"
                name="age"
                className="form-control"
                min="10"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                className="form-select"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Choose</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-12 mb-4">
              <label className="form-label">Passport (optional)</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={async (e) => {
                  const url = await handleImageUpload(e.target.files[0]);
                  setFormData({ ...formData, passport: url });
                }}
              />
            </div>
          </div>

          <hr />

          <h4 className="fw-bold mb-3">Guardian Information</h4>

          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                name="guardianName"
                className="form-control"
                placeholder="Guardian Name"
                value={formData.guardianName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                type="text"
                name="guardianRelationship"
                className="form-control"
                placeholder="Relationship"
                value={formData.guardianRelationship}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                type="tel"
                name="guardianPhone"
                className="form-control"
                placeholder="Guardian Phone"
                value={formData.guardianPhone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <input
                type="text"
                name="guardianAddress"
                className="form-control"
                placeholder="Guardian Address"
                value={formData.guardianAddress}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100 fw-bold py-2"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Apprentice"}
          </button>
        </form>
      </div>
    </div>
  );
}
