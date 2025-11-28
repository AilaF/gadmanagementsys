import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import Layout from "@/components/evaluator/layout";
import "../../../css/globalstyles.css"; // adjust path if needed

const Home = () => {
  const { paps: initialPaps = [], auth = {} } = usePage().props;

  const [searchTerm, setSearchTerm] = useState("");
  const [paps, setPaps] = useState(initialPaps || []);
  const [filteredPaps, setFilteredPaps] = useState(initialPaps || []);

  useEffect(() => {
    setPaps(initialPaps || []);
    setFilteredPaps(initialPaps || []);
  }, [initialPaps]);

  useEffect(() => {
    const term = (searchTerm || "").trim().toLowerCase();
    if (!term) {
      setFilteredPaps(paps);
      return;
    }
    setFilteredPaps(
      (paps || []).filter((item) => {
        return (
          (item.title || "").toString().toLowerCase().includes(term) ||
          (item.papsID || "").toString().toLowerCase().includes(term) ||
          (item.college || "").toString().toLowerCase().includes(term)
        );
      })
    );
  }, [searchTerm, paps]);

  // 🔹 Placeholder action for Unassigned button
  const handleAssignClick = (papsID) => {
    alert(`Placeholder: Assign evaluators for PAP ${papsID}`);
    // In future: open modal or navigate to assign evaluator page
    // router.visit(`/assign-evaluator/${papsID}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 font-sans">
        <div style={{ padding: "30px" }}>
          {/* Welcome Section */}
          <div className="fade-in" style={{ marginBottom: "30px" }}>
            <p
              style={{
                color: "#8b5cf6",
                fontSize: "14px",
                fontWeight: 500,
                letterSpacing: "1px",
                marginBottom: "5px",
                margin: 0,
              }}
            >
              WELCOME,
            </p>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#2d3748",
                background: "linear-gradient(135deg, #8b5cf6, #9F7AEA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                margin: "8px 0",
              }}
              className="text-3xl md:text-4xl font-bold"
            >
              Evaluator!
            </h1>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "16px",
                flex: 1,
                minWidth: "200px",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px 0",
                  color: "#6b7280",
                  fontSize: "13px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.025em",
                }}
              >
                Documents Evaluated
              </p>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#8b5cf6",
                  lineHeight: 1,
                }}
              >
                0
              </div>
            </div>

            <div
              style={{
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "16px",
                flex: 1,
                minWidth: "200px",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px 0",
                  color: "#6b7280",
                  fontSize: "13px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.025em",
                }}
              >
                Pending Evaluations
              </p>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#8b5cf6",
                  lineHeight: 1,
                }}
              >
                0
              </div>
            </div>
          </div>

          {/* Tabs + Search */}
          <div className="border-b border-gray-200 pb-4 mb-6 flex flex-wrap justify-between items-center gap-4">
            <div className="flex">
              <button className="px-5 py-2 font-medium text-sm border-b-2 border-purple-500 text-purple-600">
                For Evaluation
              </button>
              <button className="px-5 py-2 font-medium text-sm text-gray-500 hover:text-gray-700 transition">
                Completed
              </button>
              <button className="px-5 py-2 font-medium text-sm text-gray-500 hover:text-gray-700 transition">
                All
              </button>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg w-[400px] focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
              />
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <span className="text-sm text-gray-600 font-medium">
                  Newest First
                </span>
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  className="text-purple-600"
                >
                  <path
                    d="M7,3 L7,21 M7,3 L11,7 M7,3 L3,7 M17,21 L17,3 M17,21 L21,17 M17,21 L13,17"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto max-h-[400px]">
              <table className="min-w-full text-sm text-gray-700">
                <thead>
                  <tr>
                    <th className="p-3 text-left font-semibold uppercase text-xs tracking-wide">
                      Doc. No
                    </th>
                    <th className="p-3 text-left font-semibold uppercase text-xs tracking-wide">
                      College/Unit
                    </th>
                    <th className="p-3 text-left font-semibold uppercase text-xs tracking-wide">
                      Title
                    </th>
                    <th className="p-3 text-left font-semibold uppercase text-xs tracking-wide">
                      Date Submitted
                    </th>
                    <th className="p-3 text-left font-semibold uppercase text-xs tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPaps.length > 0 ? (
                    filteredPaps.map((paps, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition">
                        <td className="p-3">{paps.papsID}</td>
                        <td className="p-3">{paps.college}</td>
                        <td className="p-3 truncate max-w-[250px]">{paps.title}</td>
                        <td className="p-3">{paps.dateSubmitted}</td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              paps.status === "COMPLETED"
                                ? "bg-green-100 text-green-700"
                                : paps.status === "FOR EVALUATION"
                                ? "bg-yellow-100 text-yellow-700"
                                : paps.status === "FOR EVALUATION"
                                ? "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer transition"
                                : "bg-gray-100 text-gray-500"
                            }`}
                            onClick={() =>
                              paps.status === "FOR EVALUATION" ? handleAssignClick(paps.papsID) : null
                            }
                          >
                            {paps.status || "UNKNOWN"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-10 text-gray-400 italic"
                      >
                        No documents found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
