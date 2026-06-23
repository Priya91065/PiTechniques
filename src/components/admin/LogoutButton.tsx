"use client";

import { useState, type JSX } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";

export default function LogoutButton(): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout(): Promise<void> {
    setLoading(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <Button variant="outlined" color="secondary" onClick={logout} disabled={loading}>
      {loading ? "Signing out…" : "Sign out"}
    </Button>
  );
}
