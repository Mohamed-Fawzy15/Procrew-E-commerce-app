import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useUser } from "../../Hooks/useUser";

export default function MainLayout() {
  const { i18n, t } = useTranslation();
  const { user } = useUser();
  const isRTL = i18n.language === "ar";
  const navigate = useNavigate();

  useEffect(() => {
    // to check when the user login if he is admin or nomral user
    if (user && user.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "font-arabic" : ""}>
      {!user || user.role !== "admin" ? <Navbar /> : null}
      <main>
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>{t("copy_right.copy_right")}</p>
      </footer>
    </div>
  );
}
