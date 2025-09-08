import { useState, useEffect } from "react";
import {
  Plus,
  RefreshCw,
  Tag,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TagsDataTable } from "../components/TagsDataTable";
import useTags from "@/hooks/useTags";
import LoadingState from "@/ui/LoadingState";
import ErrorMessage from "@/ui/ErrorMessage";
import AdminAddTagDialog from "../components/AdminAddTagDialog";
import StatsCard from "../../ui/StatsCard";

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

  const [stats, setStats] = useState({
    total: 0,
    categories: 0,
    recentlyAdded: 0,
    activeToday: 0,
  });

  useEffect(() => {
    if (!tags) return;

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const recentlyAdded = tags.results.filter(
      (tag) => new Date(tag.created_at) >= weekAgo
    ).length;
    const activeToday = tags.results.filter((tag) => {
      const updatedDate = new Date(tag.updated_at);
      updatedDate.setHours(0, 0, 0, 0);
      return updatedDate.getTime() === today.getTime();
    }).length;
    const categories = new Set(tags.results.map((tag) => tag.category_id)).size;

    setStats({
      total: tags.results.length,
      categories,
      recentlyAdded,
      activeToday,
    });
  }, [tags]);

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
    <div className="container p-6 mx-auto space-y-6">
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

      <Separator />

      {/* ✅ Updated Stats Section using StatsCard */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Tags"
          icon={Tag}
          value={stats.total}
          subtitle="All registered tags"
        />

        <StatsCard
          title="This Week"
          icon={Calendar}
          value={stats.recentlyAdded}
          subtitle="Recently added"
        />

        <StatsCard
          title="Active Today"
          icon={TrendingUp}
          value={stats.activeToday}
          subtitle="Updated today"
        />
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
