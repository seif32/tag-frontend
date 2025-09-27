// utils/iconMapper.js
import {
  Home,
  ShoppingBag,
  Package,
  Tags,
  Warehouse,
  ShoppingCart,
  RefreshCw,
  Truck,
  CreditCard,
  Users,
  UserCheck,
  UserPlus,
  Shield,
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart,
  Settings,
  Tag,
  Award,
  SwatchBook,
  TicketPercent,
  Boxes,
} from "lucide-react";

export const iconMap = {
  Home,
  ShoppingBag,
  Package,
  Tags,
  Warehouse,
  ShoppingCart,
  RefreshCw,
  Truck,
  CreditCard,
  Users,
  UserCheck,
  UserPlus,
  Shield,
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart,
  Settings,
  Tag,
  Award,
  SwatchBook,
  TicketPercent,
  Boxes,
};

// Helper function to get icon component
export function getIcon(iconName) {
  const IconComponent = iconMap[iconName];

  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in iconMap`);
    return iconMap.Package; // Fallback to Package icon
  }

  return IconComponent;
}
