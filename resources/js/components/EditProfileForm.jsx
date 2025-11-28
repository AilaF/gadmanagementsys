import { useForm, usePage } from "@inertiajs/react";
import React from "react";
import { X } from "lucide-react";

export default function EditProfileForm({ setShowEditModal, user }) {
    const { flash } = usePage().props;

    const { data, setData, put, processing, errors, reset } = useForm({
        fname: user?.fname || "",
        lname: user?.lname || "",
        mname: user?.mname || "",
        dob: user?.dob || "",
        sex: user?.sex || "",
        contactNo: user?.contactNo || "",
        email: user?.email || "",
        address: user?.address || "",
        orgname: user?.orgname || "",
    });

    const handleModalClose = (e) => {
        e.preventDefault();
        reset();
        setShowEditModal(false);
    };

    const handleEditProfileSubmit = (e) => {
        e.preventDefault();

        put(route("enduser.update", user.userID), {
            preserveScroll: true,
            onSuccess: () => {
                alert("✅ Profile updated successfully!");
                setShowEditModal(false);
            },
            onError: (err) => {
                console.error("Error updating:", err);
                alert("⚠️ Failed to update profile. Please check your inputs.");
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[70vh] flex flex-col relative">
                
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-20 rounded-t-3xl">
                    <h3 className="text-lg font-semibold">Edit Profile</h3>
                    <button
                        type="button"
                        onClick={handleModalClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Form */}
                <form
                    id="editForm"  // ✅ Important fix — connects to submit button
                    onSubmit={handleEditProfileSubmit}
                    className="flex-1 overflow-y-auto p-6 space-y-4"
                >
                    {/* Name fields in one row */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="lname"
                                value={data.lname}
                                onChange={(e) => setData("lname", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                            {errors.lname && <p className="text-red-500 text-xs">{errors.lname}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="fname"
                                value={data.fname}
                                onChange={(e) => setData("fname", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                            {errors.fname && <p className="text-red-500 text-xs">{errors.fname}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">M.I.</label>
                            <input
                                type="text"
                                name="mname"
                                value={data.mname}
                                onChange={(e) => setData("mname", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                            {errors.mname && <p className="text-red-500 text-xs">{errors.mname}</p>}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <select
                            name="orgname"
                            value={data.orgname}
                            onChange={(e) => setData("orgname", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        >
                            <option value="">Select Department</option>
                            <option value="CAS - College of Arts and Sciences">CAS - College of Arts and Sciences</option>
                            <option value="CED - College of Education">CED - College of Education</option>
                            <option value="CoE - College of Engineering">CoE - College of Engineering</option>
                            <option value="CIC - College of Information and Computing">CIC - College of Information and Computing</option>
                            <option value="CBA - College of Business Administration">CBA - College of Business Administration</option>
                            <option value="CAEc - College of Applied Economics">CAEc - College of Applied Economics</option>
                            <option value="CT - College of Technology">CT - College of Technology</option>
                        </select>
                        {errors.orgname && <p className="text-red-500 text-xs">{errors.orgname}</p>}
                    </div>

                    {/* Sex */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sex</label>
                        <select
                            name="sex"
                            value={data.sex}
                            onChange={(e) => setData("sex", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        >
                            <option value="">Select</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                        {errors.sex && <p className="text-red-500 text-xs">{errors.sex}</p>}
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={data.dob}
                            onChange={(e) => setData("dob", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                        {errors.dob && <p className="text-red-500 text-xs">{errors.dob}</p>}
                    </div>

                    {/* Contact Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contact No.</label>
                        <input
                            type="text"
                            name="contactNo"
                            value={data.contactNo}
                            onChange={(e) => setData("contactNo", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                        {errors.contactNo && <p className="text-red-500 text-xs">{errors.contactNo}</p>}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={data.address}
                            onChange={(e) => setData("address", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                        {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                    </div>
                </form>

                {/* Footer */}
                <div className="flex justify-end p-4 border-t bg-white rounded-b-3xl sticky bottom-0">
                    <button
                        type="submit"
                        form="editForm" // ✅ connected to form above
                        disabled={processing}
                        className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                        {processing ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
