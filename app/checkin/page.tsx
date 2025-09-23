"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckinRedirect() {
  const router = useRouter();

  useEffect(() => {
    try {
      // Force the generate flow to start at the check-in step
      localStorage.removeItem("generatedRecipeCache");
      localStorage.setItem("generate_currentStep", "checkin");
    } catch (err) {
      // ignore storage errors
    }
    router.replace("/generate?force=checkin");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-700">
      Loading check‑in…
    </div>
  );
}


