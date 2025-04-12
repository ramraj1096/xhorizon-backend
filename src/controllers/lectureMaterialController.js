import LectureMaterial from "../models/lectureMaterialSchema.js";
import { uploadFile } from "../utils/uploadFile.js";

// 1. Add Lecture Material
export const addLectureMaterial = async (req, res) => {
  try {
    const { title, type, courseId, uploadedBy } = req.body;

    // If file is uploaded, upload and use URL
    let uploadedUrl = req.body.fileUrl; // fallback if sent as text

    if (req.file) {
      const isPDF = req.file.mimetype === "application/pdf";
      uploadedUrl = await uploadFile(req.file, "auto");
      console.log(uploadedUrl);
    }

    if (!uploadedUrl) {
      return res.status(400).json({
        success: false,
        message: "File or fileUrl is required",
      });
    }

    const newMaterial = new LectureMaterial({
      title,
      type,
      fileUrl: uploadedUrl,
      courseId,
      uploadedBy,
    });

    await newMaterial.save();

    res.status(201).json({
      success: true,
      message: "Lecture material added successfully",
      material: newMaterial,
    });
  } catch (error) {
    console.error("Error adding lecture material:", error);
    res.status(500).json({ message: "Server error" });
  }
};
//  2. Edit Lecture Material
export const editLectureMaterial = async (req, res) => {
  try {
    const materialId = req.params.id;

    if (!materialId) {
      return res.status(400).json({
        success: false,
        message: "Lecture material ID is required",
      });
    }

    const updateFields = {};
    const allowedFields = ["title", "type"];

    // Update text fields
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    // Update file if a new one is uploaded
    if (req.file) {
      const uploadedUrl = await uploadFile(req.file); // auto-detects type
      updateFields.fileUrl = uploadedUrl;
    }

    const updatedMaterial = await LectureMaterial.findByIdAndUpdate(
      materialId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedMaterial) {
      return res.status(404).json({
        success: false,
        message: "Lecture material not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lecture material updated successfully",
      material: updatedMaterial,
    });
  } catch (error) {
    console.error("Error editing lecture material:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllLectureMaterials = async (req, res) => {
  try {
    const courseId = req.query.courseId;

    const materials = courseId
      ? await LectureMaterial.find({ courseId }).populate("uploadedBy", "name")
      : await LectureMaterial.find().populate("uploadedBy", "name");

    res.status(200).json({
      success: true,
      materials,
    });
  } catch (error) {
    console.error("Error fetching lecture materials:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🗑️ 4. Delete Lecture Material
export const deleteLectureMaterial = async (req, res) => {
  try {
    const materialId = req.params.id;

    const deleted = await LectureMaterial.findByIdAndDelete(materialId);

    if (!deleted) {
      return res.status(404).json({ message: "Material not found" });
    }

    res.status(200).json({
      success: true,
      message: "Lecture material deleted",
      material: deleted,
    });
  } catch (error) {
    console.error("Error deleting material:", error);
    res.status(500).json({ message: "Server error" });
  }
};
