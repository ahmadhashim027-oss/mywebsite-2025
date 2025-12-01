"use client";

import { useState, useEffect } from "react";

export default function EditTaskForm({ show, onClose, task, onUpdate }) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Prefill when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        date: task.date || "",
        description: task.description || "",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const res = await fetch("/api/task", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task._id, ...formData }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Task updated successfully!");
        onUpdate(); // refresh task list
        onClose(); // close modal
      } else {
        alert("Update failed: " + result.message);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div
        className={`modal fade ${show ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ background: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg">
            <div className="modal-header bg-secondary text-light">
              <h5 className="modal-title">Edit Task</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control shadow-none"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    className="form-control shadow-none"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-control shadow-none"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="text-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary me-2"
                    onClick={onClose}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-secondary"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
