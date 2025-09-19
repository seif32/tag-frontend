import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Tag,
  Palette,
  Ruler,
  Package,
} from "lucide-react";

export default function VariantManagementPage() {
  const [variantTypes, setVariantTypes] = useState([
    {
      id: 1,
      name: "Color",
      description: "Product color variations",
      icon: Palette,
      values: [
        { id: 1, name: "Red", value: "#FF0000", sortOrder: 1 },
        { id: 2, name: "Blue", value: "#0000FF", sortOrder: 2 },
        { id: 3, name: "Green", value: "#00FF00", sortOrder: 3 },
        { id: 4, name: "Black", value: "#000000", sortOrder: 4 },
      ],
    },
    {
      id: 2,
      name: "Size",
      description: "Product size variations",
      icon: Ruler,
      values: [
        { id: 5, name: "XS", value: "extra-small", sortOrder: 1 },
        { id: 6, name: "S", value: "small", sortOrder: 2 },
        { id: 7, name: "M", value: "medium", sortOrder: 3 },
        { id: 8, name: "L", value: "large", sortOrder: 4 },
        { id: 9, name: "XL", value: "extra-large", sortOrder: 5 },
      ],
    },
    {
      id: 3,
      name: "Material",
      description: "Product material variations",
      icon: Package,
      values: [
        { id: 10, name: "Cotton", value: "cotton", sortOrder: 1 },
        { id: 11, name: "Polyester", value: "polyester", sortOrder: 2 },
        { id: 12, name: "Wool", value: "wool", sortOrder: 3 },
      ],
    },
  ]);

  const [selectedVariantType, setSelectedVariantType] = useState(null);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [isValueDialogOpen, setIsValueDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [editingValue, setEditingValue] = useState(null);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeDescription, setNewTypeDescription] = useState("");
  const [newValueName, setNewValueName] = useState("");
  const [newValueValue, setNewValueValue] = useState("");

  const handleCreateType = () => {
    if (!newTypeName.trim()) return;

    const newType = {
      id: Date.now(),
      name: newTypeName,
      description: newTypeDescription,
      icon: Tag,
      values: [],
    };

    setVariantTypes([...variantTypes, newType]);
    setNewTypeName("");
    setNewTypeDescription("");
    setIsTypeDialogOpen(false);
  };

  const handleEditType = (type) => {
    setEditingType(type);
    setNewTypeName(type.name);
    setNewTypeDescription(type.description);
    setIsTypeDialogOpen(true);
  };

  const handleUpdateType = () => {
    if (!newTypeName.trim() || !editingType) return;

    setVariantTypes(
      variantTypes.map((type) =>
        type.id === editingType.id
          ? { ...type, name: newTypeName, description: newTypeDescription }
          : type
      )
    );

    setEditingType(null);
    setNewTypeName("");
    setNewTypeDescription("");
    setIsTypeDialogOpen(false);
  };

  const handleDeleteType = (typeId) => {
    setVariantTypes(variantTypes.filter((type) => type.id !== typeId));
  };

  const handleCreateValue = () => {
    if (!newValueName.trim() || !selectedVariantType) return;

    const newValue = {
      id: Date.now(),
      name: newValueName,
      value: newValueValue || newValueName.toLowerCase(),
      sortOrder: selectedVariantType.values.length + 1,
    };

    setVariantTypes(
      variantTypes.map((type) =>
        type.id === selectedVariantType.id
          ? { ...type, values: [...type.values, newValue] }
          : type
      )
    );

    setNewValueName("");
    setNewValueValue("");
    setIsValueDialogOpen(false);
  };

  const handleEditValue = (value) => {
    setEditingValue(value);
    setNewValueName(value.name);
    setNewValueValue(value.value);
    setIsValueDialogOpen(true);
  };

  const handleUpdateValue = () => {
    if (!newValueName.trim() || !editingValue || !selectedVariantType) return;

    setVariantTypes(
      variantTypes.map((type) =>
        type.id === selectedVariantType.id
          ? {
              ...type,
              values: type.values.map((val) =>
                val.id === editingValue.id
                  ? {
                      ...val,
                      name: newValueName,
                      value: newValueValue || newValueName.toLowerCase(),
                    }
                  : val
              ),
            }
          : type
      )
    );

    setEditingValue(null);
    setNewValueName("");
    setNewValueValue("");
    setIsValueDialogOpen(false);
  };

  const handleDeleteValue = (valueId) => {
    if (!selectedVariantType) return;

    setVariantTypes(
      variantTypes.map((type) =>
        type.id === selectedVariantType.id
          ? { ...type, values: type.values.filter((val) => val.id !== valueId) }
          : type
      )
    );
  };

  const resetDialogs = () => {
    setEditingType(null);
    setEditingValue(null);
    setNewTypeName("");
    setNewTypeDescription("");
    setNewValueName("");
    setNewValueValue("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Variant Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage product variant types and their values
              </p>
            </div>
            <Dialog
              open={isTypeDialogOpen}
              onOpenChange={(open) => {
                setIsTypeDialogOpen(open);
                if (!open) resetDialogs();
              }}
            >
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Variant Type
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingType
                      ? "Edit Variant Type"
                      : "Create New Variant Type"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingType
                      ? "Update the variant type details below."
                      : "Add a new variant type to organize your product variations."}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="type-name">Name</Label>
                    <Input
                      id="type-name"
                      value={newTypeName}
                      onChange={(e) => setNewTypeName(e.target.value)}
                      placeholder="e.g., Color, Size, Material"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type-description">Description</Label>
                    <Input
                      id="type-description"
                      value={newTypeDescription}
                      onChange={(e) => setNewTypeDescription(e.target.value)}
                      placeholder="Brief description of this variant type"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsTypeDialogOpen(false);
                      resetDialogs();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={editingType ? handleUpdateType : handleCreateType}
                  >
                    {editingType ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed View</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Variant Types Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {variantTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Card
                    key={type.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{type.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {type.description}
                          </CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setSelectedVariantType(type)}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditType(type)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteType(type.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Values</span>
                          <Badge variant="secondary">
                            {type.values.length}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {type.values.slice(0, 6).map((value) => (
                            <Badge
                              key={value.id}
                              variant="outline"
                              className="text-xs"
                            >
                              {value.name}
                            </Badge>
                          ))}
                          {type.values.length > 6 && (
                            <Badge variant="outline" className="text-xs">
                              +{type.values.length - 6} more
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setSelectedVariantType(type)}
                        >
                          Manage Values
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            {selectedVariantType ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <selectedVariantType.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {selectedVariantType.name}
                        </CardTitle>
                        <CardDescription>
                          {selectedVariantType.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Dialog
                      open={isValueDialogOpen}
                      onOpenChange={(open) => {
                        setIsValueDialogOpen(open);
                        if (!open) resetDialogs();
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add Value
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {editingValue
                              ? "Edit Value"
                              : `Add New ${selectedVariantType.name} Value`}
                          </DialogTitle>
                          <DialogDescription>
                            {editingValue
                              ? "Update the value details below."
                              : `Add a new value to the ${selectedVariantType.name} variant type.`}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="value-name">Display Name</Label>
                            <Input
                              id="value-name"
                              value={newValueName}
                              onChange={(e) => setNewValueName(e.target.value)}
                              placeholder="e.g., Red, Large, Cotton"
                            />
                          </div>
                          <div>
                            <Label htmlFor="value-value">
                              Value (Optional)
                            </Label>
                            <Input
                              id="value-value"
                              value={newValueValue}
                              onChange={(e) => setNewValueValue(e.target.value)}
                              placeholder="e.g., #FF0000, xl, cotton-blend"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsValueDialogOpen(false);
                              resetDialogs();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={
                              editingValue
                                ? handleUpdateValue
                                : handleCreateValue
                            }
                          >
                            {editingValue ? "Update" : "Add"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Sort Order</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedVariantType.values.map((value) => (
                        <TableRow key={value.id}>
                          <TableCell className="font-medium">
                            {value.name}
                          </TableCell>
                          <TableCell>
                            <code className="bg-muted px-2 py-1 rounded text-sm">
                              {value.value}
                            </code>
                          </TableCell>
                          <TableCell>{value.sortOrder}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditValue(value)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteValue(value.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {selectedVariantType.values.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No values added yet</p>
                      <p className="text-sm">
                        Click "Add Value" to get started
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    Select a Variant Type
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Choose a variant type from the overview tab to manage its
                    values
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedVariantType(variantTypes[0])}
                  >
                    View First Type
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
