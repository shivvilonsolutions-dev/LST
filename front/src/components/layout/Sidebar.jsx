import React from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";

const NavItem = ({ label, icon, path }) => {
  const location = useLocation();

  return (
    <Link to={path}>
      <div
        className={
          `flex items-center gap-3 cursor-pointer hover:bg-blue-400 p-2 rounded-lg 
          ${location.pathname === path
            ? "bg-blue-800 font-semibold text-white"
            : "hover:bg-blue-300 hover:text-white"
          }
        `}
      >
        <div className="w-6 h-6 bg-blue-500 text-white flex items-center justify-center rounded">
          {icon}
        </div>
        <span>{label}</span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const navi = useNavigate()
  return (
    <div className="
      fixed md:static top-0 left-0
      h-full w-56 bg-gray-100 p-4 flex flex-col gap-6
      transform md:translate-x-0 -translate-x-full
      transition-transform duration-300
    ">

      {/* X Close */}
      <div
        className="flex items-center gap-2 mb-2 md:hidden cursor-pointer"
      >
        <span className="text-xl">✕</span>
        <span>Close</span>
      </div>

      {/* Logo */}
      <div className="bg-indigo-400 h-16 flex items-center justify-center text-white font-semibold rounded">
        Company Logo
      </div>

      <hr className="border-t-1 border-gray-600" />

      {/* Navigation */}
      <div className="flex flex-col gap-4 mt-2">

        <NavItem label="Dashboard" icon="D" path="/dashboard" />
        <NavItem label="Quotation" icon="Q" path="/quotation" />
        <NavItem label="Payment" icon="P" path="/payment" />
        <NavItem label="Materials" icon="M" path="/materials" />

        <hr className="border-t-1 border-gray-600" />

        {/* Log out */}
        <div className="flex items-center gap-3 cursor-pointer hover:bg-blue-400 p-2 rounded-lg" onClick={() => {navi("/")}}>
          <div className="w-6 h-6 bg-blue-800 text-white flex items-center justify-center rounded">L</div>
          <span>Logout</span>
        </div>

      </div>
    </div>
  )
}

export default Sidebar
