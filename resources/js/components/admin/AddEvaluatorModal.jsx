import React, { useState } from "react";
import { router } from "@inertiajs/react";

const AddEvaluatorModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    department: "",
    expertise: "",
    sex: "",
    contactNo: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("⏳ Saving evaluator...");

    router.post(route("admin.saveEvaluator"), formData, {
      onSuccess: (page) => {
        const successMsg = page.props?.flash?.success;
        setMessage(successMsg || "✅ Evaluator added successfully!");
        setFormData({
          fname: "",
          lname: "",
          email: "",
          department: "",
          expertise: "",
          sex: "",
          contactNo: "",
        });
      },
      onError: (errors) => {
        setMessage(
          `❌ ${
            Object.values(errors)[0] ||
            "Error occurred while adding evaluator."
          }`
        );
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 overflow-y-auto py-6">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg animate-fadeIn mx-4 sm:mx-0">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#8b5cf6] text-white px-5 py-3 rounded-t-lg sticky top-0">
          <h3 className="text-lg font-semibold">Add New Evaluator</h3>
          <button
            onClick={onClose}
            className="text-xl font-bold hover:text-gray-200 transition"
          >
            ×
          </button>
        </div>

        {/* Scrollable Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              placeholder="Enter last name"
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#8b5cf6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              placeholder="Enter first name"
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#8b5cf6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#8b5cf6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#8b5cf6]"
            >
              <option value="" disabled>
                Select Department
              </option>
              <option value="CAS">CAS - College of Arts and Sciences</option>
              <option value="CED">CED - College of Education</option>
              <option value="CoE">CoE - College of Engineering</option>
              <option value="CIC">CIC - College of Information and Computing</option>
              <option value="CBA">CBA - College of Business Administration</option>
              <option value="CAEc">CAEc - College of Applied Economics</option>
              <option value="CoT">CoT - College of Technology</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Expertise
            </label>
            <input
              type="text"
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              placeholder="Enter expertise"
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#8b5cf6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sex</label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#8b5cf6]"
            >
              <option value="" disabled>
                Select Sex
              </option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="N">Prefer not to say</option>
            </select>
          </div>


          <div>
            <label className="block text-sm font-medium mb-1">Contact No.</label>
            <input
              type="text"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              placeholder="Enter contact number"
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#8b5cf6]"
            />
          </div>

          {/* Button */}
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="bg-[#8b5cf6] text-white px-6 py-2 rounded-md hover:bg-[#7c3aed] transition"
            >
              Add Evaluator
            </button>
          </div>

          {message && (
            <div className="mt-3 bg-green-100 border border-green-400 text-green-800 p-2 rounded">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddEvaluatorModal;
