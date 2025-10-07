import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagsDataTable } from "../components/TagsDataTable";
import useTags from "@/hooks/useTags";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";
import AdminAddTagDialog from "../components/AdminAddTagDialog";
import { useDeleteManager } from "@/hooks/useDeleteManager";
import useDebounce from "@/hooks/useDebounce";
import { DeleteConfirmationDialog } from "../../ui/DeleteConfirmationDialog";
import PaginationControlsBar from "../../ui/PaginationControlsBar";
import ControlsBar from "@/ui/ControlsBar";

function AdminTagsPage() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);
  const { tags, errorTags, isErrorTags, isLoadingTags, refetchTags } =
    useTags.useAll({
      search: debouncedSearch,
    });

  const { deleteTag, isPendingTag } = useTags.useDelete();
  const {
    closeDeleteDialog,
    confirmDelete,
    deleteDialog,
    handleDelete,
    isPending,
  } = useDeleteManager({
    deleteFunction: deleteTag,
    isPending: isPendingTag,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  function handleEdit(tag) {
    setSelectedTag(tag);
    setDialogOpen(true);
  }

  if (isLoadingTags) return <LoadingState type="dashboard" />;

  if (isErrorTags)
    return (
      <ErrorMessage
        message={errorTags?.message || "Failed to load data"}
        dismissible={true}
        onDismiss={() => refetchTags()}
      />
    );

  return (
    <div className="p-6 space-y-6">
      <PageTitle
        dialogOpen={dialogOpen}
        isLoadingTags={isLoadingTags}
        refetchTags={refetchTags}
        selectedTag={selectedTag}
        setDialogOpen={setDialogOpen}
        setSelectedTag={setSelectedTag}
      />
      <ControlsBar
        searchName={"tag or category"}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        isShowFilter={false}
        isShowLimit={false}
      />
      <TagsDataTable
        data={tags.results}
        onRefresh={refetchTags}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
      <PaginationControlsBar
        dataName={"tags"}
        isLoading={isLoadingTags}
        pageCount={tags?.pagination?.totalPages}
        totalCount={tags?.pagination?.total}
      />
      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={closeDeleteDialog}
        onCancel={closeDeleteDialog}
        onConfirm={confirmDelete}
        isPending={isPending}
        entityName="tag"
        entityLabel={deleteDialog.product?.name || ""}
        title="Delete tag"
      />
    </div>
  );
}

export default AdminTagsPage;

function PageTitle({
  refetchTags,
  isLoadingTags,
  dialogOpen,
  setDialogOpen,
  selectedTag,
  setSelectedTag,
}) {
  return (
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
  );
}
