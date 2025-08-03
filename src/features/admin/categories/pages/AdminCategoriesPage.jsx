import { Search, Plus, Edit, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import Link from "next/link";
// import Image from "next/image";

const categories = [
  {
    id: 1,
    name: "Electronics",
    description: "Digital devices, gadgets, and electronic accessories",
    productCount: 342,
    status: "Active",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    name: "Clothing",
    description: "Fashion apparel for men, women, and children",
    productCount: 567,
    status: "Active",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    name: "Home & Kitchen",
    description: "Home decor, kitchen appliances, and household items",
    productCount: 234,
    status: "Active",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 4,
    name: "Sports & Outdoors",
    description: "Sports equipment, outdoor gear, and fitness accessories",
    productCount: 189,
    status: "Active",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 5,
    name: "Books & Media",
    description: "Books, magazines, movies, and digital media",
    productCount: 78,
    status: "Inactive",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 6,
    name: "Accessories",
    description: "Fashion accessories, jewelry, and personal items",
    productCount: 156,
    status: "Active",
    image: "/placeholder.svg?height=60&width=60",
  },
];

export default function AdminCategoriesPage() {
  return (
    <div className="px-5 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-gray-600">
            Organize your products into meaningful categories
          </p>
        </div>
        <Button className="text-white bg-black hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Categories
              </p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-black rounded-lg">
              <Tag className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Categories
              </p>
              <p className="text-2xl font-bold text-gray-900">21</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
              <Tag className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Products Categorized
              </p>
              <p className="text-2xl font-bold text-gray-900">1,566</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <div className="relative">
          <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <Input
            placeholder="Search categories by name or description..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="font-semibold text-gray-900">
                Category
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Description
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Products
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} className="border-gray-200">
                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={60}
                      height={60}
                      className="object-cover rounded-lg"
                    /> */}
                    <div className="w-12 rounded-md bg-stone-200 aspect-square"></div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {category.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        ID: #{category.id}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs text-gray-600">
                  <p className="truncate">{category.description}</p>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {category.productCount} products
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      category.status === "Active" ? "default" : "secondary"
                    }
                    className={
                      category.status === "Active"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {category.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Category
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Tag className="w-4 h-4 mr-2" />
                        View Products
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Category
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">Showing 1 to 6 of 24 categories</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="text-white bg-black">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
