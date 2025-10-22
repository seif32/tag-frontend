import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { AdminSidebarGroups } from "@/constants/data";
import TagSidebarGroup from "./TagSidebarGroup";
import AdminSidebarHeader from "./AdminSidebarHeader";
import useChat from "@/hooks/useChat";

function AdminSidebar() {
  const { unseenCount, isLoadingUnseenCount } = useChat.useUnseenCount();
  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarHeader>
          <AdminSidebarHeader />
        </SidebarHeader>

        {AdminSidebarGroups.map((group, index) => (
          <TagSidebarGroup
            key={index}
            group={group}
            unseenCount={unseenCount} // ✅ Pass it here
            isLoadingUnseenCount={isLoadingUnseenCount}
          />
        ))}

        <SidebarFooter>{/* Add footer content if needed */}</SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}

export default AdminSidebar;
