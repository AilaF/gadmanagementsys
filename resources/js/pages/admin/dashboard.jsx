import React from "react";
import Layout from "../../components/admin/layout";
import { router } from "@inertiajs/react";
import { Wrench } from "lucide-react"; // Changed icon to Wrench

// The component now only returns its specific content
function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center text-gray-500">
      <Wrench className="w-20 h-20 mb-6 text-gray-500" strokeWidth={1.5} />
      <h1 className="text-3xl font-bold text-gray-700 mb-2">
        Under Construction
      </h1>
      <p className="text-lg">
        This feature is currently being developed. Please check back later!
      </p>
    </div>
  );
}

// Define the layout as a property on the component
DashboardPage.layout = (page) => {
  const handleNavigate = (pageName) => {
    const routes = {
      dashboard: "admin.home",
      manageusers: "admin.manageusers",
      trackpaps: "admin.trackpaps",
      scorecard: "admin.scorecard",
      reports: "admin.reports",
    };
    const routeName = routes[pageName];
    if (routeName) {
      router.get(route(routeName));
    }
  };

  // The Layout component wraps the page content
  return <Layout onNavigate={handleNavigate} children={page} />;
};

export default DashboardPage;
