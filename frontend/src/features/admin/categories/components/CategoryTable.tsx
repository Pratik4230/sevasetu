import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  adminCategoryService,
  type AdminCategory,
} from "../services/admin-category.service";
import { toast } from "sonner";

interface Props {
  categories: AdminCategory[];
}

export function CategoryTable({ categories }: Props) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminCategoryService.deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message ?? "Failed to delete category"),
  });

  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Description</th>
            <th className="p-2">Base Price</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c._id} className="border-b">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.description}</td>
              <td className="p-2">{c.basePrice ? `₹${c.basePrice}` : "—"}</td>
              <td className="p-2">
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(c._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
