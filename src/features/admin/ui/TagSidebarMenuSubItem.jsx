import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router";

function TagSidebarMenuSubItem({ to, SubIcon, name, isActive }) {
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={isActive}>
        <NavLink to={to}>
          <SubIcon className="w-4 h-4" />
          <span>{name}</span>
        </NavLink>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}

export default TagSidebarMenuSubItem;
