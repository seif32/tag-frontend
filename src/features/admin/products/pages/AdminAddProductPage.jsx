import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TagFormField from "../../ui/TagFormField";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { DevTool } from "@hookform/devtools";

import { addProductDefaultValues } from "../data/formDefaults";

import { TiTags } from "react-icons/ti";
import { MdAddCircleOutline, MdCancel } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdAddCircle } from "react-icons/md";
import { LuImagePlus } from "react-icons/lu";
import { IoTrashOutline } from "react-icons/io5";
import { IoAddOutline } from "react-icons/io5";

import Image1 from "@/assets/product4.jpg";
import Image2 from "@/assets/product5.jpg";
import Image3 from "@/assets/product6.jpg";
import Image4 from "@/assets/product7.jpg";
import Image5 from "@/assets/product8.jpg";
import Image6 from "@/assets/product9.jpg";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function AdminAddProductPage() {
  const form = useForm({
    defaultValues: addProductDefaultValues,
  });

  const [currentTag, setCurrentTag] = useState("");
  const tags = form.watch("tags");

  function addTag() {
    if (!currentTag.trim()) return;
    if (tags.includes(currentTag.trim())) {
      setCurrentTag(""); // Clear input
      return;
    }

    const updatedTags = [...tags, currentTag.trim()];
    form.setValue("tags", updatedTags);

    setCurrentTag("");
  }

  function removeTag(indexToRemove) {
    const updatedTags = tags.filter((_, index) => index !== indexToRemove);
    form.setValue("tags", updatedTags);
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }

  function onSubmit(data) {
    console.log("✅ Submitted Data:", data);
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="flex flex-col gap-4 ">
          <div className="flex justify-between ">
            <h2 className="text-2xl font-bold">Add Product</h2>
            <Button>Save</Button>
          </div>
          <div className="flex flex-col flex-1 gap-4 lg:flex-row">
            <div className="flex flex-col gap-4 flex-5/8">
              <Card className={"rounded-lg"}>
                <CardHeader>General Information</CardHeader>
                <CardContent className={"space-y-6"}>
                  <div className="grid grid-cols-2 gap-2">
                    <TagFormField
                      name={"name"}
                      label={"Product Name"}
                      placeholder="Enter product name"
                      required
                    />

                    <TagFormField
                      name={"sku"}
                      label={"SKU"}
                      placeholder="PROD-001"
                      required
                    />
                  </div>
                  <TagFormField
                    name={"fullDescription"}
                    label={"Full Description"}
                    type="textarea"
                    rows={5}
                    placeholder="Describe your product in detail..."
                    required
                  />
                  <TagFormField
                    name={"shortDescription"}
                    label={"Short Description"}
                    type="textarea"
                    rows={2}
                    placeholder="Brief product summary..."
                    required
                  />

                  <div className="flex flex-col">
                    {/* Header with Add Button */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm">Tags</label>
                    </div>

                    <div className="border border-gray-200 p-3 rounded-lg flex flex-wrap gap-2 min-h-[60px] mt-2 items-center justify-start">
                      {tags.length === 0 ? (
                        <span className="text-sm text-gray-400">
                          No tags added yet
                        </span>
                      ) : (
                        tags.map((tag, index) => (
                          <div
                            key={`tag-${index}`}
                            className="flex items-center gap-2 px-3 py-1 transition-colors rounded-lg bg-stone-200 hover:bg-stone-300"
                          >
                            <TiTags className="text-gray-600" />
                            <span className="text-sm font-medium">{tag}</span>
                            <MdCancel
                              className="text-gray-500 transition-colors cursor-pointer hover:text-red-500"
                              onClick={() => removeTag(index)}
                            />
                          </div>
                        ))
                      )}

                      <Popover>
                        <PopoverTrigger>
                          <IoIosAddCircleOutline
                            size={20}
                            className="cursor-pointer hover:text-amber-500"
                          />
                        </PopoverTrigger>
                        <PopoverContent
                          className="flex items-center gap-2 p-4"
                          side={"right"}
                        >
                          <input
                            type="text"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="electronics, new"
                            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <MdAddCircle
                            size={32}
                            className="text-blue-500 cursor-pointer hover:text-blue-600"
                            onClick={addTag}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className={"flex justify-between items-center"}>
                  <h2 className={"text-md"}>Variants</h2>
                  <Button size={"sm"} className={"cursor-pointer"}>
                    Add
                    <IoAddOutline />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between ">
                      <p className="text-sm">Variant 1</p>
                      <IoTrashOutline
                        size={18}
                        className="transition-all duration-75 cursor-pointer hover:text-red-500 hover:scale-105"
                      />
                    </div>
                    <div className="grid grid-cols-[1fr_4fr] grid-rows-[1fr_auto] ">
                      <p className="text-sm text-muted-foreground">Type</p>
                      <h3 className="self-center col-start-1 col-end-2 text-sm">
                        Color
                      </h3>
                      <p className="col-start-2 row-start-1 text-sm text-muted-foreground">
                        Value
                      </p>
                      <div className="flex flex-wrap w-full gap-2 p-2 py-3 rounded-lg border-1">
                        <div className="flex items-center gap-1 p-1 bg-gray-100 border-2 rounded-lg w-fit">
                          <span className="text-sm">Red</span>
                          <MdCancel className="text-sm transition-all duration-75 cursor-pointer hover:text-red-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className={"flex items-center justify-between"}>
                  <h2 className={"text-md"}>Products</h2>
                  <Button className={"cursor-pointer "}>
                    <IoAddOutline />
                    Add
                  </Button>
                </CardHeader>
                <CardContent className={"space-y-5"}>
                  <Card>
                    <CardContent>
                      <div>
                        <h3 className="text-sm font-bold">
                          Iphone 11 red 128GB
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          red / 128GB
                        </span>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                          <TagFormField
                            name={"variants.variantName"}
                            label={"Name"}
                            placeholder="Iphone 11 red 128GB"
                            required
                          />
                          <TagFormField
                            name={"variants.quantity"}
                            label={"Storage"}
                            placeholder="0"
                            required
                            // description="How many do you have in stock?"
                            type="number"
                          />
                          <TagFormField
                            name={"variants.variantSku"}
                            label={"SKU"}
                            placeholder="PROD-001"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                          <TagFormField
                            name={"variants.price"}
                            label={"Selling Price"}
                            placeholder="0.00"
                            required
                            type="number"
                          />
                          <TagFormField
                            name={"variants.currency"}
                            label={"Currency"}
                            placeholder="USD"
                            required
                            options={[{ value: "USD", label: "USD ($)" }]}
                            type="select"
                          />
                          <TagFormField
                            name={"variants.compareAtPrice"}
                            label={"Original Price"}
                            // description="Show discount from this price"
                            placeholder="(optional)"
                            type="number"
                          />
                          <TagFormField
                            name={"variants.costPrice"}
                            label={"Cost Price"}
                            // description="For profit calculation"
                            placeholder="(optional)"
                            type="number"
                          />
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-sm">Images</h3>
                          <div className="flex flex-wrap gap-2">
                            <div className="flex flex-col items-center justify-center transition-colors duration-200 border-2 border-green-400 border-dashed rounded-md cursor-pointer w-18 hover:bg-amber-50 hover:border-amber-400 group bg-green-100/30 aspect-square custom-dashed">
                              <LuImagePlus
                                size={20}
                                className="text-green-600 transition-colors duration-200 group-hover:text-amber-600 "
                              />
                            </div>
                            {[...Array(4)].map((_, i) => (
                              <div
                                key={i}
                                className="overflow-hidden bg-gray-100 rounded-md w-18 aspect-square "
                              >
                                <img
                                  src={Image5}
                                  alt={`Image ${i + 1}`}
                                  className="object-cover w-full h-full rounded-md"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col gap-4 flex-3/8">
              <Card>
                <CardContent className={"space-y-4"}>
                  <TagFormField
                    name="featured"
                    type="checkbox"
                    label={"Mark as featured product"}
                    className="flex flex-row-reverse justify-end gap-8 "
                  />
                  <TagFormField
                    name="isAvailable"
                    type="checkbox"
                    label={"Product is available for sale"}
                    className="flex flex-row-reverse justify-end gap-8"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>Product Media</CardHeader>
                <CardContent>
                  <ScrollArea className="w-[400px] max-w-full rounded-md ">
                    <div className="flex gap-3 pb-8">
                      <div className="flex flex-col items-center justify-center transition-colors duration-200 border-2 border-green-400 border-dashed rounded-md cursor-pointer hover:bg-amber-50 hover:border-amber-400 group bg-green-100/30 w-42 aspect-square custom-dashed">
                        <LuImagePlus
                          size={22}
                          className="text-green-600 transition-colors duration-200 group-hover:text-amber-600 "
                        />
                        <p className="text-green-500 transition-colors duration-200 group-hover:text-amber-600">
                          Click to upload
                        </p>
                      </div>
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="overflow-hidden bg-yellow-100 rounded-md w-42 aspect-square "
                        >
                          <img
                            src={Image1}
                            alt={`Image ${i + 1}`}
                            className="object-cover w-full h-full rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>Category & Brand</CardHeader>
                <CardContent className={"space-y-4"}>
                  <TagFormField
                    name={"categoryId"}
                    label={"Category"}
                    type="select"
                    options={[{ value: 1, label: "Electronics" }]}
                    required
                    placeholder="Electronics"
                  />
                  <TagFormField
                    name={"subcategoryId"}
                    label={"Sub-category"}
                    type="select"
                    options={[{ value: 5, label: "Smartphones" }]}
                    placeholder="Smartphones"
                  />
                  <TagFormField
                    name={"brandId"}
                    label={"Brand"}
                    type="select"
                    options={[{ value: 3, label: "Apple" }]}
                    required
                    placeholder="Apple"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
      <DevTool control={form.control} />
    </Form>
  );
}

export default AdminAddProductPage;
