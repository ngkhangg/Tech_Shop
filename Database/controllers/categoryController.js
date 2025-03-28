const Category = require("../models/Category");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Lỗi lấy danh mục:", error);
    res.status(500).json({ error: "Không thể lấy danh mục" });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.getById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Danh mục không tồn tại" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Lỗi lấy danh mục:", error);
    res.status(500).json({ error: "Không thể lấy danh mục" });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Tên danh mục là bắt buộc" });

    const categoryId = await Category.create({ name, description });
    res.status(201).json({ message: "Tạo danh mục thành công", categoryId });
  } catch (error) {
    console.error("Lỗi tạo danh mục:", error);
    res.status(500).json({ error: "Không thể tạo danh mục" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const success = await Category.update(req.params.id, { name, description });

    if (!success) return res.status(404).json({ error: "Danh mục không tồn tại" });

    res.status(200).json({ message: "Cập nhật danh mục thành công" });
  } catch (error) {
    console.error("Lỗi cập nhật danh mục:", error);
    res.status(500).json({ error: "Không thể cập nhật danh mục" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const success = await Category.delete(req.params.id);

    if (!success) return res.status(404).json({ error: "Danh mục không tồn tại" });

    res.status(200).json({ message: "Xóa danh mục thành công" });
  } catch (error) {
    console.error("Lỗi xóa danh mục:", error);
    res.status(500).json({ error: "Không thể xóa danh mục" });
  }
};
