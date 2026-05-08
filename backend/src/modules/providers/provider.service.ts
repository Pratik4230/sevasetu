import { ProviderProfile } from "./provider.model";
import { AppError } from "../../shared/utils/app-error";
import { uploadToCloudinary } from "../../shared/utils/cloudinary.utils";
import type {
  CreateProfileInput,
  UpdateProfileInput,
  BrowseQuery,
} from "./provider.validation";

export const createProfile = async (
  userId: string,
  data: CreateProfileInput,
  files: Express.Multer.File[] = []
) => {
  const existing = await ProviderProfile.findOne({ userId });
  if (existing) throw new AppError("Provider profile already exists", 409);

  const documentUrls: string[] = [];
  const documentPublicIds: string[] = [];

  for (const file of files) {
    const result = await uploadToCloudinary(file.buffer, "sevasetu/documents");
    documentUrls.push(result.secure_url);
    documentPublicIds.push(result.public_id);
  }

  return ProviderProfile.create({
    userId,
    ...data,
    documents: documentUrls,
    documentPublicIds,
    approvalStatus: "pending",
  });
};

export const getMyProfile = async (userId: string) => {
  const profile = await ProviderProfile.findOne({ userId }).populate(
    "serviceCategories",
    "name iconUrl"
  );
  if (!profile) throw new AppError("Provider profile not found", 404);
  return profile;
};

export const updateProfile = async (
  userId: string,
  data: UpdateProfileInput
) => {
  const profile = await ProviderProfile.findOneAndUpdate(
    { userId },
    { $set: data },
    { new: true, runValidators: true }
  ).populate("serviceCategories", "name iconUrl");

  if (!profile) throw new AppError("Provider profile not found", 404);
  return profile;
};

export const toggleAvailability = async (userId: string) => {
  const profile = await ProviderProfile.findOne({ userId });
  if (!profile) throw new AppError("Provider profile not found", 404);

  if (profile.approvalStatus !== "approved") {
    throw new AppError(
      "Profile must be approved before toggling availability",
      403
    );
  }

  profile.isAvailable = !profile.isAvailable;
  await profile.save();
  return profile;
};

export const browse = async (query: BrowseQuery) => {
  const filter: Record<string, any> = {
    approvalStatus: "approved",
    isAvailable: true,
  };

  if (query.city) filter.city = new RegExp(query.city, "i");
  if (query.area) filter.area = new RegExp(query.area, "i");
  if (query.categoryId)
    filter.serviceCategories = query.categoryId;

  const skip = (query.page - 1) * query.limit;

  const [providers, total] = await Promise.all([
    ProviderProfile.find(filter)
      .populate("userId", "name avatar")
      .populate("serviceCategories", "name iconUrl")
      .sort({ avgRating: -1 })
      .skip(skip)
      .limit(query.limit),
    ProviderProfile.countDocuments(filter),
  ]);

  return {
    providers,
    pagination: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    },
  };
};

export const getById = async (id: string) => {
  const profile = await ProviderProfile.findById(id)
    .populate("userId", "name avatar phone")
    .populate("serviceCategories", "name iconUrl basePrice");

  if (!profile || profile.approvalStatus !== "approved") {
    throw new AppError("Provider not found", 404);
  }
  return profile;
};
