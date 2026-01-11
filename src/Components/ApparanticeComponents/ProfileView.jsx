"use client";

import React from "react";

export default function ProfileView({ apprentice }) {
    if (!apprentice) {
        return (
            <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading profile data...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Profile Information</h3>
                <span className={`badge ${apprentice.approved ? 'bg-success' : 'bg-warning'}`}>
                    {apprentice.approved ? 'Approved' : 'Pending Approval'}
                </span>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label text-muted">Full Name</label>
                                <p className="fw-semibold">{apprentice.fullName || "N/A"}</p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-muted">Email</label>
                                <p className="fw-semibold">{apprentice.email || "N/A"}</p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-muted">Phone</label>
                                <p className="fw-semibold">{apprentice.phone || "N/A"}</p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-muted">Age</label>
                                <p className="fw-semibold">{apprentice.age || "N/A"}</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label text-muted">Gender</label>
                                <p className="fw-semibold">{apprentice.gender || "N/A"}</p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-muted">Address</label>
                                <p className="fw-semibold">{apprentice.address || "N/A"}</p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-muted">Selected Skill</label>
                                <p className="fw-semibold">
                                    <span className="badge bg-info">{apprentice.skill || "Not selected"}</span>
                                </p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-muted">Member Since</label>
                                <p className="fw-semibold">
                                    {apprentice.createdAt ? new Date(apprentice.createdAt).toLocaleDateString() : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {apprentice.guardian && (
                        <div className="mt-4 pt-4 border-top">
                            <h5 className="fw-bold mb-3">Guardian Information</h5>
                            <div className="row">
                                <div className="col-md-4">
                                    <label className="form-label text-muted">Name</label>
                                    <p className="fw-semibold">{apprentice.guardian.name}</p>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label text-muted">Relationship</label>
                                    <p className="fw-semibold">{apprentice.guardian.relationship}</p>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label text-muted">Phone</label>
                                    <p className="fw-semibold">{apprentice.guardian.phone}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}