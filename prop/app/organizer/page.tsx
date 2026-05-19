"use client";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function OrganizerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!loading && user?.role === "super_auth") router.push("/admin");
  }, [user, loading, router]);

  // Organizer heads share the same admin page but with limited permissions (enforced by backend)
  useEffect(() => {
    if (!loading && user) router.push("/admin");
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-[#D4763C] animate-spin" />
    </div>
  );
}
