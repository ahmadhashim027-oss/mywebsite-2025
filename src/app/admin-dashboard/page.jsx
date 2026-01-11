"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import ContactList from "@/Components/AdminComponents/ContactList";
import ApparenticeList from "@/Components/AdminComponents/ApparenticeList";
import FeedbackList from "@/Components/AdminComponents/FeedbackList";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeView, setActiveView] = useState("Apparentice");
  const [unreadFeedbackCount, setUnreadFeedbackCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch unread feedback count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch("/api/admin/feedback/list");
        const data = await res.json();
        if (data.success) {
          setUnreadFeedbackCount(data.unviewedCount || 0);
        }
      } catch (error) {
        console.error("Error fetching unread count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnreadCount();

    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  /* 🚪 LOGOUT */
  const handleLogout = () => {
    // Clear any admin session data
    localStorage.removeItem("adminData");
    sessionStorage.removeItem("adminData");
    router.replace("/admin-login");
  };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* SIDEBAR */}
        <aside className="col-md-3 col-lg-2 bg-dark text-white p-4">
          <div className="d-flex flex-column h-100">
            <div className="mb-4">
              <h4 className="mb-3">Admin Panel</h4>
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-light text-dark d-flex align-items-center justify-content-center me-3"
                  style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-person-fill"></i>
                </div>
                <div>
                  <p className="mb-0 fw-semibold">Administrator</p>
                  <small className="text-light-emphasis">Admin User</small>
                </div>
              </div>
            </div>

            <ul className="nav flex-column gap-2 flex-grow-1">
              <li
                className={`nav-link text-white rounded ${activeView === "Apparentice" ? "bg-primary fw-bold" : ""}`}
                onClick={() => setActiveView("Apparentice")}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-people me-2"></i>
                Apprentice
              </li>

              <li
                className={`nav-link text-white rounded ${activeView === "Feedback" ? "bg-primary fw-bold" : ""}`}
                onClick={() => setActiveView("Feedback")}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-chat-left-text me-2"></i>
                Feedback
                {unreadFeedbackCount > 0 && (
                  <span className="badge bg-warning ms-2">{unreadFeedbackCount}</span>
                )}
                {unreadFeedbackCount === 0 && !loading && (
                  <span className="badge bg-secondary ms-2">0</span>
                )}
              </li>

              <li
                className={`nav-link text-white rounded ${activeView === "Contact" ? "bg-primary fw-bold" : ""}`}
                onClick={() => setActiveView("Contact")}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-envelope me-2"></i>
                Contact
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

        {/* MAIN CONTENT */}
        <main className="col-md-9 col-lg-10 p-4 bg-light">
          {activeView === "Apparentice" && <ApparenticeList />}
          {activeView === "Feedback" && <FeedbackList />}
          {activeView === "Contact" && <ContactList />}
        </main>
      </div>
    </div>
  );
}