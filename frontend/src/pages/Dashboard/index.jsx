import React from "react";
import DashboardSidebar from "./DashboardSidebar";

export default function Dashboard({ children }) {
  return (
    <div className="flex w-full">
      <DashboardSidebar />
      <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
        {children}
      </div>
    </div>
  );
}
