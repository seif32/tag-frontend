import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagsDataTable } from "../components/TagsDataTable";
import useTags from "@/hooks/useTags";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";
import AdminAddTagDialog from "../components/AdminAddTagDialog";

function AdminTagsPage() {
  const { tags, errorTags, isErrorTags, isLoadingTags, refetchTags } =
    useTags.useAll();

  const { deleteTag, isPendingTag } = useTags.useDelete();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  function handleEdit(tag) {
    setSelectedTag(tag);
    setDialogOpen(true);
  }

  function handleDelete(tag) {
    deleteTag(tag.id);
  }

  if (isLoadingTags) return <LoadingState type="table" />;

  if (isErrorTags)
    return (
      <ErrorMessage
        message={errorTags.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchTags()}
      />
    );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            Tags Management
          </h1>
          <p className="text-muted-foreground">
            Organize and manage your product tags and categories
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refetchTags}
            disabled={isLoadingTags}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoadingTags ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <AdminAddTagDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            tagToEdit={selectedTag}
            setSelectedTag={setSelectedTag}
          />
        </div>
      </div>

      <TagsDataTable
        data={tags.results}
        onRefresh={refetchTags}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    </div>
  );
}

export default AdminTagsPage;
