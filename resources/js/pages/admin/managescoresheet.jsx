import React, { useState, useMemo } from "react";
import Layout from "../../components/admin/layout";
import { router } from "@inertiajs/react";
import AddItemModal from "@/components/admin/AddItemModal";
import "../../../css/globalstyles.css"; // adjust path if needed

export default function ManageScoresheet({ scoresheet = {} }) {
  const [sheet, setSheet] = useState(() => JSON.parse(JSON.stringify(scoresheet)) || {});
  const [addedItems, setAddedItems] = useState([]);
  const [editedItems, setEditedItems] = useState({});
  const [deletedItems, setDeletedItems] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // inline styles to match fonts/colors used across other admin pages
  const pageStyle = {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif",
    color: "#374151", // primary text color consistent with other pages
    lineHeight: 1.5,
  };

  const headingStyle = {
    color: "#8b5cf6",
    fontWeight: 700,
    marginBottom: "1rem",
  };

  const thStyle = {
    padding: "12px 16px",
    textAlign: "left",
    fontWeight: 600,
    color: "#ffffff",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };

  const tdStyle = {
    padding: "12px 16px",
    color: "#6b7280",
    verticalAlign: "middle",
    fontSize: "14px",
  };

  // helper: stable temp id
  const makeTempId = () => `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // called by AddItemModal on submit — ensure this stores the temp item into state
  const handleAddSubmit = (formData) => {
    const item = {
      itemID: formData.itemID || makeTempId(),
      item: (formData.item || "").trim() || "(No Parent)",
      subitem: formData.subitem || null,
      yesValue: formData.yesValue ?? 0,
      noValue: formData.noValue ?? 0,
      partlyValue: formData.partlyValue ?? 0,
    };

    setAddedItems((prev) => {
      const next = [...prev, item];
      next.sort((a, b) =>
        (a.item || "").toString().localeCompare((b.item || "").toString(), undefined, { numeric: true, sensitivity: "base" }) ||
        (a.subitem || "").toString().localeCompare((b.subitem || "").toString(), undefined, { numeric: true, sensitivity: "base" })
      );
      return next;
    });

    setIsAddOpen(false);
  };

  // combinedSheet merges existing + temp items and sorts parents and subitems for rendering
  const combinedSheet = useMemo(() => {
    const map = JSON.parse(JSON.stringify(sheet || {}));

    addedItems.forEach((it) => {
      const parentName = (it.item || "(No Parent)").toString();
      if (!map[parentName]) {
        map[parentName] = { parent: null, subitems: [] };
      }

      if (!it.subitem) {
        // if no subitem and no parent exists, treat as parent row
        if (!map[parentName].parent) {
          map[parentName].parent = it;
        } else {
          map[parentName].subitems.push(it);
        }
      } else {
        map[parentName].subitems.push(it);
      }
    });

    // sort groups and subitems
    const sorted = Object.entries(map)
      .sort(([a], [b]) => a.toString().localeCompare(b.toString(), undefined, { numeric: true, sensitivity: "base" }))
      .reduce((acc, [k, v]) => {
        acc[k] = {
          parent: v.parent,
          subitems: (v.subitems || []).slice().sort((x, y) =>
            (x.subitem || "").toString().localeCompare((y.subitem || "").toString(), undefined, { numeric: true, sensitivity: "base" })
          ),
        };
        return acc;
      }, {});

    return sorted;
  }, [sheet, addedItems]);

  // Save handler: include edited existing rows + added items (convert temp ids to null)
  const handleSave = () => {
    const editedArray = Object.values(editedItems || {}).map((e) => ({ ...e }));

    const addedForPayload = addedItems.map((a) => ({
      ...a,
      // server treats null/empty itemID as new row
      itemID: (typeof a.itemID === "string" && a.itemID.startsWith("temp_")) ? null : a.itemID,
    }));

    const payload = {
      editedItems: [...editedArray, ...addedForPayload],
      deletedItemIDs: deletedItems,
    };

    // debug: inspect what is being sent
    console.log("handleSave payload", payload);

    // send with router.post (ensure route name exists)
    router.post(route("admin.scoresheet.finalize"), payload);
  };

  // Delete a single row (parent or subitem) by itemID
  const handleDelete = (itemID) => {
    if (!confirm("Delete this item?")) return;

    // mark as deleted for server-side finalize
    setDeletedItems((prev) => Array.from(new Set([...prev, itemID])));

    // remove any matching temp added item immediately
    setAddedItems((prev) => prev.filter((i) => i.itemID !== itemID));

    // remove from existing sheet state (remove parent row or subitem only)
    setSheet((prev) => {
      const next = {};
      Object.entries(prev).forEach(([key, group]) => {
        const parentMatches = group.parent && group.parent.itemID === itemID;
        const filteredSub = (group.subitems || []).filter((s) => s.itemID !== itemID);

        // if parent was deleted and no subitems remain, drop the whole group
        if (parentMatches && filteredSub.length === 0) {
          return;
        }

        // build new group: if parentMatches remove parent (set null), keep filtered subitems
        next[key] = {
          parent: parentMatches ? null : group.parent,
          subitems: filteredSub,
        };
      });
      return next;
    });

    // remove any staged edits for that itemID
    setEditedItems((prev) => {
      const copy = { ...prev };
      delete copy[itemID];
      return copy;
    });
  };

  // helper to handle inline edits (ensure editedItems state is updated)
  const handleEditChange = (itemID, field, value) => {
    setEditedItems((prev) => {
      const existing = prev[itemID] ? { ...prev[itemID] } : {};
      existing[itemID] = existing.itemID ?? itemID;
      existing[field] = value;
      return { ...prev, [itemID]: existing };
    });
  };

  return (
    <Layout>
      <div className="gap-4" style={pageStyle}>
        

        <div className="overflow-x-auto rounded-xl shadow bg-white">
          <table className="min-w-full border-collapse" style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Elements and Items / Questions
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider w-[7%]">Yes</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider w-[7%]">No</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider w-[7%]">Partly</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider w-[15%]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {Object.keys(combinedSheet).length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-10"
                    style={{ ...tdStyle, textAlign: "center", color: "#9ca3af", fontStyle: "italic" }}
                  >
                    No items found.
                  </td>
                </tr>
              )}

              {/* Existing sheet: sort parents by parent.item, sort subitems by subitem */}
              {Object.entries(combinedSheet)
                .sort(([keyA, groupA], [keyB, groupB]) => {
                  const a = (groupA?.parent?.item || keyA).toString();
                  const b = (groupB?.parent?.item || keyB).toString();
                  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
                })
                .map(([item, group]) => (
                  <React.Fragment key={item}>
                    {/* Parent Row */}
                    <tr className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4 font-semibold" style={tdStyle}>
                        <input
                          type="text"
                          value={editedItems[group.parent?.itemID]?.item ?? group.parent?.item ?? ""}
                          onChange={(e) =>
                            handleEditChange(group.parent.itemID, "item", e.target.value)
                          }
                          className="border rounded px-3 h-10 w-full font-semibold"
                          style={{ color: "#374151", boxSizing: "border-box" }}
                        />
                      </td>

                      {/* If parent has no subitems, show editable scores */}
                      {(!group.subitems || group.subitems.length === 0) ? (
                        <>
                          <td className="py-2 px-4 text-center" style={tdStyle}>
                            <input
                              type="number"
                              value={editedItems[group.parent.itemID]?.yesValue ?? group.parent?.yesValue ?? ""}
                              onChange={(e) =>
                                handleEditChange(group.parent.itemID, "yesValue", e.target.value)
                              }
                              className="border rounded w-16 text-center h-10 px-1"
                              style={{ textAlign: "center", boxSizing: "border-box" }}
                            />
                          </td>
                          <td className="py-2 px-4 text-center" style={tdStyle}>
                            <input
                              type="number"
                              value={editedItems[group.parent.itemID]?.noValue ?? group.parent?.noValue ?? ""}
                              onChange={(e) =>
                                handleEditChange(group.parent.itemID, "noValue", e.target.value)
                              }
                              className="border rounded w-16 text-center h-10 px-1"
                              style={{ textAlign: "center", boxSizing: "border-box" }}
                            />
                          </td>
                          <td className="py-2 px-4 text-center" style={tdStyle}>
                            <input
                              type="number"
                              value={editedItems[group.parent.itemID]?.partlyValue ?? group.parent?.partlyValue ?? ""}
                              onChange={(e) =>
                                handleEditChange(group.parent.itemID, "partlyValue", e.target.value)
                              }
                              className="border rounded w-16 text-center h-10 px-1"
                              style={{ textAlign: "center", boxSizing: "border-box" }}
                            />
                          </td>
                          <td className="py-2 px-4 text-center text-gray-400 italic" style={tdStyle}>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm("Delete this item? This will remove the parent item.")) {
                                  handleDelete(group.parent.itemID);
                                }
                              }}
                              className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td colSpan="3" className="py-3 px-4 text-center" style={tdStyle}>—</td>
                          <td className="py-3 px-4 text-center text-gray-400 italic" style={tdStyle}></td>
                        </>
                      )}
                    </tr>

                    {/* Subitems (sorted) */}
                    {Array.isArray(group.subitems) &&
                      [...group.subitems]
                        .sort((a, b) =>
                          (a.subitem || "").toString().localeCompare((b.subitem || "").toString(), undefined, { numeric: true, sensitivity: "base" })
                        )
                        .map((sub) => (
                          <tr key={sub.itemID} className="hover:bg-gray-50">
                            <td className="py-2 px-6" style={{ ...tdStyle, paddingLeft: "24px", color: "#374151" }}>
                              <input
                                type="text"
                                value={editedItems[sub.itemID]?.subitem ?? sub.subitem ?? ""}
                                onChange={(e) =>
                                  handleEditChange(sub.itemID, "subitem", e.target.value)
                                }
                                className="border rounded px-3 h-10 w-full"
                                style={{ color: "#374151", boxSizing: "border-box" }}
                              />
                            </td>
                            <td className="py-2 px-4 text-center" style={tdStyle}>
                              <input
                                type="number"
                                value={editedItems[sub.itemID]?.yesValue ?? sub.yesValue ?? ""}
                                onChange={(e) =>
                                  handleEditChange(sub.itemID, "yesValue", e.target.value)
                                }
                                className="border rounded w-16 text-center h-10 px-1"
                                />
                            </td>
                            <td className="py-2 px-4 text-center" style={tdStyle}>
                              <input
                                type="number"
                                value={editedItems[sub.itemID]?.noValue ?? sub.noValue ?? ""}
                                onChange={(e) =>
                                  handleEditChange(sub.itemID, "noValue", e.target.value)
                                }
                                className="border rounded w-16 text-center h-10 px-1"
                                />
                            </td>
                            <td className="py-2 px-4 text-center" style={tdStyle}>
                              <input
                                type="number"
                                value={
                                  editedItems[sub.itemID]?.partlyValue ??
                                  sub.partlyValue ??
                                  ""
                                }
                                onChange={(e) =>
                                  handleEditChange(sub.itemID, "partlyValue", e.target.value)
                                }
                                className="border rounded w-16 text-center h-10 px-1"
                                />
                            </td>
                            <td className="py-2 px-4 text-center space-x-2" style={tdStyle}>
                              <button
                                onClick={() => handleDelete(sub.itemID)}
                                className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-[#8b5cf6] hover:bg-[#6f47a2] text-white px-4 py-2 rounded shadow"
          >
            + Add Item
          </button>
          <button
            onClick={handleSave}
            className="bg-[#8b5cf6] hover:bg-[#6f47a2] text-white px-6 py-2 rounded shadow"
          >
            Save Changes
          </button>
        </div>
      </div>
      {isAddOpen && (
        <AddItemModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSubmit={handleAddSubmit}
        />
      )}
    </Layout>
  );
}

