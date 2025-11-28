import React from "react";
import Layout from "../../components/admin/layout";
import { router } from "@inertiajs/react";
import { Construction } from "lucide-react"; // Import a tools icon
import "../../../css/globalstyles.css"; // adjust path if needed

export default function Scorecard({ scoresheet = {} }) {
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

  const handleEditClick = () => {
    // navigate to the ManageScoresheet page (adjust route name if different)
    router.get('/admin/manage-scoresheet');
  };

  // ensure scoresheet is an object we can iterate
  const sheet = scoresheet && typeof scoresheet === "object" ? scoresheet : {};

  // inline style to match fonts/colors used across other admin pages
  const pageStyle = {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif",
    color: "#374151", // primary text color consistent with other pages
    lineHeight: 1.5,
  };

  const headingStyle = {
    color: "#8b5cf6", // same purple used across admin pages
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
    color: "#6b7280", // muted body color used elsewhere
    verticalAlign: "middle",
    fontSize: "14px",
  };

  return (
    <Layout>
      <div style={pageStyle} className="gap-4">
        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow bg-white">
          <table className="min-w-full border-collapse" style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Elements and Items / Questions
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider" style={{ width: "7%" }}>Yes</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider" style={{ width: "7%" }}>No</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider" style={{ width: "7%" }}>Partly</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider" style={{ width: "7%" }}>Total</th>
              </tr>
            </thead>

            <tbody>
              {Object.keys(sheet).length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{ ...tdStyle, textAlign: "center", padding: "40px 12px", color: "#9ca3af", fontStyle: "italic" }}
                  >
                    No versions found.
                  </td>
                </tr>
              )}

              {Object.entries(sheet).map(([item, group]) => (
                <React.Fragment key={item}>
                  {/* Parent Row */}
                  <tr className="hover:bg-gray-50 transition">
                    <td style={{ ...tdStyle, fontWeight: 600 }}>{group.parent?.item ?? ""}</td>

                    {/* If there are no subitems, show parent’s own scores */}
                    {(!group.subitems || group.subitems.length === 0) ? (
                      <>
                        <td style={{ ...tdStyle, textAlign: "center" }}>
                          {group.parent?.yesValue ?? "—"}
                        </td>
                        <td style={{ ...tdStyle, textAlign: "center" }}>
                          {group.parent?.noValue ?? "—"}
                        </td>
                        <td style={{ ...tdStyle, textAlign: "center" }}>
                          {group.parent?.partlyValue ?? "—"}
                        </td>
                        <td style={{ ...tdStyle, textAlign: "center" }}>—</td>
                      </>
                    ) : (
                      <>
                        <td colSpan="3" style={{ textAlign: "center", padding: "12px 16px" }}>&nbsp;</td>
                        <td style={{ ...tdStyle, textAlign: "center" }}>—</td>
                      </>
                    )}
                  </tr>

                  {/* Subitems */}
                  {Array.isArray(group.subitems) &&
                    group.subitems
                      .sort(
                        (a, b) =>
                          parseFloat(a.subitem.replace(/[^0-9.]/g, "")) -
                          parseFloat(b.subitem.replace(/[^0-9.]/g, ""))
                      )
                      .map((sub) => (
                        <tr key={sub.itemID} className="hover:bg-gray-50">
                          <td style={{ ...tdStyle, paddingLeft: "24px", color: "#374151" }}>{sub.subitem}</td>
                          <td style={{ ...tdStyle, textAlign: "center" }}>
                            {sub.yesValue !== null && sub.yesValue !== undefined ? sub.yesValue : "—"}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "center" }}>
                            {sub.noValue !== null && sub.noValue !== undefined ? sub.noValue : "—"}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "center" }}>
                            {sub.partlyValue !== null && sub.partlyValue !== undefined ? sub.partlyValue : "—"}
                          </td>
                          <td style={{ ...tdStyle, textAlign: "center" }}>—</td>
                        </tr>
                      ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Floating Edit Button */}
        <button
          onClick={handleEditClick}
          title="Edit Scoresheet"
          className="fixed bottom-6 right-6 bg-[#8b5cf6] hover:bg-[#6f47a2] transition-colors
                     rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM21.41 6.34a1.25 1.25 0 0 0 0-1.77l-2-2a1.25 1.25 0 0 0-1.77 0L15.13 4.1l3.75 3.75 2.53-2.51z" />
          </svg>
        </button>
      </div>
    </Layout>
  );
}
