import { useTranslation } from "react-i18next";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../../Hooks/useUser";

export default function AdminLayout() {
  const { t, i18n } = useTranslation();
  const { logout, user } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };
  return (
    <div
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-gray-100 flex"
    >
      <nav className="fixed top-0 left-0 h-full w-64 bg-[#111828] text-white shadow-lg">
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

      <main className="ml-64 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
