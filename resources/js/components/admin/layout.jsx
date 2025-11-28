import React from "react";
import Header from "./header";
import { usePage } from "@inertiajs/react";

export default function Layout({ children, onNavigate }) {
  const { flash = {} } = usePage().props;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header onNavigate={onNavigate} />

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {flash?.success && (
            <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 mb-3 rounded-md shadow-sm">
              {flash.success}
            </div>
          )}
          {flash?.error && (
            <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-2 mb-3 rounded-md shadow-sm">
              {flash.error}
            </div>
          )}

          {children}
        </div>
      </main>
    </div>
  );
}
