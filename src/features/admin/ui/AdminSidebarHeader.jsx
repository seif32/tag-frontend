import { useAuthStore } from "@/auth/store/authStore";

function AdminSidebarHeader() {
  const user = useAuthStore((s) => s.user);
  return (
    <div className="p-6 border-b">
      <h2 className="text-xl font-bold text-foreground">TAG</h2>
      <p className="text-sm text-muted-foreground">Admin Panel</p>
    </div>
  );
}

export default AdminSidebarHeader;
