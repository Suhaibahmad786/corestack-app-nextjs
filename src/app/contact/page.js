"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong");
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });

    } catch (err) {
      setErrorMsg("Server error. Please try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%,100% { transform:translateY(0px) rotate(0deg); } 50% { transform:translateY(-12px) rotate(3deg); } }
        @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:0.8; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.6s ease 0.1s forwards; opacity:0; }
        .fade-up-3 { animation: fadeUp 0.6s ease 0.2s forwards; opacity:0; }
        .fade-up-4 { animation: fadeUp 0.6s ease 0.3s forwards; opacity:0; }
        .input-field:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.15) !important; outline: none; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 40px rgba(99,102,241,0.5) !important; }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn { transition: all 0.2s ease; }
        .contact-card:hover { border-color: #6366f144 !important; transform: translateY(-2px); }
        .contact-card { transition: all 0.2s ease; }
        .nav-link:hover { color: #6366f1 !important; }
        .nav-link { transition: color 0.2s; }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={s.nav}>
        <Link href="/" style={s.navLogo}>
          <div style={s.logoMark}>C</div>
          <span style={s.logoText}>CoreStack</span>
        </Link>
        <div style={s.navLinks}>
          <Link href="/" className="nav-link" style={s.navLink}>Home</Link>
          <Link href="/dashboard" className="nav-link" style={s.navLink}>Dashboard</Link>
          <Link href="/contact" className="nav-link" style={{ ...s.navLink, color:"#6366f1" }}>Contact</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={s.hero}>
        {/* Background decoration */}
        <div style={s.bgBlob1} />
        <div style={s.bgBlob2} />
        <div style={s.bgGrid} />

        <div className="fade-up" style={s.heroContent}>
          <div style={s.badge}>✉️ Get in Touch</div>
          <h1 style={s.heroTitle}>
            Let's <span style={s.heroAccent}>Talk</span>
          </h1>
          <p style={s.heroSubtitle}>
            Have a question, idea, or just want to say hello?
            We'd love to hear from you.
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={s.container}>
        <div style={s.grid}>

          {/* LEFT — Contact Info */}
          <div style={s.leftCol}>
            <div className="fade-up-2">
              <h2 style={s.sectionTitle}>Contact Information</h2>
              <p style={s.sectionDesc}>
                Fill out the form or reach us through any of the channels below.
                We typically respond within 24 hours.
              </p>
            </div>

            <div className="fade-up-3" style={{ display:"flex", flexDirection:"column", gap:"12px", marginTop:"32px" }}>
              {[
                {
                  icon: "📧",
                  label: "Email",
                  value: "hello@corestack.dev",
                  sub: "We reply within 24 hours"
                },
                {
                  icon: "💬",
                  label: "Live Chat",
                  value: "Available on dashboard",
                  sub: "Mon–Fri, 9am–6pm"
                },
                {
                  icon: "📍",
                  label: "Location",
                  value: "Remote First",
                  sub: "Serving clients worldwide"
                },
              ].map(item => (
                <div key={item.label} className="contact-card" style={s.contactCard}>
                  <div style={s.contactIcon}>{item.icon}</div>
                  <div>
                    <p style={s.contactLabel}>{item.label}</p>
                    <p style={s.contactValue}>{item.value}</p>
                    <p style={s.contactSub}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Decorative element */}
            <div className="fade-up-4" style={s.decorBox}>
              <div style={{ fontSize:"32px", marginBottom:"12px", animation:"float 4s ease infinite" }}>🚀</div>
              <p style={{ fontSize:"15px", fontWeight:"700", color:"#f0f2ff", marginBottom:"6px", fontFamily:"'Syne', sans-serif" }}>
                Building something awesome?
              </p>
              <p style={{ fontSize:"13px", color:"#556", lineHeight:"1.6" }}>
                We love helping developers and founders bring their ideas to life.
              </p>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div className="fade-up-3" style={s.formCard}>

            {/* Success State */}
            {status === "success" && (
              <div style={s.successBox}>
                <div style={{ fontSize:"48px", marginBottom:"16px" }}>🎉</div>
                <h3 style={{ fontSize:"20px", fontWeight:"800", color:"#f0f2ff", marginBottom:"8px", fontFamily:"'Syne', sans-serif" }}>
                  Message Sent!
                </h3>
                <p style={{ fontSize:"14px", color:"#8899bb", marginBottom:"20px" }}>
                  Thanks for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setStatus(null)}
                  style={{ padding:"10px 24px", borderRadius:"10px", border:"1px solid #2a2d4a", background:"transparent", color:"#6366f1", fontWeight:"600", fontSize:"14px", cursor:"pointer" }}>
                  Send Another Message
                </button>
              </div>
            )}

            {/* Form */}
            {status !== "success" && (
              <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
                <div>
                  <h2 style={s.formTitle}>Send us a Message</h2>
                  <p style={s.formSubtitle}>We read every message carefully.</p>
                </div>

                {/* Error message */}
                {status === "error" && (
                  <div style={s.errorBox}>
                    ❌ {errorMsg}
                  </div>
                )}

                {/* Name + Email row */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={e => handleChange("name", e.target.value)}
                      required
                      className="input-field"
                      style={s.input}
                    />
                  </div>
                  <div style={s.fieldGroup}>
                    <label style={s.label}>Email Address</label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={e => handleChange("email", e.target.value)}
                      required
                      className="input-field"
                      style={s.input}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div style={s.fieldGroup}>
                  <label style={s.label}>Subject</label>
                  <input
                    type="text"
                    placeholder="How can we help you?"
                    value={form.subject}
                    onChange={e => handleChange("subject", e.target.value)}
                    required
                    className="input-field"
                    style={s.input}
                  />
                </div>

                {/* Message */}
                <div style={s.fieldGroup}>
                  <label style={s.label}>Message</label>
                  <textarea
                    placeholder="Tell us more about your project, idea, or question..."
                    value={form.message}
                    onChange={e => handleChange("message", e.target.value)}
                    required
                    rows={6}
                    className="input-field"
                    style={{ ...s.input, resize:"vertical", minHeight:"140px", lineHeight:"1.6" }}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="submit-btn"
                  style={{
                    ...s.submitBtn,
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}>
                  {loading ? (
                    <span style={{ display:"flex", alignItems:"center", gap:"10px", justifyContent:"center" }}>
                      <span style={{ width:"16px", height:"16px", border:"2px solid #ffffff44", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }}/>
                      Sending...
                    </span>
                  ) : (
                    "Send Message →"
                  )}
                </button>

                <p style={{ fontSize:"12px", color:"#445", textAlign:"center" }}>
                  By submitting, you agree to our{" "}
                  <span style={{ color:"#6366f1", cursor:"pointer" }}>Privacy Policy</span>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <div style={{ ...s.logoMark, width:"24px", height:"24px", fontSize:"12px" }}>C</div>
            <span style={{ fontWeight:"700", color:"#f0f2ff", fontSize:"14px", fontFamily:"'Syne',sans-serif" }}>CoreStack</span>
          </div>
          <p style={{ color:"#445", fontSize:"13px" }}>© 2025 CoreStack. All rights reserved.</p>
          <div style={{ display:"flex", gap:"20px" }}>
            {["Home", "Dashboard", "Contact"].map(link => (
              <Link key={link} href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                className="nav-link" style={{ color:"#445", fontSize:"13px", textDecoration:"none" }}>
                {link}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      {/* Spin animation */}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: "100vh",
    background: "#080b14",
    fontFamily: "'DM Sans', sans-serif",
    color: "#e8eaf6",
    display: "flex",
    flexDirection: "column",
  },

  // Navbar
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 48px",
    borderBottom: "1px solid #141620",
    background: "rgba(8,11,20,0.9)",
    backdropFilter: "blur(12px)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navLogo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
  },
  logoMark: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "900",
    color: "#fff",
    fontFamily: "'Syne', sans-serif",
  },
  logoText: {
    fontWeight: "800",
    fontSize: "18px",
    color: "#f0f2ff",
    fontFamily: "'Syne', sans-serif",
    letterSpacing: "-0.03em",
    textDecoration: "none",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
  },
  navLink: {
    color: "#8899bb",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
  },

  // Hero
  hero: {
    position: "relative",
    padding: "80px 48px 60px",
    textAlign: "center",
    overflow: "hidden",
  },
  bgBlob1: {
    position: "absolute",
    top: "-100px",
    left: "10%",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
    borderRadius: "50%",
    pointerEvents: "none",
  },
  bgBlob2: {
    position: "absolute",
    top: "-60px",
    right: "10%",
    width: "300px",
    height: "300px",
    background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
    borderRadius: "50%",
    pointerEvents: "none",
  },
  bgGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage: "linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 16px",
    borderRadius: "20px",
    background: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.3)",
    color: "#818cf8",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "20px",
  },
  heroTitle: {
    fontSize: "clamp(40px, 6vw, 72px)",
    fontWeight: "800",
    color: "#f0f2ff",
    fontFamily: "'Syne', sans-serif",
    letterSpacing: "-0.04em",
    lineHeight: "1.1",
    marginBottom: "16px",
  },
  heroAccent: {
    background: "linear-gradient(135deg,#6366f1,#a78bfa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubtitle: {
    fontSize: "17px",
    color: "#556",
    maxWidth: "440px",
    margin: "0 auto",
    lineHeight: "1.7",
  },

  // Main container
  container: {
    flex: 1,
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 24px 80px",
    width: "100%",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.6fr",
    gap: "32px",
    alignItems: "start",
  },

  // Left column
  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },
  sectionTitle: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#f0f2ff",
    fontFamily: "'Syne', sans-serif",
    letterSpacing: "-0.02em",
    marginBottom: "10px",
  },
  sectionDesc: {
    fontSize: "14px",
    color: "#556",
    lineHeight: "1.7",
  },
  contactCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    padding: "16px",
    background: "#0f1120",
    border: "1px solid #1e2130",
    borderRadius: "14px",
  },
  contactIcon: {
    fontSize: "20px",
    width: "40px",
    height: "40px",
    background: "rgba(99,102,241,0.1)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  contactLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#445",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "3px",
  },
  contactValue: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#c8cadc",
    marginBottom: "2px",
  },
  contactSub: {
    fontSize: "12px",
    color: "#445",
  },
  decorBox: {
    marginTop: "20px",
    padding: "24px",
    background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: "16px",
    textAlign: "center",
  },

  // Form card
  formCard: {
    background: "#0f1120",
    border: "1px solid #1e2130",
    borderRadius: "20px",
    padding: "36px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
  },
  formTitle: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#f0f2ff",
    fontFamily: "'Syne', sans-serif",
    letterSpacing: "-0.02em",
    marginBottom: "6px",
  },
  formSubtitle: {
    fontSize: "14px",
    color: "#556",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#8899bb",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  input: {
    padding: "12px 16px",
    background: "#080b14",
    border: "1px solid #1e2130",
    borderRadius: "10px",
    color: "#e8eaf6",
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s, box-shadow 0.2s",
    width: "100%",
  },
  submitBtn: {
    padding: "14px 24px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "700",
    fontFamily: "'Syne', sans-serif",
    letterSpacing: "-0.01em",
    boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
  },
  errorBox: {
    padding: "12px 16px",
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: "10px",
    color: "#f87171",
    fontSize: "14px",
  },
  successBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px",
    textAlign: "center",
  },

  // Footer
  footer: {
    borderTop: "1px solid #141620",
    padding: "24px 48px",
    background: "#080b14",
  },
  footerInner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1100px",
    margin: "0 auto",
  },
};