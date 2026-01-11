"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ApprenticeSelectSkill() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skill, setSkill] = useState("");

  // Get apprentice data from localStorage
  const apprenticeData = JSON.parse(localStorage.getItem("apprenticeData"));

  useEffect(() => {
    if (!apprenticeData) {
      router.replace("/"); // redirect if not logged in
    } else if (apprenticeData.skill && apprenticeData.approved) {
      // Already selected skill and approved → go to dashboard
      router.replace("/apprentice-dashboard");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!skill) return setError("Please select a skill");

    setLoading(true);
    try {
      const res = await fetch("/api/apprentice/select-skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apprenticeId: apprenticeData.id,
          skill,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit skill");
      }

      alert(
        "Skill selection submitted! Admin approval is required before dashboard access."
      );
      router.replace("/apparantice-dashboard"); // Redirect back to login page
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
                  <option>Sewing</option>
                  <option>Cutting</option>
                  <option>Ironing</option>
                  <option>Packaging</option>
                  <option>Fashion Design (General)</option>
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
