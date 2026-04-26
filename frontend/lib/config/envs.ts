export const envs = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "",
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "catalog-products",
  },
};
