"use client";

import React, { useState, useEffect } from "react";

export default function ApparenticeList() {
  const [apprentices, setApprentices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApprentice, setSelectedApprentice] = useState(null);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    adminNotes: ""
  });
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    fetchApprentices();
  }, []);

  const fetchApprentices = async () => {
    try {
      console.log("🔄 Fetching apprentices...");
      // Assuming this is the public signup list endpoint
      const res = await fetch("/api/apprentice/signup");

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const data = await res.json();
      console.log("📊 Apprentices data:", data);

      if (data.success && data.apprentices) {
        setApprentices(data.apprentices);
      } else if (data.apprentices) {
        setApprentices(data.apprentices);
      }
    } catch (error) {
      console.error("❌ Error fetching apprentices:", error);
      alert("Failed to load apprentices. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!id) {
      alert("❌ No apprentice ID provided");
      return;
    }

    setApprovingId(id);

    try {
      console.log(`✅ Attempting to approve apprentice ID: ${id}`);

      // ✅ FIXED: Updated path to include '/admin'
      const response = await fetch("/api/admin/apprentice/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          apprenticeId: id,
          approved: true
        }),
      });

      console.log("📨 Response status:", response.status);

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("❌ Non-JSON response:", text.substring(0, 200));
        throw new Error(`Server returned HTML (likely 404). Check if API route exists.`);
      }

      const data = await response.json();
      console.log("📄 Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.success) {
        alert(`✅ ${data.message || "Apprentice approved successfully!"}`);

        setApprentices(prev =>
          prev.map(app =>
            app._id === id
              ? { ...app, approved: true, approvedAt: new Date() }
              : app
          )
        );

        setTimeout(() => fetchApprentices(), 500);
      } else {
        alert(`❌ ${data.message || "Failed to approve apprentice"}`);
      }

    } catch (error) {
      console.error("❌ Error approving apprentice:", error);
      alert(`Error: ${error.message}`);

      if (error.message.includes("404") || error.message.includes("HTML")) {
        console.warn("⚠️ API endpoint might not exist. Testing...");
        testApiEndpoint();
      }
    } finally {
      setApprovingId(null);
    }
  };

  // Diagnostic function to test API endpoint
  const testApiEndpoint = async () => {
    try {
      console.log("🔍 Testing API endpoint...");
      // ✅ FIXED: Updated path to include '/admin'
      const testRes = await fetch("/api/admin/apprentice/approve", {
        method: "GET",
        headers: { "Accept": "application/json" }
      });
      console.log("🔍 Test response status:", testRes.status);
      const text = await testRes.text();
      console.log("🔍 Test response (first 500 chars):", text.substring(0, 500));

      if (testRes.status === 404) {
        alert("⚠️ API endpoint not found. Please ensure the file is at: app/api/admin/apprentice/approve/route.js");
      }
    } catch (err) {
      console.error("🔍 Test failed:", err);
    }
  };

  const handleReject = async (id) => {
    if (!confirm("Are you sure you want to reject this apprentice?")) {
      return;
    }

    try {
      // ✅ FIXED: Updated path to include '/admin'
      const response = await fetch("/api/admin/apprentice/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apprenticeId: id,
          approved: false
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ ${data.message}`);
        fetchApprentices();
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Error rejecting apprentice:", error);
      alert("Failed to reject apprentice");
    }
  };

  const handleOpenAssignTask = (apprentice) => {
    if (!apprentice.approved) {
      alert("Please approve the apprentice before assigning tasks.");
      return;
    }

    setSelectedApprentice(apprentice);
    setTaskForm({
      title: "",
      description: "",
      dueDate: "",
      adminNotes: ""
    });
    setShowAssignTaskModal(true);
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!selectedApprentice) return;

    try {
      const res = await fetch("/api/admin/assign-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apprenticeId: selectedApprentice._id,
          ...taskForm
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Task assigned successfully!");
        setShowAssignTaskModal(false);
        fetchApprentices();
      } else {
        alert(`❌ ${data.message || "Failed to assign task"}`);
      }
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Failed to assign task");
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading apprentices...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Apprentice List</h2>
        <button
          className="btn btn-outline-primary"
          onClick={() => fetchApprentices()}
        >
          Refresh List
        </button>
      </div>

      {apprentices.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          No apprentices found.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Skill</th>
                <th>Status</th>
                <th>Tasks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apprentices.map((apprentice) => (
                <tr key={apprentice._id}>
                  <td>
                    <strong>{apprentice.fullName}</strong>
                    <div className="small text-muted">Age: {apprentice.age}</div>
                  </td>
                  <td>{apprentice.email}</td>
                  <td>{apprentice.phone}</td>
                  <td>
                    <span className={`badge ${apprentice.skill ? 'bg-info' : 'bg-secondary'}`}>
                      {apprentice.skill || "Not selected"}
                    </span>
                  </td>
                  <td>
                    {apprentice.approved ? (
                      <span className="badge bg-success">
                        <i className="bi bi-check-circle me-1"></i>
                        Approved
                      </span>
                    ) : (
                      <span className="badge bg-warning text-dark">
                        <i className="bi bi-clock me-1"></i>
                        Pending
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="badge bg-secondary">
                      {apprentice.tasks?.length || 0} tasks
                    </span>
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      {!apprentice.approved ? (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleApprove(apprentice._id)}
                            disabled={approvingId === apprentice._id}
                          >
                            {approvingId === apprentice._id ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-1"></span>
                                Approving...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-check-circle me-1"></i>
                                Approve
                              </>
                            )}
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleReject(apprentice._id)}
                          >
                            <i className="bi bi-x-circle me-1"></i>
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleOpenAssignTask(apprentice)}
                          disabled={!apprentice.skill}
                          title={!apprentice.skill ? "No skill selected by apprentice" : ""}
                        >
                          <i className="bi bi-plus-circle me-1"></i>
                          Assign Task
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      
      {/* Assign Task Modal */}
      {showAssignTaskModal && selectedApprentice && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-plus-circle me-2"></i>
                  Assign Task to {selectedApprentice.fullName}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAssignTaskModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleAssignTask}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Task Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={taskForm.title}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, title: e.target.value })
                      }
                      required
                      placeholder="e.g., Create login page"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description *</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={taskForm.description}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, description: e.target.value })
                      }
                      required
                      placeholder="Detailed description of the task..."
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Due Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={taskForm.dueDate}
                          onChange={(e) =>
                            setTaskForm({ ...taskForm, dueDate: e.target.value })
                          }
                        />
                        <small className="text-muted">Optional</small>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Skill Required</label>
                        <input
                          type="text"
                          className="form-control"
                          value={selectedApprentice.skill || 'Not specified'}
                          readOnly
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Admin Notes</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={taskForm.adminNotes}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, adminNotes: e.target.value })
                      }
                      placeholder="Optional notes for your reference..."
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAssignTaskModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-send me-1"></i>
                    Assign Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}