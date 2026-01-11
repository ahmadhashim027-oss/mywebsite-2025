"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import ProfileView from "@/Components/ApparanticeComponents/ProfileView";
import TaskView from "@/Components/ApparanticeComponents/TaskView";

/* ---------------- Main Dashboard ---------------- */
export default function ApprenticeDashboard() {
  const router = useRouter();
  const [activeView, setActiveView] = useState("Profile");
  const [apprentice, setApprentice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("apprenticeData");
    router.replace("/apparentice-login");
  };

  // Calculate pending tasks count safely using useMemo
  const pendingTasksCount = useMemo(() => {
    if (!apprentice || !Array.isArray(apprentice.tasks)) return 0;
    return apprentice.tasks.filter(t => t.status !== 'completed').length;
  }, [apprentice]);

  useEffect(() => {
    const fetchApprentice = async () => {
      const localData = JSON.parse(localStorage.getItem("apprenticeData"));
      if (!localData || !localData.email) {
        router.replace("/apprentice-login");
        return;
      }

      try {
        // Fetch the latest apprentice data from backend by email
        const res = await fetch(
          `/api/apprentice/get-by?email=${encodeURIComponent(localData.email)}`
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to fetch apprentice: ${res.status}`);
        }

        const data = await res.json();
        const updatedApprentice = data.apprentice;

        if (!updatedApprentice) {
          throw new Error("No apprentice data returned");
        }

        if (!updatedApprentice.skill) {
          router.replace("/apprentice-select-skill");
          return;
        }

        if (!updatedApprentice.approved) {
          setError("Your skill selection is pending admin approval. Please check back later.");
          return;
        }

        // Save updated data locally
        localStorage.setItem(
          "apprenticeData",
          JSON.stringify(updatedApprentice)
        );
        setApprentice(updatedApprentice);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchApprentice();
  }, [router]);

  // Handle loading state
  if (loading) {
    return (
      <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Loading your dashboard...</h5>
          <p className="text-muted">Please wait while we fetch your information</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="alert alert-danger" style={{ maxWidth: '500px' }}>
            <h5 className="alert-heading">Error</h5>
            <p>{error}</p>
            <hr />
            <div className="d-flex justify-content-center gap-2">
              <button
                className="btn btn-outline-danger"
                onClick={() => {
                  localStorage.removeItem("apprenticeData");
                  router.replace("/apprentice-login");
                }}
              >
                Logout
              </button>
              <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where apprentice is null after loading
  if (!apprentice) {
    return (
      <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="alert alert-warning" style={{ maxWidth: '500px' }}>
            <h5>Unable to load dashboard</h5>
            <p>No apprentice data available</p>
            <button
              className="btn btn-primary mt-2"
              onClick={() => {
                localStorage.removeItem("apprenticeData");
                router.replace("/apprentice-login");
              }}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* ---------------- SIDEBAR ---------------- */}
        <aside className="col-md-3 col-lg-2 bg-dark text-white p-0">
          <div className="d-flex flex-column h-100 p-4">
            <div className="mb-4">
              <h4 className="fw-bold mb-3">Apprentice Panel</h4>
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle bg-light text-dark d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-person-fill"></i>
                </div>
                <div>
                  <p className="mb-0 fw-semibold">
                    {apprentice.fullName?.split(' ')[0] || 'User'}
                  </p>
                  <small className="text-light-emphasis">
                    {apprentice.skill || 'No skill'}
                  </small>
                </div>
              </div>
            </div>

            <ul className="nav flex-column gap-2 flex-grow-1">
              <li
                className={`nav-link text-white rounded ${activeView === "Profile" ? "bg-primary fw-bold" : ""}`}
                onClick={() => setActiveView("Profile")}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-person me-2"></i>
                Profile
              </li>

              <li
                className={`nav-link text-white rounded ${activeView === "Tasks" ? "bg-primary fw-bold" : ""}`}
                onClick={() => setActiveView("Tasks")}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-clipboard-check me-2"></i>
                Tasks
                {pendingTasksCount > 0 && (
                  <span className="badge bg-light text-dark ms-2">
                    {pendingTasksCount}
                  </span>
                )}
              </li>
            </ul>

            <div className="mt-auto pt-4 border-top border-secondary">
              <div
                className="nav-link text-danger rounded"
                onClick={handleLogout}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </div>
            </div>
          </div>
        </aside>

        {/* ---------------- MAIN CONTENT ---------------- */}
        <main className="col-md-9 col-lg-10 p-4 bg-light">
          {activeView === "Profile" && <ProfileView apprentice={apprentice} />}
          {activeView === "Tasks" && <TaskView apprentice={apprentice} />}
        </main>
      </div>
    </div>
  );
}