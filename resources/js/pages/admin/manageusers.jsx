import React, { useState } from "react";
import Layout from "../../components/admin/layout";
import { router } from "@inertiajs/react";
import AddEvaluatorModal from "../../components/admin/AddEvaluatorModal";
import DescriptionModal from "../../components/admin/DescriptionModal";
import Footer from "../../components/admin/Footer";
import { Plus, Eye } from "lucide-react";

export default function ManageUsers({ allUsers }) {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);

  // ✅ LIVE REFRESH (fix)
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1); // trigger rerender safely
    }, 1000);
    return () => clearInterval(interval);
  }, []); // important: NO dependencies

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);

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

  // Filtered Users
  const filteredUsers = allUsers.filter((user) => {
    if (filter !== "All" && user.role !== filter) return false;
    if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      return false;
    if (filter === "Evaluator" && collegeFilter && user.department !== collegeFilter)
      return false;
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredUsers.length);
  const usersToShow = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowDescriptionModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      router.delete(route("admin.deleteuser", { id: userId }));
    }
  };

  return (
    <Layout onNavigate={handleNavigate}>

      {/* Filters and Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          {["All", "End User", "Evaluator"].map((role) => (
            <button
              key={role}
              onClick={() => {
                setFilter(role);
                setCollegeFilter("");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === role
                  ? "bg-[#8b5cf6] text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {role === "All" ? "All Users" : `${role}s`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#8b5cf6] focus:outline-none"
          />

          {filter === "Evaluator" && (
            <select
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#8b5cf6] focus:outline-none"
            >
              <option value="">All Colleges</option>
              <option value="CAS">CAS</option>
              <option value="CED">CED</option>
              <option value="CoE">CoE</option>
              <option value="CIC">CIC</option>
              <option value="CBA">CBA</option>
              <option value="CAEc">CAEc</option>
              <option value="CoT">CoT</option>
            </select>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Role", "Designation", "Date Joined", "Status", "Details"].map(
                (head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usersToShow.length > 0 ? (
              usersToShow.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-700">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">{user.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {user.role === "End User" ? "-" : user.department || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">
                    {user.date_joined}
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    {(() => {
                      try {
                        if (!user.last_active) return <span className="text-gray-500">Inactive</span>;

                        const parseLastActive = (val) => {
                          if (!val) return null;
                          if (typeof val === "number") {
                            return new Date(val < 1e12 ? val * 1000 : val);
                          }
                          return new Date(val);
                        };

                        const lastActiveDate = parseLastActive(user.last_active);
                        
                        if (!lastActiveDate || isNaN(lastActiveDate.getTime())) {
                          console.warn(`Invalid last_active date for user ${user.id}:`, user.last_active);
                          return <span className="text-gray-500">Inactive</span>;
                        }

                        const now = new Date();
                        const diffMs = now - lastActiveDate;
                        const diffMinutes = Math.floor(diffMs / 60000);
                        const diffHours = Math.floor(diffMinutes / 60);
                        const diffDays = Math.floor(diffHours / 24);

                        if (diffDays >= 30) {
                          return <span className="text-red-500">Inactive</span>;
                        } else if (diffDays >= 7) {
                          return <span className="text-orange-500">{diffDays} days ago</span>;
                        } else if (diffDays >= 1) {
                          return <span className="text-yellow-600">{diffDays} day{diffDays > 1 ? 's' : ''} ago</span>;
                        } else if (diffHours >= 1) {
                          return <span className="text-green-600">{diffHours} hour{diffHours > 1 ? 's' : ''} ago</span>;
                        } else if (diffMinutes >= 1) {
                          return <span className="text-green-600">{diffMinutes} min{diffMinutes > 1 ? 's' : ''} ago</span>;
                        }
                        return <span className="text-green-600">Just now</span>;
                      } catch (error) {
                        console.error('Error displaying last_active:', error);
                        return <span className="text-gray-500">Unknown</span>;
                      }
                    })()}
                  </td> 
                    
                  <td className="px-6 py-4 text-center align-middle">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="inline-flex items-center justify-center text-gray-600 hover:text-[#8b5cf6] transition translate-y-[2px]"
                      title="View User"
                    >
                      <Eye size={20} strokeWidth={1.75} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-16">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Footer
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredUsers.length}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-6 right-6 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white p-4 rounded-full shadow-lg transition transform hover:scale-110"
          title="Add Evaluator"
        >
          <Plus size={24} strokeWidth={2.25} />
        </button>
      

      {showAddModal && <AddEvaluatorModal onClose={() => setShowAddModal(false)} />}
      {showDescriptionModal && (
        <DescriptionModal
          isOpen={showDescriptionModal}
          onClose={() => setShowDescriptionModal(false)}
          user={selectedUser}
          onDelete={handleDeleteUser}
        />
      )}
    </Layout>
  );
}
