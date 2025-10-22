import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";

import TagSidebarMenuItem from "./TagSidebarMenuItem";

function TagSidebarGroup({ group, unseenCount, isLoadingUnseenCount }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {group.menuItems.map((menuItem, index) => {
            return (
              <TagSidebarMenuItem
                key={index}
                menuButton={menuItem.menuButton}
                unseenCount={unseenCount} // ✅ Pass it here
                isLoadingUnseenCount={isLoadingUnseenCount}
              />
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export default TagSidebarGroup;
