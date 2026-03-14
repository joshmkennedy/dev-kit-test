"use client";
import { useSession } from "next-auth/react";
export default function Layout({
  children,
  nav,
}: {
  children: React.ReactNode;
  nav?: React.ReactNode;
}) {
  const { data } = useSession();

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <header className="flex flex-row justify-between items-center w-full p-4">
        <h1>Header</h1>
        <div>{data?.user?.name}</div>
        <div>{data?.user?.id}</div>
      </header>
      <div className="flex flex-1">
        {nav && (
          <aside className="w-48 p-4 border-r border-white/10">
            {nav}
          </aside>
        )}
        <main className="flex-1 p-10">{children}</main>
      </div>
      <footer>
        <p>Suck It</p>
      </footer>
    </div>
  );
}
