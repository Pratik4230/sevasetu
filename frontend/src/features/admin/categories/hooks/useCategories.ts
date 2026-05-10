import { useQuery } from "@tanstack/react-query";
import { adminCategoryService } from "../services/admin-category.service";

export const useCategories = () =>
  useQuery({
    queryKey: ["admin-categories"],
    queryFn: adminCategoryService.getCategories,
  });
