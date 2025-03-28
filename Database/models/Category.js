const pool = require("../config/db");

class Category {
  // Lấy tất cả danh mục
  static async getAll() {
    const [rows] = await pool.execute("SELECT * FROM categories");
    return rows;
  }

  // Lấy danh mục theo ID
  static async getById(categoryId) {
    const [rows] = await pool.execute("SELECT * FROM categories WHERE id = ?", [categoryId]);
    return rows[0] || null;
  }

  // Thêm danh mục mới
  static async create({ name, description }) {
    const [result] = await pool.execute(
      "INSERT INTO categories (name, description) VALUES (?, ?)",
      [name, description]
    );
    return result.insertId;
  }

  // Cập nhật danh mục
  static async update(categoryId, { name, description }) {
    const [result] = await pool.execute(
      "UPDATE categories SET name = ?, description = ? WHERE id = ?",
      [name, description, categoryId]
    );
    return result.affectedRows > 0;
  }

  // Xóa danh mục
  static async delete(categoryId) {
    const [result] = await pool.execute("DELETE FROM categories WHERE id = ?", [categoryId]);
    return result.affectedRows > 0;
  }
}

module.exports = Category;
