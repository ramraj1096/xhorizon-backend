import cloudinary from "../configurations/cloudinaryConfig.js";

export const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("No file uploaded"));

    const fileType = file.mimetype;
    const isPdf = fileType === "application/pdf";
    const isVideo = fileType.startsWith("video/");
    const isImage = fileType.startsWith("image/");

    // 👇 Force everything to upload as "upload" resource type
    const resourceType = "auto";

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder: "lectures",
        public_id: file.originalname.split(".")[0],
        use_filename: true,
        unique_filename: false,
        format: isPdf ? "pdf" : undefined, // ✅ this helps with PDF previews
      },
      (error, result) => {
        if (error) return reject(error);
        if (result?.secure_url) return resolve(result.secure_url);
        reject(new Error("Upload failed"));
      }
    );

    stream.end(file.buffer);
  });
};
