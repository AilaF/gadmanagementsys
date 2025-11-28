import React, { useState, useEffect } from 'react';
import { User, Bell, Upload, Search, Eye, X } from 'lucide-react';
import { usePage, useForm, router } from '@inertiajs/react';
import Footer from "../../components/admin/Footer";
import EditProfileForm from "../../components/EditProfileForm";
import Layout from "../../components/enduser/layout";

export default function Home() {
    const { auth, documents: initialDocuments, filters, flash = {} } = usePage().props;
    const [documents, setDocuments] = useState(initialDocuments || []);
    const [activeTab, setActiveTab] = useState(filters?.status || 'All');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [showEditModal, setShowEditModal] = useState(false);

    // Simplified filteredDocuments initialization
    const [filteredDocuments, setFilteredDocuments] = useState(initialDocuments || []);

    //editprofile stuff
    const [formData, setFormData] = useState({
        fname: auth.user.fname || '',
        lname: auth.user.lname || '',
        email: auth.user.email || '',
        contactNo: auth.user.contactNo || '',
        address: auth.user.address || ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleEditProfileSubmit = (e) => {
        e.preventDefault();

        router.put(route('enduser.updateProfile'), formData, {
            onSuccess: () => {
                setShowEditModal(false);
            }
        });
    };

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    console.log('initialDocuments from backend:', initialDocuments);
    console.log('auth user:', auth);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        department: '',
        file_link: '',
        date_needed: ''
    });

    // Update documents state when initialDocuments changes
    useEffect(() => {
        if (initialDocuments && initialDocuments.length >= 0) {
            setDocuments(initialDocuments);
        }
    }, [initialDocuments]);

    // Filter documents based on tab and search - runs immediately and on changes
    useEffect(() => {
        let filtered = documents || [];

        if (activeTab !== 'All') {
            filtered = filtered.filter(doc => {
                if (activeTab === 'Completed') return doc.status === 'COMPLETED';
                if (activeTab === 'Pending') return doc.status === 'PENDING' || doc.status === 'UNASSIGNED';
                return true;
            });
        }

        if (searchTerm) {
            filtered = filtered.filter(doc =>
                doc.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredDocuments(filtered);
    }, [documents, activeTab, searchTerm]);

    // Pagination logic
    const totalItems = filteredDocuments.length;
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleRowsPerPageChange = (newRows) => {
        setRowsPerPage(newRows);
        setCurrentPage(1);
    };

    // Handle search with URL update
    const handleSearch = (term) => {
        setSearchTerm(term);
        router.get(route('dashboard'), {
            search: term,
            status: activeTab
        }, {
            preserveState: true,
            replace: true
        });
    };

    // Handle tab change with URL update
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        router.get(route('dashboard'), {
            search: searchTerm,
            status: tab
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleUploadSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        post(route('documents.store'), {
            onSuccess: (page) => {
                if (page.props.documents) {
                    setDocuments(page.props.documents);
                }

                reset();
                setShowUploadModal(false);
            },
            onError: (errors) => {
                console.log('Upload errors:', errors);
            }
        });
    };

    // local logout handler (Header also handles logout; define here to avoid undefined reference)
    const handleLogout = (e) => {
        e?.preventDefault?.();
        e?.stopPropagation?.();
        router.post(route('logout'));
    };

    // Add event handler for modal close
    const handleModalClose = (e, setModalState) => {
        e.preventDefault();
        e.stopPropagation();
        setModalState(false);
    };

    // Add event handler for view document
    const handleViewDocument = (e, fileLink) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(fileLink, '_blank');
    };

    // Handle view document details modal
    const handleViewDocumentDetails = (e, document) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedDocument(document);
        setShowViewModal(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-800';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'UNASSIGNED': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Debug log (remove this in production)
    console.log('Render state:', {
        documents: documents?.length,
        filteredDocuments: filteredDocuments?.length,
        activeTab,
        searchTerm
    });

    return (
        <Layout onProfileClick={() => setShowProfileModal(true)}>
            <div className="px-6 py-8">
                {/* Welcome Section */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome, {auth.user.fname}!
                    </h1>
                    <p className="text-gray-600">
                        Manage your submitted documents and track their progress
                    </p>
                </div>

                {/* Search and Upload Section */}
                <div className="flex justify-between items-center mb-6">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search your documents..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowUploadModal(true);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                        <Upload size={18} />
                        <span>Upload Document</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-8 mb-6 border-b">
                    {['All', 'Completed', 'Pending'].map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => handleTabChange(tab)}
                            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab
                                ? 'border-purple-600 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Documents Section */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">My Documents</h2>
                    </div>

                    {/* Table Header */}
                    <div className="px-6 py-3 border-b bg-gray-50 grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                        <div className="col-span-5">Document Title</div>
                        <div className="col-span-2">Date Submitted</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2">File Link</div>
                        <div className="col-span-1">View</div>
                    </div>

                    {/* Document List */}
                    <div className="divide-y">
                        {paginatedDocuments.map((doc) => (
                            <div key={doc.papsID} className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50">
                                <div className="col-span-5">
                                    <a
                                        href={doc.file_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-purple-600 hover:text-purple-800"
                                    >
                                        {doc.title}
                                    </a>
                                </div>

                                <div className="col-span-2 text-gray-600">
                                    {doc.dateSubmitted}
                                </div>
                                <div className="col-span-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                                        {doc.status}
                                    </span>
                                </div>
                                <div className="col-span-2">
                                    <button
                                        type="button"
                                        onClick={(e) => handleViewDocument(e, doc.file_link)}
                                        className="text-purple-600 hover:text-purple-800 text-sm underline"
                                    >
                                        Open Link
                                    </button>
                                </div>
                                <div className="col-span-1">
                                    <button
                                        type="button"
                                        onClick={(e) => handleViewDocumentDetails(e, doc)}
                                        className="text-gray-400 hover:text-gray-600 p-1"
                                        title="View Details"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredDocuments.length === 0 && (
                        <div className="px-6 py-12 text-center text-gray-500">
                            <p>No documents found</p>
                            <p className="text-sm mt-1">Upload your first document to get started</p>
                        </div>
                    )}
                </div>

                {/* Pagination Footer */}
                <Footer
                    currentPage={currentPage}
                    totalPages={totalPages}
                    rowsPerPage={rowsPerPage}
                    totalItems={totalItems}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Upload Document</h3>
                            <button
                                type="button"
                                onClick={(e) => handleModalClose(e, setShowUploadModal)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <p className="text-gray-600 mb-6 text-sm">
                            Please fill out the form below with the necessary project details.
                            Make sure to provide accurate information, including the project
                            title, department and the link to the supporting document.
                        </p>

                        <form onSubmit={handleUploadSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Project Title
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date Needed
                                </label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    value={data.date_needed}
                                    onChange={e => setData('date_needed', e.target.value)}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Select the date when you need this document to be completed
                                </p>
                                {errors.date_needed && <p className="text-red-500 text-xs mt-1">{errors.date_needed}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Department
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    value={data.department}
                                    onChange={e => setData('department', e.target.value)}
                                >
                                    <option value="" disabled>Select Department</option>
                                    <option value="CAS">CAS - College of Arts and Sciences</option>
                                    <option value="CED">CED - College of Education</option>
                                    <option value="CoE">CoE - College of Engineering</option>
                                    <option value="CIC">CIC - College of Information and Computing</option>
                                    <option value="CBA">CBA - College of Business Administration</option>
                                    <option value="CAEc">CAEc - College of Applied Economics</option>
                                    <option value="CoT">CoT - College of Technology</option>
                                </select>
                                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    File Link
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://drive.google.com/..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    value={data.file_link}
                                    onChange={e => setData('file_link', e.target.value)}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Please provide a valid URL (Google Drive, etc.)
                                </p>
                                {errors.file_link && <p className="text-red-500 text-xs mt-1">{errors.file_link}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-2 px-4 rounded-lg transition-colors"
                            >
                                {processing ? 'Submitting...' : 'Submit Document'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* View Document Details Modal */}
            {showViewModal && selectedDocument && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-lg w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Document Details</h3>
                            <button
                                type="button"
                                onClick={(e) => handleModalClose(e, setShowViewModal)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Project Title
                                </label>
                                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                    {selectedDocument.title}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department
                                </label>
                                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                    {selectedDocument.department}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <div className="bg-gray-50 px-3 py-2 rounded-lg">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedDocument.status)}`}>
                                        {selectedDocument.status}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date Submitted
                                </label>
                                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                    {selectedDocument.dateSubmitted}
                                </p>
                            </div>

                            {selectedDocument.date_needed && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date Needed
                                    </label>
                                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                        {selectedDocument.date_needed}
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    File Link
                                </label>
                                <div className="bg-gray-50 px-3 py-2 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={(e) => handleViewDocument(e, selectedDocument.file_link)}
                                        className="text-purple-600 hover:text-purple-800 underline"
                                    >
                                        Open Document
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={(e) => handleModalClose(e, setShowViewModal)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Profile</h3>
                            <button
                                type="button"
                                onClick={(e) => handleModalClose(e, setShowProfileModal)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <User size={32} className="text-purple-600" />
                            </div>
                            <h4 className="text-xl font-semibold">{auth.user.fname} {auth.user.lname}</h4>
                            <p className="text-gray-600">{auth.user.email}</p>
                        </div>

                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() => setShowEditModal(true)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                Edit Profile
                                </button>
                            <button
                                type="button"
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                Change Password
                            </button>
                            <button
                                type="button"
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                Account Settings
                            </button>
                            <hr className="my-2" />
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
             <div className="fixed inset-0 bg-black bg-opacity-0 flex justify-center items-center p-4 z-50">
             <EditProfileForm setShowEditModal={setShowEditModal} user={auth.user} />
           </div>
           )}
        </Layout>
    );
}