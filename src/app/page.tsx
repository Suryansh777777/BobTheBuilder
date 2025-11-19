"use client";

import { Scene } from "@/components/Scene";
import { UI } from "@/components/UI";

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950">
      <Scene />
      <UI />
    </main>
  );
}
