import React from "react";

const AddItemModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const itemData = Object.fromEntries(formData.entries());
    onSubmit(itemData);
    onClose();
  };

  return (
    <div
      className="additem-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="additem-modal-content bg-white p-6 rounded-xl shadow-xl w-[500px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="close absolute top-3 right-4 text-2xl cursor-pointer text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </span>
        <h2 className="text-center text-xl font-semibold mb-4">
          Add New Item
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="block font-medium mb-1" htmlFor="item">
              Item Text:
            </label>
            <textarea
              id="item"
              name="item"
              rows="3"
              required
              className="w-full border border-gray-300 rounded-md p-2"
            ></textarea>
          </div>

          <div className="form-group mb-3">
            <label className="block font-medium mb-1" htmlFor="subitem">
              Subitem:
            </label>
            <textarea
              id="subitem"
              name="subitem"
              rows="1"
              className="w-full border border-gray-300 rounded-md p-2"
            ></textarea>
          </div>

          <div className="form-row grid grid-cols-3 gap-3 mb-3">
            <div className="form-group">
              <label className="block font-medium mb-1" htmlFor="yesValue">
                Yes Value:
              </label>
              <input
                type="number"
                id="yesValue"
                name="yesValue"
                step="0.01"
                required
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="form-group">
              <label className="block font-medium mb-1" htmlFor="noValue">
                No Value:
              </label>
              <input
                type="number"
                id="noValue"
                name="noValue"
                step="0.01"
                required
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="form-group">
              <label className="block font-medium mb-1" htmlFor="partlyValue">
                Partly Value:
              </label>
              <input
                type="number"
                id="partlyValue"
                name="partlyValue"
                step="0.01"
                required
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          <div className="text-right mt-6">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#8b5cf6] text-white rounded-md hover:bg-[#6a4a8d]"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
