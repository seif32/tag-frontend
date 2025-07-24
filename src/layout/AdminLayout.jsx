import { Outlet } from "react-router";

import AdminSidebar from "@/features/admin/ui/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AdminSidebar />

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* <AdminHeader className="px-6 py-4 border-b" /> */}
          <main className="flex-1 p-6 overflow-auto bg-[#fdfdfd]">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default AdminLayout;
