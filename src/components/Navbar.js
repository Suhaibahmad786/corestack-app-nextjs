"use client";

import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <h2>My App</h2>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}