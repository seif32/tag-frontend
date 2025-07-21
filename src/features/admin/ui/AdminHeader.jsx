import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, LogOut, Settings } from "lucide-react";

function AdminHeader() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center h-16 gap-4 px-6">
        {/* 📱 Mobile Sidebar Trigger */}
        <SidebarTrigger className="md:hidden" />

        {/* 🔍 Search & Actions */}
        <div className="flex-1">{/* <p>sdds</p> */}</div>

        {/* 🔔 Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <Badge
            variant="destructive"
            className="absolute w-5 h-5 p-0 text-xs rounded-full -top-1 -right-1"
          >
            3
          </Badge>
        </Button>

        {/* 👨‍💼 User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative w-10 h-10 rounded-full">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/admin-avatar.png" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex flex-col p-2 space-y-1">
              <p className="text-sm font-medium">John Admin</p>
              <p className="text-xs text-muted-foreground">admin@example.com</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default AdminHeader;
