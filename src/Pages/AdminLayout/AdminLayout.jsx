import { useTranslation } from "react-i18next";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../../Hooks/useUser";
import { useState } from "react";

export default function AdminLayout() {
  const { t, i18n } = useTranslation();
  const { logout, user } = useUser();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-gray-100 flex"
    >
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 bg-[#111828] text-white p-2 rounded-md"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-[#111828] text-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0 " : "-translate-x-full "
        } `}
      >
        <div className="flex flex-col h-full p-4">
          <div>
            <ul className="space-y-4">
              <li>
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-blue-700 text-white"
                        : "text-gray-300 hover:bg-blue-800"
                    }`
                  }
                >
                  {t("dashboard.title")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/products"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-blue-700 text-white"
                        : "text-gray-300 hover:bg-blue-800"
                    }`
                  }
                >
                  {t("dashboard.products")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/orders"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-blue-700 text-white"
                        : "text-gray-300 hover:bg-blue-800"
                    }`
                  }
                >
                  {t("dashboard.orders")}
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 mt-auto">
            <span>{user?.email}</span>
            <select
              value={i18n.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-white text-black border border-blue-700 rounded-sm p-1 focus:outline-none"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-1 rounded-sm hover:bg-red-700"
            >
              {t("navbar.logout")}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 ">
        <Outlet />
      </main>
    </div>
  );
}
