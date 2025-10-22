import { SidebarMenuItem, SidebarMenuSub } from "@/components/ui/sidebar";
import { getIcon } from "@/utils/iconMapper";
import { useState } from "react";
import { useLocation } from "react-router";
import TagSidebarMenuSubItem from "./TagSidebarMenuSubItem";
import TagSidebarMenuButton from "./TagSidebarMenuButton";
import { isActiveSection } from "../services/utils";

function TagSidebarMenuItem({ menuButton, unseenCount, isLoadingUnseenCount }) {
  const location = useLocation();
  const [openSections, setOpenSections] = useState({});

  const sectionKey = menuButton.name.toLowerCase();
  const hasSubmenu =
    menuButton.submenuButtons && menuButton.submenuButtons.length > 0;
  const isOpen =
    openSections[sectionKey] || isActiveSection(menuButton.path, location);

  return (
    <SidebarMenuItem>
      <TagSidebarMenuButton
        hasSubmenu={hasSubmenu}
        isActiveSection={isActiveSection}
        isOpen={isOpen}
        menuButton={menuButton}
        sectionKey={sectionKey}
        setOpenSections={setOpenSections}
        unseenCount={unseenCount} // ✅ Pass it here
        isLoadingUnseenCount={isLoadingUnseenCount}
      />
      {hasSubmenu && isOpen && (
        <SidebarMenuSub className="transition-all duration-200 border-l-2">
          {menuButton.submenuButtons.map((submenuButton, subIndex) => {
            const SubIcon = getIcon(submenuButton.iconName);
            return (
              <TagSidebarMenuSubItem
                key={subIndex}
                to={submenuButton.path}
                SubIcon={SubIcon}
                name={submenuButton.name}
                isActive={location.pathname === submenuButton.path}
              />
            );
          })}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}

export default TagSidebarMenuItem;
