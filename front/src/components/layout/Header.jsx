import React from 'react'
import Input from '../ui/Input'
import { useLocation } from 'react-router-dom';

const getTitle = (path) => {
  if (path.startsWith("/dashboard")) return "Dashboard";
  if (path.startsWith("/materials")) return "Materials";
  if (path.startsWith("/payment")) return "Payment";
  if (path.startsWith("/quotation")) return "Quotation";

  return "Dashboard";
};

const Header = () => {
  const location = useLocation()

  return (
    <div className="bg-blue-800 text-white p-4 h-24 flex items-center justify-between">

      {/* Hamburger (only mobile) */}
      <button className="md:hidden text-2xl">
        ☰
      </button>

      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-bold px-3">
        {getTitle(location.pathname)}
      </h1>

      <Input
        inpType={"text"}
        inpPlaceholder={"Search for Materila or Clients Details"}
        rColor={"white"}
        inpWidth='w-40 md:w-80 lg:w-120'
      />

    </div>
  )
}

export default Header
