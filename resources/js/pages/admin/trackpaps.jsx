  import React, { useState, useMemo } from "react";
  import Layout from "../../components/admin/layout";
  import { usePage, router } from "@inertiajs/react";
  import { UserCog, Search, X, User } from "lucide-react";
  import Footer from "../../components/admin/Footer";

  export default function TrackPaps() {
    const { paps, evaluators } = usePage().props; 
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("Unassigned");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(6);

    // Modal state
    const [selectedPap, setSelectedPap] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvaluators, setSelectedEvaluators] = useState([]);

    // Handle sidebar navigation
    const handleNavigate = (page) => {
      const routes = {
        dashboard: "admin.home",
        manageusers: "admin.manageusers",
        trackpaps: "admin.trackpaps",
        scorecard: "admin.scorecard",
        reports: "admin.reports",
      };
      const routeName = routes[page];
      if (routeName) router.get(route(routeName));
    };

    // Status color
    const getStatusClasses = (status) => {
      switch (status) {
        case "Completed":
          return "text-green-600";
        case "Pending":
        case "Unassigned":
          return "text-gray-500";
        default:
          return "text-gray-500";
      }
    };

    console.log("Evaluators:", evaluators);

    // Filter logic
    const filteredPaps = useMemo(() => {
      return (paps || []).filter((pap) => {
        const matchesFilter =
          activeFilter === "All" || pap.status === activeFilter;
        const matchesSearch = pap.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
      });
    }, [paps, activeFilter, searchTerm]);

    // ✅ Add this right below
    const filteredEvaluators = useMemo(() => {
      return (evaluators || []).filter((ev) =>
        ev.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [evaluators, searchTerm]);

    // Pagination logic
    const totalItems = filteredPaps.length;
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    const paginatedData = filteredPaps.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );

    const handleRowsPerPageChange = (value) => {
      setRowsPerPage(value);
      setCurrentPage(1);
    };

    const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    // ✅ Open modal with PAP data
    const handleAssignEvaluatorClick = (pap) => {
      setSelectedPap(pap);
      setShowModal(true);
    };

    // Handle assigning evaluator(s)
    const handleAssignEvaluator = () => {
      if (!selectedPap || !selectedEvaluators || selectedEvaluators.length < 3) {
        alert("Please select at least 3 evaluators before assigning.");
        return;
      }

      router.post(
        route("admin.assignEvaluator"),
        {
          papsID: String(selectedPap.papsID || selectedPap.id),
          evaluatorIDs: selectedEvaluators,
        },
        {
          onSuccess: () => {
            setShowModal(false);
            setSelectedPap(null);
            setSelectedEvaluators([]);
            alert("Evaluators successfully assigned!");
          },
          onError: (errors) => {
            console.error("Error assigning evaluators:", errors);
            alert("Failed to assign evaluators. Check console for details.");
          },
        }
      );
    };

    const filterButtons = ["Unassigned", "Pending", "Completed", "All"];

    return (
      <Layout onNavigate={handleNavigate}>
        {/* Search + Filter */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Filter Buttons */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg">
              {filterButtons.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                    activeFilter === filter
                      ? "bg-white text-[#8b5cf6] shadow"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Doc No",
                  "Title",
                  "College/Unit",
                  "Submitted By",
                  "Email",
                  "Date Submitted",
                  "Status",
                  "File",
                  "Assign Evaluator",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`transition ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-100"
                    } hover:bg-purple-50`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">{item.docNo}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.collegeUnit}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.dateSubmitted}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-medium ${getStatusClasses(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <a
                        href={item.fileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8b5cf6] hover:text-[#7c3aed] hover:underline"
                      >
                        View File
                      </a>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleAssignEvaluatorClick(item)}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                      >
                        <UserCog className="w-5 h-5 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-16 text-center text-gray-500">
                    No PAPs match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal for Assign Evaluator */}
        {showModal && selectedPap && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl p-6 shadow-lg relative">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Assign Evaluator — <span className="text-[#8b5cf6]">{selectedPap.title}</span>
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search evaluator..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-[#8b5cf6] outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Table */}
              <div className="overflow-y-auto max-h-[400px] border rounded-lg">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="p-3 text-gray-500 font-medium">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEvaluators(filteredEvaluators.map((ev) => ev.id));
                            } else {
                              setSelectedEvaluators([]);
                            }
                          }}
                          checked={
                            filteredEvaluators.length > 0 &&
                            selectedEvaluators.length === filteredEvaluators.length
                          }
                        />
                      </th>
                      <th className="p-3 text-gray-500 font-medium">Name</th>
                      <th className="p-3 text-gray-500 font-medium">Expertise</th>
                      <th className="p-3 text-gray-500 font-medium">Department</th>
                      <th className="p-3 text-gray-500 font-medium">Activity Log</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvaluators.length > 0 ? (
                      filteredEvaluators.map((ev) => (
                        <tr
                          key={ev.id}
                          className="hover:bg-purple-50 border-b transition"
                        >
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={selectedEvaluators.includes(ev.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedEvaluators((prev) => [...prev, ev.id]);
                                } else {
                                  setSelectedEvaluators((prev) =>
                                    prev.filter((id) => id !== ev.id)
                                  );
                                }
                              }}
                            />
                          </td>
                          <td className="p-3 text-gray-800">{ev.name}</td>
                          <td className="p-3 text-gray-600">{ev.expertise}</td>
                          <td className="p-3 text-gray-600">{ev.department}</td>
                          <td className="p-3 text-gray-600">{ev.lastActive}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center p-6 text-gray-500">
                          No evaluators found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">
                  Selected: {selectedEvaluators.length} / Minimum required: 3
                </p>
                  <button
                    disabled={selectedEvaluators.length < 3}
                    onClick={() => {
                      if (!selectedPap) {
                        alert("No PAP selected.");
                        return;
                      }

                      router.post(
                        route("admin.assignEvaluator"), // ✅ correct route name
                        {
                          papsID: selectedPap.id, // ✅ match controller field
                          evaluatorIDs: selectedEvaluators, // ✅ must be array
                        },
                        {
                          onSuccess: () => {
                            setShowModal(false);
                            setSelectedEvaluators([]);
                            setSelectedPap(null);
                            alert("Evaluators successfully assigned!");
                          },
                          onError: (errors) => {
                            console.error("Error assigning evaluators:", errors);
                            alert("Failed to assign evaluators. Check console for details.");
                          },
                        }
                      );
                    }}
                    className={`px-5 py-2 rounded-lg text-white font-medium transition ${
                      selectedEvaluators.length >= 3
                        ? "bg-[#8b5cf6] hover:bg-[#7c3aed]"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Assign
                  </button>

              </div>
            </div>
          </div>
        )}


        <Footer
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Layout>
    );
  }
