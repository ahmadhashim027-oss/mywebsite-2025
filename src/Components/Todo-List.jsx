"use client";
import { useEffect, useState } from "react";

export default function TodoList() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Add new task
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        alert("Task added successfully!");
        setFormData({ title: "", date: "", description: "" });
        fetchTasks(); // refresh list immediately
      } else {
        alert("Failed to add task: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting task:", error);
    }
    setIsSubmitting(false);
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/task");
      const data = await res.json();
      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 2000);
    return () => clearInterval(interval);
  }, []);

  // Delete task (for completed only)
  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/task", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (result.success) {
        alert("Task deleted successfully");
        fetchTasks();
      } else {
        alert("Delete failed: " + result.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Mark as completed
  const handleComplete = async (id) => {
    try {
      const res = await fetch(`/api/task`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed: true }),
      });
      const result = await res.json();
      if (result.success) {
        fetchTasks(); // refresh both lists
      }
    } catch (error) {
      console.error("Failed to complete task:", error);
    }
  };

  // Edit button opens modal
  const openEditModal = (task) => {
    setEditTask(task);
    setShowEditModal(true);
  };

  // Save edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/task`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editTask._id, ...editTask }),
      });
      const result = await res.json();
      if (result.success) {
        alert("Task updated!");
        setShowEditModal(false);
        fetchTasks();
      }
    } catch (error) {
      console.error("Edit failed:", error);
    }
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="container my-5">
      <div className="row g-4 justify-content-between">
        {/* Active Tasks */}
        <div className="col-lg-4 col-md-6 col-12">
          <div className="card p-4 shadow">
            <h5 className="text-uppercase text-center">Active Tasks</h5>
            <div className="accordion" id="activeAccordion">
              {activeTasks.map((task, index) => (
                <div className="accordion-item" key={task._id}>
                  <h2 className="accordion-header" id={`heading-${index}`}>
                    <button
                      className="accordion-button collapsed bg-secondary text-light"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse-${index}`}
                    >
                      {task.title}
                    </button>
                    <div className="d-flex justify-content-between align-items-center mt-1 gap-2 px-2">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => openEditModal(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleComplete(task._id)}
                      >
                        ✓ Done
                      </button>
                      <small>{new Date(task.date).toLocaleDateString()}</small>
                    </div>
                  </h2>
                  <div
                    id={`collapse-${index}`}
                    className="accordion-collapse collapse"
                    data-bs-parent="#activeAccordion"
                  >
                    <div className="accordion-body">{task.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Task Form */}
        <div className="col-lg-4 col-md-6 col-12">
          <div className="card p-4 shadow">
            <h5 className="text-uppercase text-center">Add New Task</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
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
              <div className="mb-2">
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
              <div className="mb-2">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control shadow-none"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-secondary w-100 mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Please wait..." : "Add Task"}
              </button>
            </form>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="col-lg-4 col-md-6 col-12">
          <div className="card p-4 shadow">
            <h5 className="text-uppercase text-center">Completed Tasks</h5>
            <div className="accordion" id="completedAccordion">
              {completedTasks.map((task, index) => (
                <div className="accordion-item" key={task._id}>
                  <h2 className="accordion-header" id={`done-${index}`}>
                    <button
                      className="accordion-button collapsed bg-success text-light"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#done-collapse-${index}`}
                    >
                      {task.title}
                    </button>
                    <div className="d-flex justify-content-between align-items-center mt-1 px-2">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(task._id)}
                      >
                        Delete
                      </button>
                      <small>{new Date(task.date).toLocaleDateString()}</small>
                    </div>
                  </h2>
                  <div
                    id={`done-collapse-${index}`}
                    className="accordion-collapse collapse"
                    data-bs-parent="#completedAccordion"
                  >
                    <div className="accordion-body">{task.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Task</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editTask?.title || ""}
                      onChange={(e) =>
                        setEditTask((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={
                        editTask?.date
                          ? new Date(editTask.date).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setEditTask((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={editTask?.description || ""}
                      onChange={(e) =>
                        setEditTask((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
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
