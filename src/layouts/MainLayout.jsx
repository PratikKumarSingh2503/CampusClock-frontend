import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import React, { useState } from "react";

export default function MainLayout() {
  // Sidebar width constants
  const SIDEBAR_EXPANDED = 256; // 64 * 4 (w-64)
  const SIDEBAR_COLLAPSED = 80; // 20 * 4 (w-20)
  // We'll use a state to sync with Sidebar's collapsed state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="relative h-screen">
      <Sidebar onCollapse={setIsSidebarCollapsed} />
      <div
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{
          marginLeft: isSidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED,
        }}
      >
        <Navbar />
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
