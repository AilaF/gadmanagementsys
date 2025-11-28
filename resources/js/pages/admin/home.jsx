import React, { useState } from "react";
import Layout from "../../components/admin/layout";
import Dashboard from "./dashboard";
import ManageUsers from "./manageusers";
import TrackPaps from "./trackpaps";
import Scorecard from "./scorecard";
import Reports from "./reports";

const Home = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "manageusers":
        return <ManageUsers />;
      case "trackpaps":
        return <TrackPaps />;
      case "scorecard":
        return <Scorecard />;
      case "reports":
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};




export default Home;
