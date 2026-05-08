import { cloudinary } from "../config/cloudinary";
import type { UploadApiResponse } from "cloudinary";

/**
 * Upload a file buffer to Cloudinary
 * @param buffer  - File buffer from multer memoryStorage
 * @param folder  - Cloudinary folder (e.g. "bookings", "providers")
 */
export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"));
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * Delete an image from Cloudinary by its public_id
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};
