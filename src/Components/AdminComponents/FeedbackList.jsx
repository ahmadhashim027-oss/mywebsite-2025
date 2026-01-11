"use client";

import React, { useState, useEffect } from "react";

export default function FeedbackList() {
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [adminResponse, setAdminResponse] = useState("");
    const [filter, setFilter] = useState("all"); // all, unviewed, viewed, responded

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            const res = await fetch("/api/admin/feedback/list");
            const data = await res.json();
            if (data.success) {
                setFeedbackList(data.feedbackList);
            }
        } catch (error) {
            console.error("Error fetching feedback:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsViewed = async (apprenticeId, taskIndex) => {
        try {
            const res = await fetch("/api/admin/feedback/mark-viewed", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ apprenticeId, taskIndex }),
            });

            const data = await res.json();
            if (data.success) {
                // Update local state
                const updatedList = feedbackList.map(feedback => {
                    if (feedback.apprenticeId === apprenticeId && feedback.taskIndex === taskIndex) {
                        return { ...feedback, adminViewed: true, adminViewedAt: new Date() };
                    }
                    return feedback;
                });

                setFeedbackList(updatedList);
            }
        } catch (error) {
            console.error("Error marking as viewed:", error);
        }
    };

    const handleRespond = (feedback) => {
        setSelectedFeedback(feedback);
        setAdminResponse("");
        setShowResponseModal(true);
    };

    const submitResponse = async () => {
        if (!selectedFeedback || !adminResponse.trim()) {
            alert("Please enter a response");
            return;
        }

        try {
            const res = await fetch("/api/admin/feedback/respond", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    apprenticeId: selectedFeedback.apprenticeId,
                    taskIndex: selectedFeedback.taskIndex,
                    adminResponse: adminResponse.trim()
                }),
            });

            const data = await res.json();
            if (data.success) {
                // Update local state
                const updatedList = feedbackList.map(feedback => {
                    if (feedback.apprenticeId === selectedFeedback.apprenticeId &&
                        feedback.taskIndex === selectedFeedback.taskIndex) {
                        return {
                            ...feedback,
                            adminResponse: adminResponse.trim(),
                            adminRespondedAt: new Date(),
                            adminViewed: true,
                            adminViewedAt: new Date()
                        };
                    }
                    return feedback;
                });

                setFeedbackList(updatedList);
                setShowResponseModal(false);
                alert("Response sent successfully!");
            }
        } catch (error) {
            console.error("Error submitting response:", error);
            alert("Failed to send response");
        }
    };

    const filteredFeedback = feedbackList.filter(feedback => {
        if (filter === "unviewed") return !feedback.adminViewed;
        if (filter === "viewed") return feedback.adminViewed && !feedback.adminResponse;
        if (filter === "responded") return feedback.adminResponse;
        return true; // all
    });

    if (loading) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading feedback...</span>
                </div>
                <p className="mt-2">Loading apprentice feedback...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-2">Apprentice Feedback</h2>
                    <p className="text-muted mb-0">
                        {feedbackList.filter(f => !f.adminViewed).length} unread feedback
                    </p>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <div className="btn-group" role="group">
                        <button
                            className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setFilter("all")}
                        >
                            All ({feedbackList.length})
                        </button>
                        <button
                            className={`btn btn-sm ${filter === "unviewed" ? "btn-warning" : "btn-outline-warning"}`}
                            onClick={() => setFilter("unviewed")}
                        >
                            Unread ({feedbackList.filter(f => !f.adminViewed).length})
                        </button>
                        <button
                            className={`btn btn-sm ${filter === "responded" ? "btn-success" : "btn-outline-success"}`}
                            onClick={() => setFilter("responded")}
                        >
                            Responded ({feedbackList.filter(f => f.adminResponse).length})
                        </button>
                    </div>

                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={fetchFeedback}
                    >
                        <i className="bi bi-arrow-clockwise"></i> Refresh
                    </button>
                </div>
            </div>

            {filteredFeedback.length === 0 ? (
                <div className="card shadow-sm">
                    <div className="card-body text-center py-5">
                        <i className="bi bi-chat-left-text display-1 text-muted mb-3"></i>
                        <h5 className="text-muted">No feedback found</h5>
                        <p className="text-muted">
                            {filter === "all"
                                ? "No apprentices have submitted feedback yet."
                                : `No ${filter} feedback available.`}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="row g-4">
                    {filteredFeedback.map((feedback, index) => (
                        <div className="col-md-6 col-lg-4" key={`${feedback.apprenticeId}-${feedback.taskIndex}`}>
                            <div className={`card h-100 shadow-sm ${!feedback.adminViewed ? 'border-warning' : feedback.adminResponse ? 'border-success' : ''}`}>
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-0">{feedback.taskTitle}</h6>
                                        <small className="text-muted">
                                            {new Date(feedback.feedbackSubmittedAt).toLocaleDateString()}
                                        </small>
                                    </div>
                                    <div>
                                        {!feedback.adminViewed && (
                                            <span className="badge bg-warning">New</span>
                                        )}
                                        {feedback.adminResponse && (
                                            <span className="badge bg-success ms-1">Responded</span>
                                        )}
                                    </div>
                                </div>

                                <div className="card-body">
                                    <div className="mb-3">
                                        <h6 className="text-muted mb-1">Apprentice</h6>
                                        <p className="mb-1 fw-semibold">{feedback.apprenticeName}</p>
                                        <small className="text-muted d-block">{feedback.apprenticeEmail}</small>
                                        <small className="badge bg-info">{feedback.apprenticeSkill}</small>
                                    </div>

                                    <div className="mb-3">
                                        <h6 className="text-muted mb-1">Task Description</h6>
                                        <p className="mb-0 small">{feedback.taskDescription}</p>
                                    </div>

                                    <div className="mb-3">
                                        <h6 className="text-muted mb-1">Feedback</h6>
                                        <div className="alert alert-light border">
                                            <p className="mb-0">{feedback.feedback}</p>
                                        </div>
                                        <small className="text-muted">
                                            Submitted: {new Date(feedback.feedbackSubmittedAt).toLocaleString()}
                                        </small>
                                    </div>

                                    {feedback.adminResponse && (
                                        <div className="mb-3">
                                            <h6 className="text-muted mb-1">Your Response</h6>
                                            <div className="alert alert-success">
                                                <p className="mb-0">{feedback.adminResponse}</p>
                                            </div>
                                            <small className="text-muted">
                                                Responded: {new Date(feedback.adminRespondedAt).toLocaleString()}
                                            </small>
                                        </div>
                                    )}
                                </div>

                                <div className="card-footer bg-transparent">
                                    <div className="d-flex justify-content-between">
                                        {!feedback.adminViewed ? (
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => markAsViewed(feedback.apprenticeId, feedback.taskIndex)}
                                            >
                                                <i className="bi bi-check-circle me-1"></i>
                                                Mark as Read
                                            </button>
                                        ) : (
                                            <small className="text-muted">
                                                Viewed: {feedback.adminViewedAt ? new Date(feedback.adminViewedAt).toLocaleDateString() : 'N/A'}
                                            </small>
                                        )}

                                        {!feedback.adminResponse && (
                                            <button
                                                className="btn btn-sm btn-outline-success"
                                                onClick={() => handleRespond(feedback)}
                                            >
                                                <i className="bi bi-reply me-1"></i>
                                                Respond
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Response Modal */}
            {showResponseModal && selectedFeedback && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Respond to {selectedFeedback.apprenticeName}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowResponseModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Apprentice Feedback</label>
                                    <div className="alert alert-light border">
                                        <p className="mb-0">{selectedFeedback.feedback}</p>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Your Response *</label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        value={adminResponse}
                                        onChange={(e) => setAdminResponse(e.target.value)}
                                        placeholder="Enter your response to the apprentice's feedback..."
                                        required
                                    />
                                    <small className="text-muted">
                                        This response will be visible to the apprentice.
                                    </small>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowResponseModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={submitResponse}
                                    disabled={!adminResponse.trim()}
                                >
                                    Send Response
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}