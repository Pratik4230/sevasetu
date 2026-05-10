import { CategoryForm } from "../components/CategoryForm";
import { CategoryTable } from "../components/CategoryTable";
import { useCategories } from "../hooks/useCategories";
import { PageHeader } from "@/shared/components/PageHeader";

export function CategoriesPage() {
  const { data = [], isLoading } = useCategories();

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <PageHeader
        title="Categories"
        subtitle="Curate service offerings and pricing anchors across the platform."
      />
      <CategoryForm />
      {isLoading && <p className="text-sm text-muted-foreground">Loading categories...</p>}
      {!isLoading && data.length === 0 && (
        <p className="text-sm text-muted-foreground">No active categories.</p>
      )}
      {data.length > 0 && <CategoryTable categories={data} />}
    </div>
  );
}
