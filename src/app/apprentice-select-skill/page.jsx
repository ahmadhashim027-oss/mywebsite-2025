"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ApprenticeSelectSkill() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skill, setSkill] = useState("");
  const [apprenticeData, setApprenticeData] = useState(null);

  // 🔒 Load apprentice safely from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("apprenticeData");

    if (!stored) {
      router.replace("/apprentice-login");
      return;
    }

    const parsed = JSON.parse(stored);

    // If already approved → dashboard
    if (parsed.skill && parsed.approved === true) {
      router.replace("/apprentice-dashboard");
      return;
    }

    setApprenticeData(parsed);
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!skill) {
      setError("Please select a skill");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/apprentice/select-skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // ✅ FIX: support id OR _id
          apprenticeId: apprenticeData.id || apprenticeData._id,
          skill,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit skill");
      }

      alert("Skill submitted successfully! Please wait for admin approval.");

      router.replace("/apprentice-login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Prevent rendering until data is ready
  if (!apprenticeData) return null;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="text-center fw-bold mb-4">
              Select Your Preferred Skill
            </h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Skill Interested In</label>
                <select
                  className="form-select"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  required
                >
                  <option value="">Select a skill</option>
                  <option value="Sewing">Sewing</option>
                  <option value="Cutting">Cutting</option>
                  <option value="Ironing">Ironing</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Fashion Design (General)">
                    Fashion Design (General)
                  </option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-dark w-100 fw-bold py-2"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Skill"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
