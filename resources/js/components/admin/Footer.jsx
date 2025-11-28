import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const Footer = ({
  currentPage,
  totalPages,
  rowsPerPage,
  totalItems,
  onPageChange,
  onRowsPerPageChange,
}) => {
  // Fix: Safely calculate pagination display range
  const startEntry =
    totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-6 py-3 text-gray-700">
      {/* Rows per page selector */}
      <div className="flex items-center space-x-2">
        <span>Show</span>
        <select
        value={rowsPerPage}
        onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 bg-white focus:ring-1 focus:ring-gray-400 focus:outline-none appearance-none pr-8"
        style={{
            backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='gray' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M6 9l6 6 6-6' /%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.5rem center",
            backgroundSize: "1rem",
        }}
        >
        {[5, 6, 8, 10, 15, 20].map((num) => (
            <option key={num} value={num}>
            {num}
            </option>
        ))}
        </select>
        <span>entries</span>
      </div>

      {/* Showing count */}
      <div className="text-sm my-2 sm:my-0">
        showing <strong>{startEntry}</strong> to <strong>{endEntry}</strong> out of{" "}
        <strong>{totalItems}</strong> entries
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 border rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="px-3 text-sm">
          {currentPage} / {totalPages || 1}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-2 border rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-2 border rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Footer;
