import "server-only";

import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary configuration. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local.");
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
}

export async function uploadProductImage(file: File, sellerId: string): Promise<UploadApiResponse> {
  configureCloudinary();
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `greencart/products/${sellerId}`, resource_type: "image", overwrite: false },
      (error, result) => error || !result ? reject(error ?? new Error("Cloudinary did not return an image.")) : resolve(result),
    );
    stream.end(buffer);
  });
}

export async function deleteCloudinaryImages(publicIds: string[]) {
  if (!publicIds.length) return;
  configureCloudinary();
  await cloudinary.api.delete_resources(publicIds, { resource_type: "image" });
}
