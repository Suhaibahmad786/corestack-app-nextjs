"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/dashboard?success=true");
    }, 3000);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#090b14", color: "#fff", gap: "16px" }}>
      <div style={{ fontSize: "64px" }}>🎉</div>
      <h1 style={{ fontSize: "28px", fontWeight: "800" }}>Payment Successful!</h1>
      <p style={{ color: "#556" }}>Redirecting to dashboard...</p>
      <div style={{ width: "40px", height: "40px", border: "3px solid #1e2130", borderTop: "3px solid #6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}