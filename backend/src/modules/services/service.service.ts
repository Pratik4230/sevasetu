import { ServiceCategory } from "./category.model";
import { AppError } from "../../shared/utils/app-error";
import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2).max(60),
  description: z.string().min(5),
  iconUrl: z.url().optional(),
  basePrice: z.number().min(0).optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const getAllActive = async () => {
  return ServiceCategory.find({ isActive: true }).sort({ name: 1 });
};

export const getById = async (id: string) => {
  const cat = await ServiceCategory.findById(id);
  if (!cat || !cat.isActive) throw new AppError("Category not found", 404);
  return cat;
};

export const create = async (data: CategoryInput) => {
  return ServiceCategory.create(data);
};

export const update = async (id: string, data: Partial<CategoryInput>) => {
  const cat = await ServiceCategory.findByIdAndUpdate(id, data, { new: true });
  if (!cat) throw new AppError("Category not found", 404);
  return cat;
};

export const softDelete = async (id: string) => {
  const cat = await ServiceCategory.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
  if (!cat) throw new AppError("Category not found", 404);
  return cat;
};
