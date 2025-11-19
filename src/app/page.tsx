"use client";

import { Scene } from "@/components/Scene";
import { UI } from "@/components/UI";

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-gray-900">
      <Scene />
      <UI />
    </main>
  );
}
