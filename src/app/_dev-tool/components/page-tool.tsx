"use client";

import { useParams } from "next/navigation";

export function PageTool() {
  const p = useParams();
  return (
    <div>
      <h1>Page Tool</h1>

      <ul>
        {Object.entries(p).map(([key, value]) => (
          <li key={key}>
            <strong>{key}</strong>: {value}
          </li>
        ))}
      </ul>
    </div>
  );
}
