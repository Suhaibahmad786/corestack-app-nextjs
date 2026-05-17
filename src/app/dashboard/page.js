"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = {
  home:     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  user:     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  cloud:    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>,
  book:     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  credit:   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  logout:   <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  lock:     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  edit:     <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  save:     <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  sun:      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  wind:     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>,
  camera:   <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  zap:      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  check:    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
};

// ─── PLAN COLORS ─────────────────────────────────────────────────────────────
const planColors = { free: "#556", professional: "#f59e0b", business: "#6366f1" };

function PlanBadge({ plan = "free" }) {
  const colors = {
    free: { bg: "#55555522", color: "#888", border: "#55555544" },
    professional: { bg: "#f59e0b22", color: "#f59e0b", border: "#f59e0b44" },
    business: { bg: "#6366f122", color: "#818cf8", border: "#6366f144" },
  };
  const c = colors[plan] || colors.free;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      padding: "3px 10px", borderRadius: "20px", fontSize: "11px",
      fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em",
      background: c.bg, color: c.color, border: `1px solid ${c.border}`
    }}>
      {plan === "free" ? "Free" : plan === "professional" ? "⚡ Pro" : "💎 Business"}
    </span>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "overview", label: "Overview", icon: Icon.home },
  { id: "profile",  label: "Profile",  icon: Icon.user },
  { id: "weather",  label: "Weather",  icon: Icon.cloud },
  { id: "courses",  label: "Courses",  icon: Icon.book, pro: true },
  { id: "pricing",  label: "Pricing",  icon: Icon.credit },
];

