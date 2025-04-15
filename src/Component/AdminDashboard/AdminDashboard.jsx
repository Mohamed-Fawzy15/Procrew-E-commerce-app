import { useTranslation } from "react-i18next";
import "flowbite";
import { Outlet } from "react-router-dom";

export default function AdminDashboard() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-900">
          {t("dashboard.title")}
        </h1>
      </div>
      <section>
        <Outlet />
      </section>
    </div>
  );
}
