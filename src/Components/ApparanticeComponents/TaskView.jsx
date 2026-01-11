"use client";

import React, { useState, useEffect } from "react";

export default function TaskView({ apprentice }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [apiError, setApiError] = useState(null);

    useEffect(() => {
        if (apprentice && Array.isArray(apprentice.tasks)) {
            setTasks(apprentice.tasks);
        }
        setLoading(false);
    }, [apprentice]);

    const updateTaskStatus = async (taskIndex, newStatus) => {
        if (!apprentice || !apprentice._id) {
            alert("Apprentice data not available");
            return;
        }

        setUpdating(true);
        setApiError(null);

        try {
            const res = await fetch("/api/apprentice/update-task", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    apprenticeId: apprentice._id,
                    taskIndex,
                    status: newStatus,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to update task: ${res.status}`);
            }

            const data = await res.json();
            if (data.success) {
                // Update local state
                const updatedTasks = [...tasks];
                updatedTasks[taskIndex].status = newStatus;
                setTasks(updatedTasks);

                // Also update the apprentice data in localStorage
                const updatedApprentice = { ...apprentice, tasks: updatedTasks };
                localStorage.setItem("apprenticeData", JSON.stringify(updatedApprentice));
            }
        } catch (error) {
            console.error("Error updating task:", error);
            setApiError(error.message);
        } finally {
            setUpdating(false);
        }
    };

    const submitTaskFeedback = async (taskIndex) => {
        if (!apprentice || !apprentice._id) {
            alert("Apprentice data not available");
            return;
        }

        const feedback = prompt("Please provide feedback or completion notes:");
        if (feedback && feedback.trim()) {
            setUpdating(true);
            setApiError(null);

            try {
                const res = await fetch("/api/apprentice/submit-feedback", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        apprenticeId: apprentice._id,
                        taskIndex,
                        feedback: feedback.trim(),
                        status: 'completed'
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.message || `Failed to submit feedback: ${res.status}`);
                }

                const data = await res.json();
                if (data.success) {
                    // Update local state
                    const updatedTasks = [...tasks];
                    updatedTasks[taskIndex].status = 'completed';
                    updatedTasks[taskIndex].feedback = feedback.trim();
                    updatedTasks[taskIndex].completedAt = new Date();
                    setTasks(updatedTasks);

                    // Update localStorage
                    const updatedApprentice = { ...apprentice, tasks: updatedTasks };
                    localStorage.setItem("apprenticeData", JSON.stringify(updatedApprentice));
                    alert("Task completed with feedback!");
                }
            } catch (error) {
                console.error("Error submitting feedback:", error);
                setApiError(error.message);
                alert("Failed to submit feedback: " + error.message);
            } finally {
                setUpdating(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading tasks...</span>
                </div>
                <p className="mt-2">Loading your tasks...</p>
            </div>
        );
    }

    if (!apprentice) {
        return (
            <div>
                <h3 className="fw-bold mb-3">Your Tasks</h3>
                <div className="alert alert-warning">
                    No apprentice data available. Please refresh the page.
                </div>
            </div>
        );
    }

    if (apiError) {
        return (
            <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold mb-0">Your Tasks</h3>
                    <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setApiError(null)}
                    >
                        Retry
                    </button>
                </div>
                <div className="alert alert-danger">
                    <h5>Error</h5>
                    <p>{apiError}</p>
                </div>
            </div>
        );
    }

    if (!tasks || tasks.length === 0) {
        return (
            <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold mb-0">Your Tasks</h3>
                    <span className="badge bg-secondary">0 tasks</span>
                </div>
                <div className="card shadow-sm">
                    <div className="card-body text-center py-5">
                        <i className="bi bi-clipboard-check display-1 text-muted mb-3"></i>
                        <h5 className="text-muted">No tasks assigned yet</h5>
                        <p className="text-muted">Your admin will assign tasks based on your selected skill: <strong>{apprentice?.skill}</strong></p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Your Tasks</h3>
                <span className="badge bg-primary">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="row g-4">
                {tasks.map((task, index) => (
                    <div className="col-lg-6" key={index}>
                        <div className={`card h-100 shadow-sm border-${task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'warning' : 'secondary'}`}>
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="mb-0">{task.title}</h5>
                                    <small className="text-muted">Assigned: {new Date(task.assignedDate).toLocaleDateString()}</small>
                                </div>
                                <span className={`badge ${task.status === 'completed' ? 'bg-success' :
                                    task.status === 'in-progress' ? 'bg-warning' :
                                        'bg-secondary'} ${updating ? 'opacity-50' : ''}`}>
                                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                </span>
                            </div>

                            <div className="card-body">
                                <div className="mb-3">
                                    <h6 className="text-muted mb-2">Description</h6>
                                    <p className="mb-0">{task.description}</p>
                                </div>

                                <div className="row mb-3">
                                    {task.dueDate && (
                                        <div className="col-md-6">
                                            <h6 className="text-muted mb-2">Due Date</h6>
                                            <p className={`mb-0 ${new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-danger' : ''}`}>
                                                <i className="bi bi-calendar-check me-2"></i>
                                                {new Date(task.dueDate).toLocaleDateString()}
                                                {new Date(task.dueDate) < new Date() && task.status !== 'completed' && ' (Overdue)'}
                                            </p>
                                        </div>
                                    )}
                                    <div className="col-md-6">
                                        <h6 className="text-muted mb-2">Skill Required</h6>
                                        <p className="mb-0">
                                            <i className="bi bi-tools me-2"></i>
                                            {apprentice?.skill}
                                        </p>
                                    </div>
                                </div>

                                {task.adminNotes && (
                                    <div className="alert alert-info mb-3">
                                        <h6 className="alert-heading mb-2">
                                            <i className="bi bi-info-circle me-2"></i>
                                            Admin Notes
                                        </h6>
                                        <p className="mb-0">{task.adminNotes}</p>
                                    </div>
                                )}

                                {task.feedback && (
                                    <div className="alert alert-success mb-0">
                                        <h6 className="alert-heading mb-2">
                                            <i className="bi bi-chat-left-text me-2"></i>
                                            Your Feedback
                                        </h6>
                                        <p className="mb-0">{task.feedback}</p>
                                    </div>
                                )}
                            </div>

                            <div className="card-footer bg-transparent border-top-0">
                                {task.status !== 'completed' && (
                                    <div className="btn-group w-100" role="group">
                                        <button
                                            className={`btn btn-sm ${task.status === 'pending' ? 'btn-primary' : 'btn-outline-primary'} ${updating ? 'disabled' : ''}`}
                                            onClick={() => updateTaskStatus(index, 'pending')}
                                            disabled={updating || task.status === 'pending'}
                                        >
                                            <i className="bi bi-clock me-1"></i>
                                            Set Pending
                                        </button>
                                        <button
                                            className={`btn btn-sm ${task.status === 'in-progress' ? 'btn-warning' : 'btn-outline-warning'} ${updating ? 'disabled' : ''}`}
                                            onClick={() => updateTaskStatus(index, 'in-progress')}
                                            disabled={updating || task.status === 'in-progress'}
                                        >
                                            <i className="bi bi-arrow-repeat me-1"></i>
                                            Start Progress
                                        </button>
                                        <button
                                            className={`btn btn-sm ${task.status === 'completed' ? 'btn-success' : 'btn-outline-success'} ${updating ? 'disabled' : ''}`}
                                            onClick={() => submitTaskFeedback(index)}
                                            disabled={updating}
                                        >
                                            <i className="bi bi-check-circle me-1"></i>
                                            Complete Task
                                        </button>
                                    </div>
                                )}

                                {task.status === 'completed' && (
                                    <div className="alert alert-success mb-0 text-center">
                                        <i className="bi bi-check-circle-fill me-2"></i>
                                        Task completed on {new Date(task.updatedAt || task.assignedDate).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {tasks.length > 0 && (
                <div className="mt-4">
                    <div className="card bg-light">
                        <div className="card-body">
                            <h6 className="mb-3">
                                <i className="bi bi-lightbulb me-2"></i>
                                Task Status Guide
                            </h6>
                            <div className="row">
                                <div className="col-md-4 mb-2">
                                    <span className="badge bg-secondary me-2">●</span>
                                    <small>Pending: Task assigned, not started</small>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <span className="badge bg-warning me-2">●</span>
                                    <small>In Progress: Currently working on task</small>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <span className="badge bg-success me-2">●</span>
                                    <small>Completed: Task finished with feedback</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}