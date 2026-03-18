"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="text-sm text-blue-400 hover:underline"
    >
      &larr; Back
    </button>
  );
}
