import React from "react";

const DescriptionModal = ({ isOpen, onClose, user, onDelete }) => {
  if (!isOpen || !user) return null;
  console.log("User data:", user);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-11/12 max-w-md shadow-lg animate-fadeIn">
        {/* Header */}
        <div className="bg-[#8b5cf6] text-white px-6 py-3 flex justify-between items-center rounded-t-2xl">
          <h3 className="text-lg font-semibold">User Account Information</h3>
          <button onClick={onClose} className="text-2xl leading-none">
            &times;
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4 px-6 py-4 border-b">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="avatar"
              className="w-12 h-12 rounded-full"
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{user.name}</h4>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-[#8b5cf6] font-medium">{user.role}</p>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-4 text-sm text-gray-700 space-y-2">
          <p>
            <strong>Status:</strong> {user.status}
          </p>
          {user.role === "Evaluator" && (
            <>
              <p>
                <strong>Department:</strong> {user.department || "—"}
              </p>
              <p>
                <strong>Expertise:</strong> {user.expertise || "—"}
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t flex justify-end">
            <button
            onClick={() => onDelete(user.id)} 
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
            Delete user
            </button>

        </div>
      </div>
    </div>
  );
};

export default DescriptionModal;
