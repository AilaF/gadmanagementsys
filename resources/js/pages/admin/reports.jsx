import React from "react";
import Layout from "../../components/admin/layout";
import { router } from "@inertiajs/react";
import { HardHat } from "lucide-react"; // Import an icon for the page

export default function Reports() {
  const handleNavigate = (page) => {
    const routes = {
      dashboard: "admin.home",
      manageusers: "admin.manageusers",
      trackpaps: "admin.trackpaps",
      scorecard: "admin.scorecard",
      reports: "admin.reports",
    };
    const routeName = routes[page];
    if (routeName) {
      router.get(route(routeName));
    }
  };

  return (
    <Layout onNavigate={handleNavigate}>
      <div className="flex flex-col items-center justify-center h-[70vh] text-center text-gray-500">
        <HardHat className="w-20 h-20 mb-6 text-yellow-500" strokeWidth={1.5} />
        <h1 className="text-3xl font-bold text-gray-700 mb-2">
          Under Construction
        </h1>
        <p className="text-lg">
          This feature is currently being developed. Please check back later!
        </p>
      </div>
    </Layout>
  );
}
