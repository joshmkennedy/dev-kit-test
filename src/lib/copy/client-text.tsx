import dynamic from "next/dynamic";

export const Text = dynamic(() => import("./_client-text").then((mod) => mod.Text), { ssr: false });