// ─── WEATHER CODES ───────────────────────────────────────────────────────────
function getWeatherDesc(code) {
  if (code === 0) return { desc: "Clear Sky", emoji: "☀️" };
  if (code <= 3) return { desc: "Partly Cloudy", emoji: "⛅" };
  if (code <= 48) return { desc: "Foggy", emoji: "🌫️" };
  if (code <= 67) return { desc: "Rainy", emoji: "🌧️" };
  if (code <= 77) return { desc: "Snowy", emoji: "❄️" };
  if (code <= 82) return { desc: "Showers", emoji: "🌦️" };
  return { desc: "Thunderstorm", emoji: "⛈️" };
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [weatherCity, setWeatherCity] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── INIT ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) { router.push("/login"); return; }

      const authUser = data.user;
      setUser(authUser);

      let { data: dbUser } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();

      if (!dbUser) {
        const { data: inserted } = await supabase
          .from("users")
          .upsert({
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.full_name || authUser.email,
            plan: "free",
            subscription_status: "active",
          })
          .select()
          .single();
        dbUser = inserted;
      }

      setProfile(dbUser);
      setTempProfile({
        name: dbUser.name || "",
        phone: dbUser.phone || "",
        website: dbUser.website || "",
        profession: dbUser.profession || "",
        bio: dbUser.bio || "",
      });
      setLoading(false);
    };
    init();
    const params = new URLSearchParams(window.location.search);
  if (params.get("success") === "true") {
    setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: dbUser } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        if (dbUser) {
          setProfile(dbUser);
          setTempProfile({
            name: dbUser.name || "",
            phone: dbUser.phone || "",
            website: dbUser.website || "",
            profession: dbUser.profession || "",
            bio: dbUser.bio || "",
          });
        }
      }
      // Clean URL
      window.history.replaceState({}, "", "/dashboard");
    }, 2000); // wait 2s for webhook
  }
}, []);

  // ── WEATHER ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab === "weather" && !weather) loadWeather();
  }, [activeTab]);

  const loadWeather = () => {
    setWeatherLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const [weatherRes, geoRes] = await Promise.all([
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m`),
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
          ]);
          const weatherData = await weatherRes.json();
          const geoData = await geoRes.json();
          setWeather(weatherData.current_weather);
          setWeatherCity(geoData.address?.city || geoData.address?.town || geoData.address?.state || "Your Location");
        } catch (e) {
          showToast("Failed to load weather", "error");
        }
        setWeatherLoading(false);
      },
      () => { showToast("Location access denied", "error"); setWeatherLoading(false); }
    );
  };

  // ── COURSES ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab === "courses" && profile?.plan !== "free") loadCourses();
  }, [activeTab, profile]);

  const loadCourses = async () => {
    const { data } = await supabase.from("courses").select("*").order("id");
    if (data) setCourses(data);
  };

  // ── LOGOUT ────────────────────────────────────────────────────────────────
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // ── SAVE PROFILE ──────────────────────────────────────────────────────────
  const saveProfile = async () => {
    if (!tempProfile.name) { showToast("Name is required", "error"); return; }
    setSaving(true);
    const { error } = await supabase
      .from("users")
      .update({
        name: tempProfile.name,
        phone: tempProfile.phone,
        website: tempProfile.website,
        profession: tempProfile.profession,
        bio: tempProfile.bio,
      })
      .eq("id", user.id);

    if (error) { showToast("Update failed", "error"); }
    else {
      setProfile({ ...profile, ...tempProfile });
      setEditMode(false);
      showToast("Profile updated ✅");
    }
    setSaving(false);
  };

  // ── UPLOAD AVATAR ─────────────────────────────────────────────────────────
  const uploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/doevsi5po/image/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();

      await supabase
        .from("users")
        .update({ avatar_url: data.secure_url })
        .eq("id", user.id);

      setProfile({ ...profile, avatar_url: data.secure_url });
      showToast("Profile picture updated ✅");
    } catch (e) {
      showToast("Upload failed", "error");
    }
    setUploading(false);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };
const handleCheckout = async (plan) => {
  try {
    // ✅ Map plan names to match API
    const planMap = {
      "professional": "pro",
      "business": "business",
    };
    const mappedPlan = planMap[plan] || plan;

    const res = await fetch("/api/payment/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: mappedPlan }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Something went wrong");
      return;
    }

    window.location.href = data.url;

  } catch (err) {
    console.log("Fetch error:", err);
    alert("Something went wrong");
  }
};
const handleUpgrade = async (plan) => {
  try {
    const res = await fetch("/api/payment/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // ✅ No need to send token — Supabase reads from cookie automatically!
      body: JSON.stringify({ plan }),
    });

    if (res.status === 401) {
      alert("Please login first!");
      router.push("/login");
      return;
    }

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    // Redirect to Stripe checkout
    window.location.href = data.url;

  } catch (err) {
    console.log("Error:", err);
    alert("Something went wrong");
  }
};
const handleCancelSubscription = async () => {
  if (!confirm("Are you sure? You keep access until billing period ends.")) return;
  try {
    const res = await fetch("/api/payment/cancel-subscription", {
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.message || "Cancel failed", "error");
      return;
    }
    setProfile(prev => ({ ...prev, subscription_status: "cancelling" }));
    showToast("Subscription cancelled ✅");
  } catch (err) {
    showToast("Something went wrong", "error");
  }
};
  // ── LOADING ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#090b14", flexDirection: "column", gap: "16px" }}>
      <div style={{ width: "40px", height: "40px", border: "3px solid #1e2130", borderTop: "3px solid #6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color: "#556", fontSize: "14px", margin: 0 }}>Loading...</p>
    </div>
  );

  const userPlan = profile?.plan || "free";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#090b14", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#e8eaf6" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #222530; border-radius: 4px; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .tab { animation: fadeIn 0.2s ease; }
        input, textarea { font-family: inherit; }
      `}</style>

      {/* ══ SIDEBAR ══════════════════════════════════════════════════════════ */}
      <aside style={{ width: "248px", minHeight: "100vh", background: "#0c0e17", borderRight: "1px solid #141620", display: "flex", flexDirection: "column", padding: "20px 12px", position: "sticky", top: 0, height: "100vh" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", padding: "4px 8px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "900", color: "#fff" }}>C</div>
          <span style={{ fontWeight: "800", fontSize: "17px", color: "#f0f2ff", letterSpacing: "-0.03em" }}>CoreStack</span>
        </div>

        {/* User Card */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: "#0f1120", borderRadius: "12px", border: "1px solid #1e2130", marginBottom: "20px" }}>
          <div style={{ width: "36px", height: "36px", minWidth: "36px", borderRadius: "50%", overflow: "hidden", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "800", color: "#fff" }}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : getInitials(profile?.name)
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: "700", fontSize: "13px", color: "#f0f2ff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile?.name || "User"}</p>
            <p style={{ fontSize: "11px", color: "#445", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile?.email || ""}</p>
          </div>
          <PlanBadge plan={userPlan} />
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto" }}>
          <p style={{ margin: "0 0 6px 12px", fontSize: "10px", fontWeight: "700", color: "#334", textTransform: "uppercase", letterSpacing: "0.1em" }}>Menu</p>
          {NAV.map(tab => {
            const isActive = activeTab === tab.id;
            const isLocked = tab.pro && userPlan === "free";
            return (
              <button key={tab.id}
                onClick={() => !isLocked && setActiveTab(tab.id)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", padding: "9px 12px", borderRadius: "10px", border: "none",
                  background: isActive ? "rgba(99,102,241,0.15)" : "transparent",
                  color: isActive ? "#818cf8" : isLocked ? "#334" : "#8899bb",
                  fontSize: "13px", fontWeight: "600", cursor: isLocked ? "default" : "pointer",
                  textAlign: "left", marginBottom: "2px",
                  borderLeft: isActive ? "2px solid #6366f1" : "2px solid transparent",
                }}>
                <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ opacity: isActive ? 1 : isLocked ? 0.3 : 0.6 }}>{tab.icon}</span>
                  {tab.label}
                </span>
                {isLocked && <span style={{ fontSize: "10px", color: "#f59e0b", background: "#f59e0b22", padding: "2px 6px", borderRadius: "4px", fontWeight: "700" }}>PRO</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", borderRadius: "10px", border: "1px solid #1e2130", background: "transparent", color: "#ef4444", fontSize: "13px", fontWeight: "600", cursor: "pointer", marginTop: "8px" }}>
          {Icon.logout} Sign out
        </button>
      </aside>

      {/* ══ MAIN ═════════════════════════════════════════════════════════════ */}
      <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

        {/* Topbar */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#f0f2ff", letterSpacing: "-0.03em", marginBottom: "4px" }}>
            {activeTab === "overview" && "Overview"}
            {activeTab === "profile" && "My Profile"}
            {activeTab === "weather" && "Weather"}
            {activeTab === "courses" && "Courses"}
            {activeTab === "pricing" && "Pricing Plans"}
          </h1>
          <p style={{ fontSize: "13px", color: "#445" }}>
            {activeTab === "overview" && `Good to see you, ${profile?.name?.split(" ")[0]} 👋`}
            {activeTab === "profile" && "Manage your account information"}
            {activeTab === "weather" && "Live weather powered by your location"}
            {activeTab === "courses" && "Learn and grow with our courses"}
            {activeTab === "pricing" && "Choose the right plan for you"}
          </p>
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="tab" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "16px" }}>
              {[
                { label: "Plan", value: userPlan.charAt(0).toUpperCase() + userPlan.slice(1), color: "#6366f1", icon: "💎" },
                { label: "Status", value: profile?.subscription_status || "active", color: "#10b981", icon: "🟢" },
                { label: "Member since", value: new Date(user?.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }), color: "#f59e0b", icon: "📅" },
                { label: "Courses", value: userPlan === "free" ? "Locked" : "Unlocked", color: "#ec4899", icon: "📚" },
              ].map(stat => (
                <div key={stat.label} style={{ background: "#0f1120", border: "1px solid #1e2130", borderRadius: "14px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <span style={{ fontSize: "22px" }}>{stat.icon}</span>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: stat.color, background: `${stat.color}22`, padding: "3px 8px", borderRadius: "6px", textTransform: "uppercase" }}>{stat.label}</span>
                  </div>
                  <p style={{ fontSize: "20px", fontWeight: "800", color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div style={{ background: "#0f1120", border: "1px solid #1e2130", borderRadius: "16px", padding: "22px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#f0f2ff", marginBottom: "14px" }}>Quick Actions</h3>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {[
                  { label: "Edit Profile", tab: "profile", color: "#6366f1" },
                  { label: "Check Weather", tab: "weather", color: "#22d3ee" },
                  { label: "View Courses", tab: "courses", color: "#f59e0b" },
                  { label: "Update Plan", tab: "pricing", color: "#ec4899" },
                ].map(a => (
                  <button key={a.label}
                    onClick={() => setActiveTab(a.tab)}
                    style={{ padding: "8px 16px", borderRadius: "8px", border: `1px solid ${a.color}44`, background: `${a.color}11`, color: a.color, fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PROFILE ── */}
        {activeTab === "profile" && profile && (
          <div className="tab" style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "680px" }}>
            <div style={{ background: "#0f1120", border: "1px solid #1e2130", borderRadius: "16px", padding: "22px" }}>

              {/* Avatar row */}
              <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid #1e2130" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: "72px", height: "72px", borderRadius: "50%", overflow: "hidden", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", fontWeight: "800", color: "#fff" }}>
                    {profile.avatar_url
                      ? <img src={profile.avatar_url} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : getInitials(profile.name)
                    }
                  </div>
                  <label htmlFor="avatar-upload" style={{ position: "absolute", bottom: 0, right: 0, width: "24px", height: "24px", borderRadius: "50%", background: "#6366f1", border: "2px solid #090b14", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    {uploading ? "⏳" : Icon.camera}
                  </label>
                  <input id="avatar-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={uploadAvatar} />
                </div>
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#f0f2ff", marginBottom: "4px" }}>{profile.name}</h2>
                  <p style={{ fontSize: "14px", color: "#556", marginBottom: "8px" }}>{profile.email}</p>
                  <PlanBadge plan={userPlan} />
                </div>
              </div>

              {/* View mode */}
              {!editMode && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "16px", marginBottom: "20px" }}>
                    {[
                      { label: "Full Name", value: profile.name },
                      { label: "Email", value: profile.email },
                      { label: "Phone", value: profile.phone || "—" },
                      { label: "Website", value: profile.website || "—" },
                      { label: "Profession", value: profile.profession || "—" },
                    ].map(item => (
                      <div key={item.label}>
                        <p style={{ fontSize: "11px", fontWeight: "700", color: "#445", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>{item.label}</p>
                        <p style={{ fontSize: "14px", color: "#c8cadc" }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                  {profile.bio && (
                    <div style={{ marginBottom: "20px" }}>
                      <p style={{ fontSize: "11px", fontWeight: "700", color: "#445", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Bio</p>
                      <p style={{ fontSize: "14px", color: "#c8cadc", lineHeight: "1.6" }}>{profile.bio}</p>
                    </div>
                  )}
                  <button onClick={() => setEditMode(true)} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "9px 18px", borderRadius: "10px", border: "1px solid #2a2d4a", background: "transparent", color: "#818cf8", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                    {Icon.edit} Edit Profile
                  </button>
                </>
              )}

              {/* Edit mode */}
              {editMode && (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {[
                    { key: "name", label: "Full Name", placeholder: "John Doe" },
                    { key: "phone", label: "Phone", placeholder: "+1 234 567 890" },
                    { key: "website", label: "Website", placeholder: "https://yoursite.com" },
                    { key: "profession", label: "Profession", placeholder: "Developer" },
                  ].map(field => (
                    <div key={field.key}>
                      <label style={{ fontSize: "11px", fontWeight: "700", color: "#556", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>{field.label}</label>
                      <input
                        value={tempProfile[field.key] || ""}
                        onChange={e => setTempProfile({ ...tempProfile, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        style={{ width: "100%", padding: "11px 14px", background: "#0c0e17", border: "1px solid #222530", borderRadius: "10px", color: "#e8eaf6", fontSize: "14px", outline: "none" }}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: "700", color: "#556", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "6px" }}>Bio</label>
                    <textarea
                      value={tempProfile.bio || ""}
                      onChange={e => setTempProfile({ ...tempProfile, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={3}
                      style={{ width: "100%", padding: "11px 14px", background: "#0c0e17", border: "1px solid #222530", borderRadius: "10px", color: "#e8eaf6", fontSize: "14px", outline: "none", resize: "vertical" }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={saveProfile} disabled={saving} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 18px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
                      {Icon.save} {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button onClick={() => setEditMode(false)} style={{ padding: "9px 18px", borderRadius: "10px", border: "1px solid #1e2130", background: "transparent", color: "#445", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── WEATHER ── */}
        {activeTab === "weather" && (
          <div className="tab" style={{ maxWidth: "500px" }}>
            <div style={{ background: "#0f1120", border: "1px solid #1e2130", borderRadius: "16px", padding: "28px" }}>
              {weatherLoading && (
                <div style={{ textAlign: "center", padding: "40px", color: "#556" }}>
                  <div style={{ width: "32px", height: "32px", border: "3px solid #1e2130", borderTop: "3px solid #6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
                  Getting your location...
                </div>
              )}

              {!weatherLoading && !weather && (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>🌍</div>
                  <p style={{ color: "#556", marginBottom: "20px" }}>Allow location access to see weather</p>
                  <button onClick={loadWeather} style={{ padding: "10px 24px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontWeight: "700", cursor: "pointer" }}>
                    Get Weather
                  </button>
                </div>
              )}

              {weather && !weatherLoading && (() => {
                const { desc, emoji } = getWeatherDesc(weather.weathercode);
                const isDay = weather.is_day;
                return (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                      <div>
                        <p style={{ fontSize: "14px", color: "#556", marginBottom: "4px" }}>📍 {weatherCity}</p>
                        <p style={{ fontSize: "48px", fontWeight: "800", color: "#f0f2ff", letterSpacing: "-0.03em" }}>{weather.temperature}°C</p>
                        <p style={{ fontSize: "16px", color: "#8899bb", marginTop: "4px" }}>{desc}</p>
                      </div>
                      <div style={{ fontSize: "64px" }}>{emoji}</div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      {[
                        { icon: Icon.wind, label: "Wind Speed", value: `${weather.windspeed} km/h` },
                        { icon: Icon.sun, label: "Time of Day", value: isDay ? "Daytime" : "Nighttime" },
                      ].map(item => (
                        <div key={item.label} style={{ background: "#0c0e17", borderRadius: "10px", padding: "14px", border: "1px solid #1e2130" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#556", fontSize: "12px", marginBottom: "6px" }}>
                            {item.icon} {item.label}
                          </div>
                          <p style={{ fontSize: "16px", fontWeight: "700", color: "#c8cadc" }}>{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <button onClick={loadWeather} style={{ marginTop: "16px", width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #1e2130", background: "transparent", color: "#556", fontSize: "13px", cursor: "pointer" }}>
                      🔄 Refresh
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ── COURSES ── */}
        {activeTab === "courses" && (
          <div className="tab">
            {userPlan === "free" ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#f59e0b22", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", fontSize: "28px" }}>{Icon.lock}</div>
                <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#f0f2ff", marginBottom: "10px" }}>Courses are a Pro feature</h2>
                <p style={{ fontSize: "15px", color: "#556", maxWidth: "380px", lineHeight: "1.6", marginBottom: "24px" }}>Upgrade your plan to unlock all courses and learning materials.</p>
                <button onClick={() => setActiveTab("pricing")} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 18px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
                  {Icon.zap} View Pricing Plans
                </button>
              </div>
            ) : selectedCourse ? (
              <div style={{ maxWidth: "700px" }}>
                <button onClick={() => setSelectedCourse(null)} style={{ marginBottom: "16px", background: "transparent", border: "1px solid #1e2130", color: "#818cf8", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>
                  ← Back to courses
                </button>
                <div style={{ background: "#0f1120", border: "1px solid #1e2130", borderRadius: "16px", padding: "28px" }}>
                  <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#f0f2ff", marginBottom: "8px" }}>{selectedCourse.title}</h2>
                  <p style={{ color: "#556", marginBottom: "20px" }}>{selectedCourse.description}</p>
                  <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.9", color: "#c8cadc", background: "#0c0e17", padding: "24px", borderRadius: "12px", border: "1px solid #1e2130" }}>
                    {selectedCourse.content}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "16px" }}>
                {courses.map(course => (
                  <div key={course.id}
                    onClick={() => setSelectedCourse(course)}
                    style={{ background: "#0f1120", border: "1px solid #1e2130", borderRadius: "16px", padding: "22px", cursor: "pointer", transition: "border-color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#6366f1"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#1e2130"}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <span style={{ fontSize: "28px" }}>📚</span>
                      {course.is_free
                        ? <span style={{ fontSize: "11px", fontWeight: "700", color: "#10b981", background: "#10b98122", padding: "3px 8px", borderRadius: "6px" }}>Free</span>
                        : <span style={{ fontSize: "11px", fontWeight: "700", color: "#f59e0b", background: "#f59e0b22", padding: "3px 8px", borderRadius: "6px" }}>Pro</span>
                      }
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f0f2ff", marginBottom: "6px" }}>{course.title}</h3>
                    <p style={{ fontSize: "13px", color: "#556", lineHeight: "1.5", marginBottom: "12px" }}>{course.description}</p>
                    <span style={{ fontSize: "12px", color: "#445", textTransform: "capitalize" }}>{course.level}</span>
                  </div>
                ))}
                {courses.length === 0 && (
                  <p style={{ color: "#556", fontSize: "14px" }}>No courses available yet.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── PRICING ── */}
{activeTab === "pricing" && (
  <div className="tab">
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px", maxWidth: "900px" }}>
      {[
        { title: "Starter", price: "0", plan: "free", features: ["3 Projects", "Basic Support", "1GB Storage"], color: "#6b7280" },
        { title: "Professional", price: "29", plan: "professional", features: ["Unlimited Projects", "Priority Support", "10GB Storage", "Courses Access"], color: "#6366f1", popular: true },
        { title: "Business", price: "99", plan: "business", features: ["Enterprise Security", "Custom Domain", "Unlimited Storage", "All Features"], color: "#f59e0b" },
      ].map(p => (
        <div key={p.plan} style={{ background: "#0f1120", border: `${userPlan === p.plan ? "2px solid #10b981" : p.popular ? "2px solid #6366f1" : "1px solid #1e2130"}`, borderRadius: "16px", padding: "24px", position: "relative" }}>
          {userPlan === p.plan && (
            <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "#10b981", color: "#fff", fontSize: "11px", fontWeight: "700", padding: "3px 12px", borderRadius: "20px", whiteSpace: "nowrap" }}>✓ Current Plan</div>
          )}
          <h3 style={{ fontSize: "13px", fontWeight: "600", color: p.color, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>{p.title}</h3>
          <div style={{ fontSize: "32px", fontWeight: "800", color: "#f0f2ff", marginBottom: "20px" }}>
            ${p.price}<span style={{ fontSize: "14px", color: "#556", fontWeight: "400" }}>/mo</span>
          </div>
          <ul style={{ listStyle: "none", marginBottom: "24px" }}>
            {p.features.map(f => (
              <li key={f} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 0", color: "#8899bb", fontSize: "13px" }}>
                <span style={{ color: "#10b981" }}>{Icon.check}</span> {f}
              </li>
            ))}
          </ul>
          <button
            disabled={userPlan === p.plan}
            onClick={() => userPlan !== p.plan && p.plan !== "free" && handleCheckout(p.plan)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none", background: userPlan === p.plan ? "#10b98122" : p.popular ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#1e2130", color: userPlan === p.plan ? "#10b981" : "#fff", fontWeight: "600", fontSize: "14px", cursor: userPlan === p.plan ? "default" : "pointer" }}>
            {userPlan === p.plan ? "Current Plan" : p.plan === "free" ? "Downgrade" : "Upgrade"}
          </button>
        </div>
      ))}
    </div>

    {/* Cancel subscription */}
    {userPlan !== "free" && (
      <div style={{ marginTop: "24px", background: "#0f1120", border: "1px solid #1e2130", borderRadius: "16px", padding: "22px", maxWidth: "400px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#f0f2ff", marginBottom: "6px" }}>Subscription</h3>
        <p style={{ fontSize: "13px", color: "#556", marginBottom: "16px" }}>
          You are on the <strong style={{ color: planColors[userPlan] }}>{userPlan}</strong> plan.
        </p>
        {profile?.subscription_status === "cancelling" ? (
          <div style={{ background: "#f59e0b11", border: "1px solid #f59e0b44", borderRadius: "10px", padding: "12px 16px", color: "#f59e0b", fontSize: "13px" }}>
            ⚠️ Your subscription is cancelling. You keep access until billing period ends.
          </div>
        ) : (
          <button
            onClick={handleCancelSubscription}
            style={{ padding: "9px 18px", borderRadius: "10px", border: "1px solid #ef444444", background: "#ef444411", color: "#ef4444", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
            Cancel Subscription
          </button>
        )}
      </div>
    )}
  </div>
)}
      </main>

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", padding: "12px 20px", borderRadius: "12px", color: "#fff", fontWeight: "700", fontSize: "14px", zIndex: 9999, background: toast.type === "error" ? "#ef4444" : "#10b981", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}