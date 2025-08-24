import { useState, useEffect } from "react";
import { Plus, RefreshCw, Tag, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

  // 🗑️ Handle Delete Tag
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

    const recentlyAdded = tags.filter(
      (tag) => new Date(tag.created_at) >= weekAgo
    ).length;
    const activeToday = tags.filter((tag) => {
      const updatedDate = new Date(tag.updated_at);
      updatedDate.setHours(0, 0, 0, 0);
      return updatedDate.getTime() === today.getTime();
    }).length;
    const categories = new Set(tags.map((tag) => tag.category_id)).size;

    setStats({
      total: tags.length,
      categories,
      recentlyAdded,
      activeToday,
    });
  }, [tags]); // only runs when tags change

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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
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

      {/* 📊 Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
            <Badge variant="secondary">{stats.total}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All registered tags
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Badge variant="outline">{stats.categories}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Unique categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Badge variant="default">{stats.recentlyAdded}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentlyAdded}</div>
            <p className="text-xs text-muted-foreground mt-1">Recently added</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeToday}</div>
            <p className="text-xs text-muted-foreground mt-1">Updated today</p>
          </CardContent>
        </Card>
      </div>

      <TagsDataTable
        data={tags}
        onRefresh={refetchTags}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    </div>
  );
}

export default AdminTagsPage;
