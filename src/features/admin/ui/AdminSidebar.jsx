import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { AdminSidebarGroups } from "@/constants/data";
import TagSidebarGroup from "./TagSidebarGroup";
import AdminSidebarHeader from "./AdminSidebarHeader";

function AdminSidebar() {
  return (
    <Sidebar className="w-64 border-r bg-sidebar">
      <SidebarContent className={"bg-sidebar"}>
        <AdminSidebarHeader />

        {AdminSidebarGroups.map((group, index) => (
          <TagSidebarGroup key={index} group={group} />
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

export default AdminSidebar;
