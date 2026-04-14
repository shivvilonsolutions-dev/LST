import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Header />

        {/* Content Area */}
        <div className="p-6 bg-gray-200 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;