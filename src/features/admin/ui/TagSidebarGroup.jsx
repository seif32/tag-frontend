import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";

import TagSidebarMenuItem from "./TagSidebarMenuItem";

function TagSidebarGroup({ group }) {
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
              />
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export default TagSidebarGroup;
