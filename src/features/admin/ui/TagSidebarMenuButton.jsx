import { Badge } from "@/components/ui/badge";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { getIcon } from "@/utils/iconMapper";
import { ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router";
import { toggleSection } from "../services/utils";

function TagSidebarMenuButton({
  setOpenSections,
  sectionKey,
  isActiveSection,
  menuButton,
  hasSubmenu,
  isOpen,
  unseenCount,
  isLoadingUnseenCount,
}) {
  const location = useLocation();
  const IconComponent = getIcon(menuButton.iconName);

  // ✅ Conditionally set badge content for "Chats" menu
  const getBadgeContent = () => {
    if (menuButton.name === "Chats") {
      return isLoadingUnseenCount ? "..." : unseenCount || 0;
    }
    return menuButton.badge?.content;
  };

  const badgeContent = getBadgeContent();
  const shouldShowBadge =
    menuButton.badge &&
    (menuButton.name !== "Chats" || unseenCount > 0 || isLoadingUnseenCount);

  return (
    <SidebarMenuButton
      onClick={() => toggleSection(sectionKey, setOpenSections)}
      isActive={isActiveSection(menuButton.path, location)}
      className="justify-between w-full cursor-pointer"
    >
      {hasSubmenu ? (
        <>
          <div className="flex items-center gap-2">
            <IconComponent className="w-4 h-4" />
            <span>{menuButton.name}</span>
          </div>

          <div className="flex items-center gap-2">
            {shouldShowBadge && (
              <Badge variant={menuButton.badge.variant} className="text-xs">
                {badgeContent}
              </Badge>
            )}
            <ChevronRight
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? "rotate-90" : ""
              }`}
            />
          </div>
        </>
      ) : (
        <NavLink
          to={menuButton.path}
          className="flex items-center gap-2 w-full"
        >
          <IconComponent className="w-4 h-4" />
          <span>{menuButton.name}</span>
          {shouldShowBadge && (
            <Badge
              variant={menuButton.badge.variant}
              className="ml-auto text-xs"
            >
              {badgeContent}
            </Badge>
          )}
        </NavLink>
      )}
    </SidebarMenuButton>
  );
}

export default TagSidebarMenuButton;
