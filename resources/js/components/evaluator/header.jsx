import React from "react";
import "../../../css/globalstyles.css"; // Make sure the path is correct

export default function Header({ onLogout }) {
  // render header only (remove outer .view wrapper that caused extra vertical space)
  return (
    <header className="header bg-white shadow-md mb-4" style={{ margin: "16px" }}>
      {/* Logo */}
      <div className="logo flex items-center" style={{ marginRight: "90px" }}>
        <div className="logo-icon">
          <img src="/img/logo.svg" alt="GAD Logo" width="80" height="80" />
        </div>
      </div>

      {/* Header Actions */}
      <div className="header-actions flex items-center" style={{ gap: "8px" }}>
        {/* Profile */}
        <div className="header-icon-container" style={{ position: "relative" }}>
          <button className="icon-button rounded-full hover:bg-purple-50 transition" title="Profile" style={{ padding: "4px" }}>
            <svg
              width="24"
              height="24"
              stroke="#8b5cf6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Notifications */}
        <div className="header-icon-container" style={{ position: "relative" }}>
          <button className="icon-button rounded-full hover:bg-purple-50 transition" title="Notifications" style={{ padding: "4px" }}>
            <svg
              width="24"
              height="24"
              stroke="#8b5cf6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Logout */}
        <div className="header-icon-container" style={{ position: "relative" }}>
          <button className="icon-button rounded-full hover:bg-purple-100 transition" title="Log out" onClick={onLogout} style={{ padding: "4px" }}>
            <svg
              width="24"
              height="24"
              stroke="#8b5cf6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 17L21 12L16 7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12H9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
