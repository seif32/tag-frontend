import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { TiTags } from "react-icons/ti";
import { MdAddCircle, MdCancel } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useTagsManager } from "../../../hooks/useTagsManger";
import { Card, CardContent } from "@/components/ui/card";

export function TagsManager({ form }) {
  const { tags, removeTag, currentTag, setCurrentTag, handleKeyPress, addTag } =
    useTagsManager(form);

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <label className="text-sm">Tags</label>
          </div>

          <div className="border border-gray-200 p-3 rounded-lg flex flex-wrap gap-2 min-h-[60px] mt-2 items-center justify-start">
            {tags.length === 0 ? (
              <span className="text-sm text-gray-400">No tags added yet</span>
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
  );
}

export default TagsManager;
