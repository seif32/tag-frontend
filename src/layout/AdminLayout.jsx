import { Outlet } from "react-router";

function AdminLayout() {
  return (
    <div className="flex h-screen bg-red-600">
      <aside className="w-64 bg-white shadow-lg">
        {/* <AdminSidebar /> */}
      </aside>

      <div className="flex-1 flex flex-col">
        {/* <AdminHeader /> */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
