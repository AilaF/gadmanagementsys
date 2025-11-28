import React from "react";
import Header from "./header.jsx";
import { Head, router } from "@inertiajs/react";

export default function Layout({ children, title = "Evaluator" }) {
  // use Inertia router POST so Laravel's logout (which expects POST + CSRF) works
  const handleLogout = (e) => {
    e?.preventDefault?.();
    router.post("/logout");
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Head title={title} />
      {/* full-bleed layout: header + content fill the viewport width */}
      <div className="w-full">
        <Header onLogout={handleLogout} />
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
}
