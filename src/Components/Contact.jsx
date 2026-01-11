"use client";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Message sent successfully!");
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Server error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <div className="card">
              <Link
                href="https://wa.me/23408061621467"
                className="btn btn- btn-primary"
              >
                Chat Me On My WhatsApp
              </Link>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card">
              <Link href="tel:08061621467" className="btn btn- btn-warning">
                CALL ME{" "}
              </Link>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card">
              <Link
                href="mailto:ahmadhashim027@gmail.com"
                className="btn btn-outline-secondary"
              >
                SEND AN EMAIL
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container py-5">
        <div className="row align-items-center">
          {/* Left: Image */}
          <div className="col-md-6 text-center mb-4 mb-md-0">
            <img
              src="/FFF.jpg"
              alt="Contact illustration"
              className="img-fluid rounded"
            />
          </div>
          {/* Right: Form */}
          <div className="col-md-6">
            <h2 className="text-center text-warning mb-4">Contact Us</h2>
            <form onSubmit={handleSubmit} className="p-4 border rounded text-light">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-warning w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default ContactUs;
