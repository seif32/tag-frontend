import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { AdminSidebarGroups } from "@/constants/data";
import TagSidebarGroup from "./TagSidebarGroup";
import AdminSidebarHeader from "./AdminSidebarHeader";

function AdminSidebar() {
  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarHeader>
          <AdminSidebarHeader />
        </SidebarHeader>

        {AdminSidebarGroups.map((group, index) => (
          <TagSidebarGroup key={index} group={group} />
        ))}

        {/* Optional footer */}
        <SidebarFooter>{/* Add footer content if needed */}</SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}

export default AdminSidebar;
