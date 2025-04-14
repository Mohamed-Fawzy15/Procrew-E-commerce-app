import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© 2025 My App. All rights reserved.</p>
      </footer>
    </>
  );
}
