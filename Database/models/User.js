const pool = require("../config/db");
const bcrypt = require("bcryptjs");

class User {
  // Lấy tất cả người dùng
  static async getAll() {
    const [rows] = await pool.query("SELECT id, email, name, role FROM users");
    return rows;
  }

  // Lấy người dùng theo ID
  static async getById(userId) {
    const [rows] = await pool.query("SELECT id, email, name, role FROM users WHERE id = ?", [userId]);
    return rows[0] || null;
  }

  // Kiểm tra email có tồn tại không
  static async emailExists(email) {
    const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    return rows.length > 0;
  }

  // Đăng ký người dùng mới (bao gồm mật khẩu)
  static async create({ name, email, password, role = "customer" }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );
    return result.insertId;
  }

  // Kiểm tra email và lấy thông tin người dùng
  static async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows.length > 0 ? rows[0] : null;
  }

  // So sánh mật khẩu khi đăng nhập
  static async comparePassword(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }

  // Cập nhật người dùng (không đổi mật khẩu)
  static async update(userId, { email, name, role }) {
    const [result] = await pool.query(
      "UPDATE users SET email = ?, name = ?, role = ? WHERE id = ?",
      [email, name, role, userId]
    );
    return result.affectedRows > 0;
  }

  // Xóa người dùng
  static async delete(userId) {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [userId]);
    return result.affectedRows > 0;
  }
}

module.exports = User;
